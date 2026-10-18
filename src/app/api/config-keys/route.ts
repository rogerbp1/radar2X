import fs from 'fs';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';
import { getEnvKey } from '@/lib/config/envKeys';
import { searchYouTubeOutliers } from '@/lib/collectors/youtube';
import { searchIndexedSocialPosts } from '@/lib/collectors/socialSearch';
import { callTypeSafeJevSystemOne } from '@/lib/ai/openrouterClient';

const ENV_LOCAL_PATH = path.join(process.cwd(), '.env.local');

function parseEnvFile(content: string): Record<string, string> {
  const result: Record<string, string> = {};
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIndex = trimmed.indexOf('=');
    if (eqIndex === -1) continue;
    const key = trimmed.slice(0, eqIndex).trim();
    const val = trimmed.slice(eqIndex + 1).trim();
    result[key] = val;
  }
  return result;
}

export async function GET(req: NextRequest) {
  try {
    const openrouterConfigured = Boolean(getEnvKey('OPENROUTER_API_KEY'));
    const youtubeConfigured = Boolean(getEnvKey('YOUTUBE_API_KEY'));
    const tavilyConfigured = Boolean(getEnvKey('TAVILY_API_KEY'));

    const verify = req.nextUrl.searchParams.get('verify') === 'true';
    if (!verify) {
      return NextResponse.json({
        openrouterConfigured,
        youtubeConfigured,
        tavilyConfigured,
      });
    }

    // Live ping test across all 3 configured APIs (YouTube v3 + Tavily + TypeSafe Jev System 1 on OpenRouter)
    const [ytTest, socialTest] = await Promise.all([
      searchYouTubeOutliers('MCP Server', 1),
      searchIndexedSocialPosts('MCP Server', 1),
    ]);

    const jevDecision = await callTypeSafeJevSystemOne({
      keyword: 'MCP Server',
      waveStage: 'EARLY_WAVE',
      usGrowthPercent: 340,
      latamGrowthPercent: 38,
      evidence: [...ytTest.items, ...socialTest.items],
    });

    return NextResponse.json({
      openrouterConfigured,
      youtubeConfigured,
      tavilyConfigured,
      liveVerification: {
        youtubeLiveOk: ytTest.isLive,
        sampleYouTube: ytTest.items[0]
          ? {
              title: ytTest.items[0].title,
              url: ytTest.items[0].url,
              velocity: ytTest.items[0].metrics.outlierVelocityScore,
            }
          : null,
        tavilyLiveOk: socialTest.isLive,
        sampleSocial: socialTest.items[0]
          ? {
              platform: socialTest.items[0].platform,
              title: socialTest.items[0].title,
              url: socialTest.items[0].url,
            }
          : null,
        openrouterLiveOk: jevDecision.isLiveTypeSafeApi,
        modelUsed: `${jevDecision.engineUsed} (noul_b2b=${Math.round(jevDecision.noulB2bActionableProb * 100)}%, choice=${jevDecision.choiceWaveStage.selected}, latency=${jevDecision.latencyMs}ms)`,
        typesafeJevDecision: jevDecision,
      },
    });
  } catch (err) {
    return NextResponse.json({
      openrouterConfigured: false,
      youtubeConfigured: false,
      tavilyConfigured: false,
      error: (err as Error).message,
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const exists = fs.existsSync(ENV_LOCAL_PATH);
    const currentContent = exists ? fs.readFileSync(ENV_LOCAL_PATH, 'utf8') : '';
    const currentVars = parseEnvFile(currentContent);

    if (typeof body.OPENROUTER_API_KEY === 'string' && body.OPENROUTER_API_KEY.trim()) {
      currentVars.OPENROUTER_API_KEY = body.OPENROUTER_API_KEY.trim();
      process.env.OPENROUTER_API_KEY = body.OPENROUTER_API_KEY.trim();
    }
    if (typeof body.YOUTUBE_API_KEY === 'string' && body.YOUTUBE_API_KEY.trim()) {
      currentVars.YOUTUBE_API_KEY = body.YOUTUBE_API_KEY.trim();
      process.env.YOUTUBE_API_KEY = body.YOUTUBE_API_KEY.trim();
    }
    if (typeof body.TAVILY_API_KEY === 'string' && body.TAVILY_API_KEY.trim()) {
      currentVars.TAVILY_API_KEY = body.TAVILY_API_KEY.trim();
      process.env.TAVILY_API_KEY = body.TAVILY_API_KEY.trim();
    }

    const newFileContent = [
      '# ============================================================================',
      '# 🔑 ARCHIVO DE CONEXIÓN DE APIs REALES — 30X HackRadar (.env.local)',
      '# ============================================================================',
      `OPENROUTER_API_KEY=${currentVars.OPENROUTER_API_KEY || ''}`,
      `YOUTUBE_API_KEY=${currentVars.YOUTUBE_API_KEY || ''}`,
      `TAVILY_API_KEY=${currentVars.TAVILY_API_KEY || ''}`,
      '',
    ].join('\n');

    fs.writeFileSync(ENV_LOCAL_PATH, newFileContent, 'utf8');

    return NextResponse.json({
      saved: true,
      openrouterConfigured: Boolean(currentVars.OPENROUTER_API_KEY),
      youtubeConfigured: Boolean(currentVars.YOUTUBE_API_KEY),
      tavilyConfigured: Boolean(currentVars.TAVILY_API_KEY),
    });
  } catch (err) {
    return NextResponse.json(
      { saved: false, error: (err as Error).message },
      { status: 500 }
    );
  }
}
