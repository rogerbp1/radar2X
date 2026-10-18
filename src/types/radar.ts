export type WaveStage = 'EARLY_WAVE' | 'EXPLODING' | 'SATURATED';

export interface EvidenceItem {
  id: string;
  platform: 'YOUTUBE' | 'LINKEDIN' | 'TIKTOK' | 'INSTAGRAM' | 'WEB';
  title: string;
  url: string;
  author: string;
  publishedAt: string;
  metrics: {
    viewsOrEngagement: number;
    outlierVelocityScore: number; // Vistas o interacciones por hora desde su publicación
  };
  snippetOrTranscript: string;
}

export interface JevModelVote {
  model: string;
  j: number;
  e: number;
  v: number;
  total: number;
}

export interface TypeSafeJevDecisionOutput {
  engineUsed: string;
  isLiveTypeSafeApi: boolean;
  latencyMs: number;
  noulB2bActionableProb: number; // Primitive 1: noul (0..1 calibrated probability)
  choiceWaveStage: {             // Primitive 2: choice (categorical distribution)
    selected: WaveStage;
    probabilities: Record<WaveStage, number>;
    confidence: number;
  };
  choiceWinningFormat: {         // Primitive 2: choice (format distribution)
    selected: string;
    probabilities: Record<string, number>;
    confidence: number;
  };
  calibratedScores: {            // Primitive 3: score (0..1 rubric scores + confidence)
    audienceFit: { score: number; confidence: number };
    earlyTiming: { score: number; confidence: number };
    formatViability: { score: number; confidence: number };
  };
}

export interface JevStatisticalTelemetry {
  statBase: {
    j_stat: number;
    e_stat: number;
    v_stat: number;
    statTotal: number;
  };
  llmConsensus: {
    modelsConsulted: number;
    votes: JevModelVote[];
    stdDevSigma: number;
    consensusConfidence: number;
  };
  empiricalMetrics: {
    maxOutlierVelocityPerHour: number;
    meanOutlierVelocityPerHour: number;
    activeNetworksCount: number;
    arbitrageRatioUsLatam: number;
    b2bSignalDensityPercent: number;
  };
  typesafeJevSystemOne?: TypeSafeJevDecisionOutput;
}

export interface JevEvaluation {
  j_audienceFit: number;       // 1-10: Relevancia ejecutiva para líderes/equipos en LatAm
  e_earlyTiming: number;       // 1-10: Qué tan temprano estamos en la ola en español
  v_formatViability: number;   // 1-10: Qué tan replicable y viral es el gancho/formato
  totalScore: number;          // Promedio ponderado: Number(((J * 0.4) + (E * 0.35) + (V * 0.25)).toFixed(1))
  reasoning: string;           // Justificación ejecutiva en 2 líneas
  statisticalTelemetry?: JevStatisticalTelemetry;
}

export interface WhyItWorked {
  hookPattern: string;         // Psicología y estructura de los primeros 3 segundos o 2 líneas
  winningFormat: string;       // Ej: Demo pantalla dividida, Contrarianismo, Caso de ROI real
  emotionalDriver: string;     // Ej: FOMO ejecutivo, Ahorro de costos, Reemplazo de tareas manuales
}

export interface Adaptation30X {
  suggestedHooks: string[];    // 3 ganchos directos al estilo Andrés Bilbao
  reelScriptBilbao: {
    hook_0_3s: string;
    problem_3_15s: string;
    solution_15_40s: string;
    cta_40_60s: string;
  };
  carousel30X: string[];       // Array de 6 slides estructurados para el Instagram/LinkedIn de @crece30x
}

export interface RadarTrendItem {
  rank: number;
  id: string;
  topicTitle: string;
  searchKeyword: string;
  waveStage: WaveStage;
  growthMetrics: {
    usGrowthPercent: number;
    latamGrowthPercent: number;
    arbitrageGap: string;      // Explicación corta de la oportunidad US -> LatAm
  };
  jev: JevEvaluation;
  whyItWorked: WhyItWorked;
  adaptation: Adaptation30X;
  evidence: EvidenceItem[];
}

export interface RadarApiResponse {
  generatedAt: string;
  sourceMode: 'LIVE_APIS' | 'HYBRID_FALLBACK';
  activeModelUsed: string;
  trends: RadarTrendItem[];
}
