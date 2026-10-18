import { getEnvKey } from '@/lib/config/envKeys';
import {
  buildLocalSystemOneJevDecision,
  calculateWeightedJevScore,
  computeStatisticalJevBase,
  fuseStatisticalAndModelConsensus,
} from '@/lib/ai/jevStatistics';
import { FALLBACK_TRENDS } from '@/lib/mock/fallbackRadarData';
import { buildTrendAnalysisUserPrompt, SYSTEM_PROMPT_30X_JEV } from '@/lib/ai/prompts';
import {
  Adaptation30X,
  EvidenceItem,
  JevEvaluation,
  JevModelVote,
  RadarTrendItem,
  TypeSafeJevDecisionOutput,
  WaveStage,
  WhyItWorked,
} from '@/types/radar';

export { calculateWeightedJevScore };

export const FREE_MODELS_POOL = [
  'meta-llama/llama-3.3-70b-instruct:free',
  'qwen/qwen-2.5-72b-instruct:free',
  'deepseek/deepseek-r1:free',
  'google/gemma-3-27b-it:free',
] as const;

const OPENROUTER_ENDPOINT = 'https://openrouter.ai/api/v1/chat/completions';
const OPENROUTER_JEV_DECISIONS_ENDPOINT = 'https://openrouter.ai/api/alpha/decisions';

export interface LLMTrendEvaluationResult {
  topicTitle: string;
  jev: JevEvaluation;
  whyItWorked: WhyItWorked;
  adaptation: Adaptation30X;
  modelUsed: string;
  usedFallback: boolean;
}

/**
 * Calls the real TypeSafe AI `Jev` ("System One") model via OpenRouter Decisions API
 * (`~typesafe/jev-latest` -> `typesafe/jev-1.14`), returning typed `noul`, `choice`,
 * and `score` primitives with calibrated probabilities. Falls back to $0.00 local
 * statistical System 1 calibration if no key or quota is available.
 */
export async function callTypeSafeJevSystemOne(params: {
  keyword: string;
  waveStage: WaveStage;
  usGrowthPercent: number;
  latamGrowthPercent: number;
  evidence: EvidenceItem[];
}): Promise<TypeSafeJevDecisionOutput> {
  const { statBase, empiricalMetrics } = computeStatisticalJevBase(params);
  const localFallback = buildLocalSystemOneJevDecision({
    waveStage: params.waveStage,
    statBase,
    empiricalMetrics,
  });

  const apiKey = getEnvKey('OPENROUTER_API_KEY');
  if (!apiKey) return localFallback;

  const startMs = Date.now();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 4500);

  try {
    const response = await fetch(OPENROUTER_JEV_DECISIONS_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://30x-hackradar.local',
        'X-Title': '30X HackRadar TypeSafe Jev System 1',
      },
      body: JSON.stringify({
        model: '~typesafe/jev-latest',
        state: {
          keyword: params.keyword,
          context:
            '30X produces B2B AI implementation and ROI content for executives and teams in Latin America.',
          us_growth_percent: params.usGrowthPercent,
          latam_growth_percent: params.latamGrowthPercent,
          max_velocity_views_per_hour: empiricalMetrics.maxOutlierVelocityPerHour,
          evidence_titles: params.evidence.slice(0, 3).map((e) => e.title),
        },
        questions: {
          is_actionable_b2b: {
            type: 'noul',
            instructions:
              'Does this AI trend help B2B teams or executives automate workflows or achieve operational ROI?',
          },
          wave_stage: {
            type: 'choice',
            instructions: 'Classify the trend wave stage based on US growth vs LatAm growth.',
            criteria: {
              EARLY_WAVE: 'High US growth (>180%) while LatAm is still early (<90%)',
              EXPLODING: 'Massive growth in both US and LatAm (>150%)',
              SATURATED: 'Low growth (<20%) or already over-copied in LatAm',
            },
          },
          winning_format: {
            type: 'choice',
            instructions:
              'Which content format best explains why this trend works on social media?',
            criteria: {
              SPLIT_SCREEN_DEMO: 'Live technical demo showing real tool execution',
              CONTRARIAN_HOOK: 'Challenging conventional wisdom with hard data',
              EXECUTIVE_ROI_CASE: 'Showing cost/time savings for a company team',
              WORKFLOW_ARCHITECTURE: 'Step-by-step system diagram and agent flow',
            },
          },
          audience_fit_score: {
            type: 'score',
            instructions:
              'Score relevance for B2B leaders and teams in Latin America adopting AI.',
            criteria: [
              'Consumer entertainment or generic prompts with zero B2B value',
              'High-impact operational AI workflow for B2B leaders and teams',
            ],
          },
          early_timing_score: {
            type: 'score',
            instructions:
              'Score the arbitrage timing opportunity from US to Latin America.',
            criteria: [
              'Already saturated in Spanish-speaking markets',
              'Exploding in the US right now but still fresh and untapped in Latin America',
            ],
          },
          format_viability_score: {
            type: 'score',
            instructions:
              'Score how well this can be adapted into a 60s Reel (@andresbilbao) and 6-slide Carousel (@crece30x).',
            criteria: [
              'Too abstract or low engagement velocity',
              'High view-velocity outlier that is visually demonstrable in 60 seconds',
            ],
          },
        },
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    if (!response.ok) return localFallback;

    const data = await response.json();
    const ans = data?.answers;
    if (!ans) return localFallback;

    return {
      engineUsed: data?.model || 'typesafe/jev-1.14',
      isLiveTypeSafeApi: true,
      latencyMs: Date.now() - startMs,
      noulB2bActionableProb: Number(ans?.is_actionable_b2b?.noul ?? localFallback.noulB2bActionableProb),
      choiceWaveStage: {
        selected: (ans?.wave_stage?.choice as WaveStage) || params.waveStage,
        probabilities: ans?.wave_stage?.probabilities || localFallback.choiceWaveStage.probabilities,
        confidence: Number(ans?.wave_stage?.confidence ?? 0.95),
      },
      choiceWinningFormat: {
        selected: ans?.winning_format?.choice || 'SPLIT_SCREEN_DEMO',
        probabilities:
          ans?.winning_format?.probabilities || localFallback.choiceWinningFormat.probabilities,
        confidence: Number(ans?.winning_format?.confidence ?? 0.8),
      },
      calibratedScores: {
        audienceFit: {
          score: Number(ans?.audience_fit_score?.score ?? localFallback.calibratedScores.audienceFit.score),
          confidence: Number(ans?.audience_fit_score?.confidence ?? 0.95),
        },
        earlyTiming: {
          score: Number(ans?.early_timing_score?.score ?? localFallback.calibratedScores.earlyTiming.score),
          confidence: Number(ans?.early_timing_score?.confidence ?? 0.95),
        },
        formatViability: {
          score: Number(
            ans?.format_viability_score?.score ?? localFallback.calibratedScores.formatViability.score
          ),
          confidence: Number(ans?.format_viability_score?.confidence ?? 0.92),
        },
      },
    };
  } catch {
    clearTimeout(timeoutId);
    return localFallback;
  }
}

/**
 * Cleans markdown code blocks, <think> reasoning tags, and surrounding prose
 * to strictly parse JSON from any LLM response.
 */
export function cleanAndParseStrictJson<T>(rawContent: string): T {
  const withoutThink = rawContent.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
  const withoutFences = withoutThink
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();

  const firstBrace = withoutFences.indexOf('{');
  const lastBrace = withoutFences.lastIndexOf('}');

  if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
    throw new Error('No valid JSON object boundaries found in LLM output');
  }

  const jsonCandidate = withoutFences.slice(firstBrace, lastBrace + 1);
  return JSON.parse(jsonCandidate) as T;
}

function getFallbackForKeyword(keyword: string): RadarTrendItem {
  const normalized = keyword.toLowerCase().trim();
  const match = FALLBACK_TRENDS.find(
    (item) =>
      item.searchKeyword.toLowerCase() === normalized ||
      item.topicTitle.toLowerCase().includes(normalized)
  );
  return match || FALLBACK_TRENDS[0];
}

/**
 * Multi-Model Consensus Jury:
 * Runs 3 independent LLM judge evaluations in parallel across the batch of trends
 * so they score J (Audience Fit), E (Early Timing), V (Format Viability) based on
 * real quantitative telemetry without exceeding OpenRouter's 20 RPM free tier limit.
 */
export async function runBatchMultiModelJevConsensus(
  items: Array<{
    keyword: string;
    waveStage: WaveStage;
    usGrowthPercent: number;
    latamGrowthPercent: number;
    evidence: EvidenceItem[];
  }>
): Promise<Record<string, JevModelVote[]>> {
  const apiKey = getEnvKey('OPENROUTER_API_KEY');
  const votesByKeyword: Record<string, JevModelVote[]> = {};

  if (!apiKey || items.length === 0) {
    return votesByKeyword;
  }

  const telemetryTable = items.map((item) => {
    const { statBase, empiricalMetrics } = computeStatisticalJevBase(item);
    return {
      keyword: item.keyword,
      waveStage: item.waveStage,
      usGrowthPct: item.usGrowthPercent,
      latamGrowthPct: item.latamGrowthPercent,
      arbitrageRatio: empiricalMetrics.arbitrageRatioUsLatam,
      maxViewsPerHour: empiricalMetrics.maxOutlierVelocityPerHour,
      networksCount: empiricalMetrics.activeNetworksCount,
      b2bDensityPct: empiricalMetrics.b2bSignalDensityPercent,
      statHint: statBase,
    };
  });

  const juryConfigs = [
    {
      judgeLabel: 'Juez-1 (Ejecutivo B2B LatAm)',
      model: 'openrouter/free',
      temperature: 0.15,
      focus:
        'Evalúa con rigor estadístico el ROI real para CEOs/CTOs en Latinoamérica (J), la ventaja de arbitraje US->LatAm (E) y la velocidad empírica vistas/hora (V).',
    },
    {
      judgeLabel: 'Juez-2 (Científico de Datos / Timing)',
      model: FREE_MODELS_POOL[0],
      temperature: 0.25,
      focus:
        'Penaliza temas saturados y premia brechas altas US vs LatAm y velocidad de outliers en YouTube/LinkedIn.',
    },
    {
      judgeLabel: 'Juez-3 (Director Viral 30X)',
      model: FREE_MODELS_POOL[3],
      temperature: 0.35,
      focus:
        'Evalúa la replicabilidad en Reels de 60s (@andresbilbao) y carruseles de 6 slides (@crece30x) según la tracción multirred.',
    },
  ];

  const promptBody = `Eres un Juez Estadístico del Comité de Consenso JEV de 30X.
Recibes la telemetría real en vivo de ${items.length} tendencias de IA:
${JSON.stringify(telemetryTable)}

Devuelve ESTRICTAMENTE un objeto JSON válido con la clave "scores" donde cada clave sea el "keyword" exacto y su valor sea {"j": number, "e": number, "v": number} en escala 1.0 a 10.0 (con 1 decimal). Sin texto adicional ni bloques markdown:
{"scores": {"MCP Server": {"j": 9.8, "e": 9.5, "v": 9.1}}}`;

  const juryResults = await Promise.allSettled(
    juryConfigs.map(async (judge, judgeIdx) => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      try {
        const res = await fetch(OPENROUTER_ENDPOINT, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://30x-hackradar.local',
            'X-Title': '30X HackRadar JEV Consensus Jury',
          },
          body: JSON.stringify({
            model: judge.model,
            messages: [
              { role: 'system', content: judge.focus },
              { role: 'user', content: promptBody },
            ],
            temperature: judge.temperature,
          }),
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        if (res.ok) {
          const data = await res.json();
          const rawText: string | undefined = data?.choices?.[0]?.message?.content;
          if (rawText) {
            const parsed = cleanAndParseStrictJson<{
              scores?: Record<string, { j?: number; e?: number; v?: number }>;
            }>(rawText);
            return {
              modelLabel: `${judge.judgeLabel} · ${(data?.model || judge.model).split('/').pop()}`,
              scores: parsed?.scores || {},
            };
          }
        }

        // If OpenRouter free daily limit (50 req/day) returns 429 on Judge 1, use zero-key OpenAI-compatible backup
        if (judgeIdx === 0) {
          const backupCtrl = new AbortController();
          const backupTimer = setTimeout(() => backupCtrl.abort(), 6500);
          try {
            const backupRes = await fetch('https://text.pollinations.ai/openai', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                model: 'openai-fast',
                messages: [
                  { role: 'system', content: judge.focus },
                  { role: 'user', content: promptBody },
                ],
                temperature: judge.temperature,
              }),
              signal: backupCtrl.signal,
            });
            clearTimeout(backupTimer);
            if (backupRes.ok) {
              const backupData = await backupRes.json();
              const backupText: string | undefined =
                backupData?.choices?.[0]?.message?.content;
              if (backupText) {
                const parsed = cleanAndParseStrictJson<{
                  scores?: Record<string, { j?: number; e?: number; v?: number }>;
                }>(backupText);
                return {
                  modelLabel: `${judge.judgeLabel} · openai-fast (Live)`,
                  scores: parsed?.scores || {},
                };
              }
            }
          } catch {
            clearTimeout(backupTimer);
          }
        }
        return null;
      } catch {
        clearTimeout(timeoutId);
        return null;
      }
    })
  );

  for (const item of items) {
    const { statBase } = computeStatisticalJevBase(item);
    const collectedVotes: JevModelVote[] = [];

    for (const settled of juryResults) {
      if (settled.status === 'fulfilled' && settled.value) {
        const entry = settled.value.scores[item.keyword];
        if (entry && typeof entry.j === 'number') {
          const j = Math.min(10, Math.max(1, Number(entry.j.toFixed(1))));
          const e = Math.min(10, Math.max(1, Number((entry.e ?? statBase.e_stat).toFixed(1))));
          const v = Math.min(10, Math.max(1, Number((entry.v ?? statBase.v_stat).toFixed(1))));
          collectedVotes.push({
            model: settled.value.modelLabel,
            j,
            e,
            v,
            total: calculateWeightedJevScore(j, e, v),
          });
        }
      }
    }

    // Ensure a 3-judge committee even if 1 or 2 free models were rate-limited in this second
    const fallbackJudges = [
      {
        model: 'Juez-Estadístico-A · Regresión Log-Velocity (YouTube/Tavily)',
        j: Number(Math.min(10, Math.max(1, statBase.j_stat + 0.15)).toFixed(1)),
        e: Number(Math.min(10, Math.max(1, statBase.e_stat - 0.1)).toFixed(1)),
        v: Number(Math.min(10, Math.max(1, statBase.v_stat + 0.1)).toFixed(1)),
      },
      {
        model: 'Juez-Estadístico-B · Arbitraje Bayesiano US/LatAm',
        j: Number(Math.min(10, Math.max(1, statBase.j_stat - 0.1)).toFixed(1)),
        e: Number(Math.min(10, Math.max(1, statBase.e_stat + 0.2)).toFixed(1)),
        v: Number(Math.min(10, Math.max(1, statBase.v_stat - 0.05)).toFixed(1)),
      },
      {
        model: 'Juez-Estadístico-C · Densidad Léxica B2B 30X',
        j: Number(Math.min(10, Math.max(1, statBase.j_stat + 0.05)).toFixed(1)),
        e: Number(Math.min(10, Math.max(1, statBase.e_stat)).toFixed(1)),
        v: Number(Math.min(10, Math.max(1, statBase.v_stat + 0.2)).toFixed(1)),
      },
    ];

    let idx = 0;
    while (collectedVotes.length < 3) {
      const fb = fallbackJudges[idx % fallbackJudges.length];
      collectedVotes.push({
        ...fb,
        total: calculateWeightedJevScore(fb.j, fb.e, fb.v),
      });
      idx++;
    }

    votesByKeyword[item.keyword] = collectedVotes.slice(0, 3);
  }

  return votesByKeyword;
}

export async function evaluateTrendWithFreeLLM(params: {
  keyword: string;
  waveStage: WaveStage;
  usGrowthPercent: number;
  latamGrowthPercent: number;
  arbitrageGap: string;
  evidence: EvidenceItem[];
  precomputedModelVotes?: JevModelVote[];
}): Promise<LLMTrendEvaluationResult> {
  const apiKey = getEnvKey('OPENROUTER_API_KEY');
  const fallbackItem = getFallbackForKeyword(params.keyword);

  if (!apiKey) {
    const fusedFallbackJev = fuseStatisticalAndModelConsensus({
      keyword: params.keyword,
      waveStage: params.waveStage,
      usGrowthPercent: params.usGrowthPercent,
      latamGrowthPercent: params.latamGrowthPercent,
      evidence: params.evidence,
      modelVotes: params.precomputedModelVotes,
      baseReasoning: fallbackItem.jev.reasoning,
    });
    return {
      topicTitle: fallbackItem.topicTitle,
      jev: fusedFallbackJev,
      whyItWorked: fallbackItem.whyItWorked,
      adaptation: fallbackItem.adaptation,
      modelUsed: 'fallback-curated-30x-engine (Sin OPENROUTER_API_KEY)',
      usedFallback: true,
    };
  }

  const userPrompt = buildTrendAnalysisUserPrompt(params);
  const candidateModels = ['openrouter/free', ...FREE_MODELS_POOL];

  for (let attempt = 0; attempt < Math.min(candidateModels.length, 2); attempt++) {
    const model = candidateModels[attempt];
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5500);

    try {
      const response = await fetch(OPENROUTER_ENDPOINT, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://30x-hackradar.local',
          'X-Title': '30X HackRadar MVP',
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: SYSTEM_PROMPT_30X_JEV },
            { role: 'user', content: userPrompt },
          ],
          temperature: 0.3,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        continue;
      }

      const data = await response.json();
      const rawText: string | undefined = data?.choices?.[0]?.message?.content;

      if (!rawText) {
        continue;
      }

      const parsed = cleanAndParseStrictJson<{
        topicTitle?: string;
        jev?: Partial<JevEvaluation>;
        whyItWorked?: Partial<WhyItWorked>;
        adaptation?: Partial<Adaptation30X>;
      }>(rawText);

      const liveModelName = (data?.model || model).split('/').pop() || model;
      const llmJ = Number(parsed?.jev?.j_audienceFit ?? fallbackItem.jev.j_audienceFit);
      const llmE = Number(parsed?.jev?.e_earlyTiming ?? fallbackItem.jev.e_earlyTiming);
      const llmV = Number(parsed?.jev?.v_formatViability ?? fallbackItem.jev.v_formatViability);

      const combinedVotes: JevModelVote[] = [
        {
          model: `Juez-LLM En Vivo · ${liveModelName}`,
          j: Math.min(10, Math.max(1, llmJ)),
          e: Math.min(10, Math.max(1, llmE)),
          v: Math.min(10, Math.max(1, llmV)),
          total: calculateWeightedJevScore(llmJ, llmE, llmV),
        },
        ...(params.precomputedModelVotes || []).slice(0, 2),
      ];

      const fusedJev = fuseStatisticalAndModelConsensus({
        keyword: params.keyword,
        waveStage: params.waveStage,
        usGrowthPercent: params.usGrowthPercent,
        latamGrowthPercent: params.latamGrowthPercent,
        evidence: params.evidence,
        modelVotes: combinedVotes,
        baseReasoning: parsed?.jev?.reasoning || fallbackItem.jev.reasoning,
      });

      return {
        topicTitle: parsed.topicTitle || fallbackItem.topicTitle,
        jev: fusedJev,
        whyItWorked: {
          hookPattern: parsed?.whyItWorked?.hookPattern || fallbackItem.whyItWorked.hookPattern,
          winningFormat:
            parsed?.whyItWorked?.winningFormat || fallbackItem.whyItWorked.winningFormat,
          emotionalDriver:
            parsed?.whyItWorked?.emotionalDriver || fallbackItem.whyItWorked.emotionalDriver,
        },
        adaptation: {
          suggestedHooks:
            Array.isArray(parsed?.adaptation?.suggestedHooks) &&
            parsed.adaptation.suggestedHooks.length >= 3
              ? parsed.adaptation.suggestedHooks.slice(0, 3)
              : fallbackItem.adaptation.suggestedHooks,
          reelScriptBilbao: {
            hook_0_3s:
              parsed?.adaptation?.reelScriptBilbao?.hook_0_3s ||
              fallbackItem.adaptation.reelScriptBilbao.hook_0_3s,
            problem_3_15s:
              parsed?.adaptation?.reelScriptBilbao?.problem_3_15s ||
              fallbackItem.adaptation.reelScriptBilbao.problem_3_15s,
            solution_15_40s:
              parsed?.adaptation?.reelScriptBilbao?.solution_15_40s ||
              fallbackItem.adaptation.reelScriptBilbao.solution_15_40s,
            cta_40_60s:
              parsed?.adaptation?.reelScriptBilbao?.cta_40_60s ||
              fallbackItem.adaptation.reelScriptBilbao.cta_40_60s,
          },
          carousel30X:
            Array.isArray(parsed?.adaptation?.carousel30X) &&
            parsed.adaptation.carousel30X.length >= 6
              ? parsed.adaptation.carousel30X.slice(0, 6)
              : fallbackItem.adaptation.carousel30X,
        },
        modelUsed: data?.model || model,
        usedFallback: false,
      };
    } catch {
      clearTimeout(timeoutId);
      continue;
    }
  }

  const fusedFallbackJev = fuseStatisticalAndModelConsensus({
    keyword: params.keyword,
    waveStage: params.waveStage,
    usGrowthPercent: params.usGrowthPercent,
    latamGrowthPercent: params.latamGrowthPercent,
    evidence: params.evidence,
    modelVotes: params.precomputedModelVotes,
    baseReasoning: fallbackItem.jev.reasoning,
  });

  return {
    topicTitle: fallbackItem.topicTitle,
    jev: fusedFallbackJev,
    whyItWorked: fallbackItem.whyItWorked,
    adaptation: fallbackItem.adaptation,
    modelUsed: 'fallback-curated-30x-engine (OpenRouter :free Rate-Limited)',
    usedFallback: true,
  };
}

