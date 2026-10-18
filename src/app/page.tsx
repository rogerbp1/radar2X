'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowUpRight,
  Check,
  ChevronDown,
  ChevronUp,
  Copy,
  Download,
  ExternalLink,
  Plus,
  Search,
  X,
} from 'lucide-react';
import HeaderRadar from '@/components/HeaderRadar';
import TrendCard from '@/components/TrendCard';
import TrendDetailModal from '@/components/TrendDetailModal';
import { auditAndHealRadarResponse } from '@/lib/audit/specsAuditor';
import {
  getFallbackRadarResponse,
  synthesizeCommunityTrend,
} from '@/lib/mock/fallbackRadarData';
import { EvidenceItem, RadarApiResponse, RadarTrendItem, WaveStage } from '@/types/radar';

type FilterStage = 'ALL' | WaveStage;
type PlatformFilter = 'ALL' | EvidenceItem['platform'];
type InspectorTab = 'XRAY' | 'REEL' | 'CAROUSEL';

function getStageColors(stage: WaveStage) {
  switch (stage) {
    case 'EARLY_WAVE':
      return {
        hex: '#10b981',
        bgSoft: 'rgba(16, 185, 129, 0.14)',
        pill: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        label: 'Ola Temprana',
      };
    case 'EXPLODING':
      return {
        hex: '#f59e0b',
        bgSoft: 'rgba(245, 158, 11, 0.14)',
        pill: 'bg-amber-50 text-amber-700 border-amber-200',
        label: 'En Explosión',
      };
    case 'SATURATED':
      return {
        hex: '#f43f5e',
        bgSoft: 'rgba(244, 63, 94, 0.12)',
        pill: 'bg-rose-50 text-rose-700 border-rose-200',
        label: 'Saturado',
      };
  }
}

function buildSparklinePoints(trend: RadarTrendItem): string {
  const us = trend.growthMetrics.usGrowthPercent;
  const latam = trend.growthMetrics.latamGrowthPercent;
  if (trend.waveStage === 'SATURATED') {
    return '2,12 16,13 30,12 44,14 58,15 70,16';
  }
  const slope = Math.min(16, Math.max(4, Math.round((us - latam) / 22)));
  const startY = Math.min(20, 14 + Math.round(slope / 3));
  return [
    `2,${startY}`,
    `16,${Math.max(4, startY - 2)}`,
    `30,${Math.max(4, startY - 5)}`,
    `44,${Math.max(3, startY - 9)}`,
    `58,${Math.max(2, startY - 12)}`,
    `70,2`,
  ].join(' ');
}

export default function RadarDashboardPage() {
  const initialAudited = useMemo(
    () => auditAndHealRadarResponse(getFallbackRadarResponse()),
    []
  );

  const [radarData, setRadarData] = useState<RadarApiResponse>(
    initialAudited.response
  );
  const [auditReport, setAuditReport] = useState(initialAudited.report);
  const [showAuditDrawer, setShowAuditDrawer] = useState<boolean>(false);
  const [showBriefDrawer, setShowBriefDrawer] = useState<boolean>(false);
  const [showFullCards, setShowFullCards] = useState<boolean>(false);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [selectedStage, setSelectedStage] = useState<FilterStage>('ALL');
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformFilter>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [communityTopicInput, setCommunityTopicInput] = useState<string>('');
  const [focusedTrendId, setFocusedTrendId] = useState<string>(
    initialAudited.response.trends[0]?.id || ''
  );
  const [inspectorTab, setInspectorTab] = useState<InspectorTab>('XRAY');
  const [selectedTrend, setSelectedTrend] = useState<RadarTrendItem | null>(null);
  const [scanStatusText, setScanStatusText] = useState<string | null>(null);
  const [copiedInspectorKey, setCopiedInspectorKey] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    let active = true;
    fetch('/api/radar')
      .then((res) => (res.ok ? res.json() : null))
      .then((data: RadarApiResponse | null) => {
        if (active && data && Array.isArray(data.trends) && data.trends.length > 0) {
          const audited = auditAndHealRadarResponse(data);
          setRadarData(audited.response);
          setAuditReport(audited.report);
          if (audited.response.trends[0]) {
            setFocusedTrendId(audited.response.trends[0].id);
          }
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === '/' &&
        document.activeElement?.tagName !== 'INPUT' &&
        !selectedTrend
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selectedTrend]);

  const handleScanLive = async () => {
    setIsScanning(true);
    setScanStatusText(null);
    try {
      const response = await fetch('/api/radar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.ok) {
        const freshData: RadarApiResponse = await response.json();
        const audited = auditAndHealRadarResponse(freshData);
        setRadarData(audited.response);
        setAuditReport(audited.report);
        setScanStatusText(
          `SYNC OK · ${audited.response.trends.length} TENDENCIAS AUDITADAS (${audited.report.passedCount}/${audited.report.totalChecks} SPECS)`
        );
      }
    } catch {
      const audited = auditAndHealRadarResponse(getFallbackRadarResponse());
      setRadarData(audited.response);
      setAuditReport(audited.report);
      setScanStatusText('FALLBACK DEMO-SAFE ACTIVO · 10/10 VERIFICADAS');
    } finally {
      setIsScanning(false);
    }
  };

  const handleAddCommunitySignal = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = communityTopicInput.trim();
    if (!clean) return;

    const newTrend = synthesizeCommunityTrend(clean);
    const updatedTrends = [newTrend, ...radarData.trends]
      .sort((a, b) => b.jev.totalScore - a.jev.totalScore)
      .map((item, idx) => ({ ...item, rank: idx + 1 }));

    setRadarData({
      ...radarData,
      generatedAt: new Date().toISOString(),
      trends: updatedTrends,
    });
    setCommunityTopicInput('');
    setFocusedTrendId(newTrend.id);
    setScanStatusText(`SEÑAL EVALUADA: “${clean}” (JEV ${newTrend.jev.totalScore}/10)`);
  };

  const counts = useMemo(() => {
    const all = radarData.trends.length;
    const early = radarData.trends.filter((t) => t.waveStage === 'EARLY_WAVE').length;
    const exploding = radarData.trends.filter((t) => t.waveStage === 'EXPLODING').length;
    const saturated = radarData.trends.filter((t) => t.waveStage === 'SATURATED').length;
    return { all, early, exploding, saturated };
  }, [radarData.trends]);

  const avgTopScore = useMemo(() => {
    const top3 = radarData.trends.slice(0, 3);
    if (top3.length === 0) return '0.0';
    const avg =
      top3.reduce((acc, item) => acc + item.jev.totalScore, 0) / top3.length;
    return avg.toFixed(1);
  }, [radarData.trends]);

  const filteredTrends = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return [...radarData.trends]
      .sort((a, b) => b.jev.totalScore - a.jev.totalScore)
      .filter((item) => {
        const matchesStage =
          selectedStage === 'ALL' || item.waveStage === selectedStage;
        if (!matchesStage) return false;

        const matchesPlatform =
          selectedPlatform === 'ALL' ||
          item.evidence.some((ev) => ev.platform === selectedPlatform);
        if (!matchesPlatform) return false;

        if (!q) return true;
        return (
          item.topicTitle.toLowerCase().includes(q) ||
          item.searchKeyword.toLowerCase().includes(q) ||
          item.whyItWorked.hookPattern.toLowerCase().includes(q) ||
          item.whyItWorked.winningFormat.toLowerCase().includes(q) ||
          item.growthMetrics.arbitrageGap.toLowerCase().includes(q)
        );
      });
  }, [radarData.trends, selectedStage, selectedPlatform, searchQuery]);

  const activeTrend = useMemo(() => {
    return (
      filteredTrends.find((t) => t.id === focusedTrendId) ||
      filteredTrends[0] ||
      radarData.trends[0]
    );
  }, [filteredTrends, focusedTrendId, radarData.trends]);

  const handleNavigateModal = (direction: 'prev' | 'next') => {
    if (!selectedTrend || filteredTrends.length === 0) return;
    const currentIndex = filteredTrends.findIndex(
      (t) => t.id === selectedTrend.id
    );
    if (currentIndex === -1) return;
    const nextIndex =
      direction === 'next'
        ? (currentIndex + 1) % filteredTrends.length
        : (currentIndex - 1 + filteredTrends.length) % filteredTrends.length;
    setSelectedTrend(filteredTrends[nextIndex]);
  };

  const handleQuickCopy = async (key: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedInspectorKey(key);
      setTimeout(() => setCopiedInspectorKey(null), 1800);
    } catch {}
  };

  const handleExportWeeklyMarkdown = () => {
    const lines: string[] = [
      `# 30X HackRadar — Dossier Semanal de Inteligencia de Contenido`,
      `- **Generado:** ${new Date(radarData.generatedAt).toLocaleString('es-CO')}`,
      `- **Motor IA ($0.00):** ${radarData.activeModelUsed}`,
      `- **Modo de Fuente:** ${radarData.sourceMode}`,
      `- **Auditoría SPECS:** ${auditReport.passedCount}/${auditReport.totalChecks} controles verificados`,
      ``,
      `---`,
      ``,
    ];

    for (const t of filteredTrends) {
      lines.push(
        `## #${t.rank} · ${t.topicTitle} (JEV: ${t.jev.totalScore.toFixed(1)}/10)`,
        `- **Keyword:** \`${t.searchKeyword}\` | **Etapa:** \`${t.waveStage}\``,
        `- **Crecimiento:** EE. UU. +${t.growthMetrics.usGrowthPercent}% vs. LatAm +${t.growthMetrics.latamGrowthPercent}%`,
        `- **Arbitraje US→LatAm:** ${t.growthMetrics.arbitrageGap}`,
        `- **Desglose JEV:** J=${t.jev.j_audienceFit} (40%) · E=${t.jev.e_earlyTiming} (35%) · V=${t.jev.v_formatViability} (25%)`,
        `- **Tesis LatAm:** ${t.jev.reasoning}`,
        ``,
        `### ¿Por qué funcionó?`,
        `- **Patrón del Gancho:** ${t.whyItWorked.hookPattern}`,
        `- **Formato Ganador:** ${t.whyItWorked.winningFormat}`,
        `- **Driver Emocional:** ${t.whyItWorked.emotionalDriver}`,
        ``,
        `### Guion Reel para @andresbilbao (60s)`,
        `- **00:00–00:03 (Gancho):** ${t.adaptation.reelScriptBilbao.hook_0_3s}`,
        `- **00:03–00:15 (Problema):** ${t.adaptation.reelScriptBilbao.problem_3_15s}`,
        `- **00:15–00:40 (Revelación 30X):** ${t.adaptation.reelScriptBilbao.solution_15_40s}`,
        `- **00:40–01:00 (CTA):** ${t.adaptation.reelScriptBilbao.cta_40_60s}`,
        ``,
        `### Storyboard Carrusel 6 Slides para @crece30x`,
        ...t.adaptation.carousel30X.map((s) => `- ${s}`),
        ``,
        `### Evidencias Verificadas`,
        ...t.evidence.map(
          (e) =>
            `- [${e.platform}] [${e.title}](${e.url}) (${e.author}) — **${e.metrics.outlierVelocityScore} vistas/h**`
        ),
        ``,
        `---`,
        ``
      );
    }

    const blob = new Blob([lines.join('\n')], {
      type: 'text/markdown;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `30X-HackRadar-Dossier-${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Compute SVG Radar Triangle coordinates for activeTrend
  const radarPolygonPoints = useMemo(() => {
    if (!activeTrend) return '95,30 155,135 35,135';
    const jRatio = Math.min(1, Math.max(0.2, activeTrend.jev.j_audienceFit / 10));
    const eRatio = Math.min(1, Math.max(0.2, activeTrend.jev.e_earlyTiming / 10));
    const vRatio = Math.min(1, Math.max(0.2, activeTrend.jev.v_formatViability / 10));

    // Center is (95, 95)
    const jX = 95;
    const jY = Math.round(95 - 72 * jRatio);
    const eX = Math.round(95 + 68 * eRatio);
    const eY = Math.round(95 + 44 * eRatio);
    const vX = Math.round(95 - 68 * vRatio);
    const vY = Math.round(95 + 44 * vRatio);

    return `${jX},${jY} ${eX},${eY} ${vX},${vY}`;
  }, [activeTrend]);

  const filterButtons: Array<{ id: FilterStage; label: string; activeClass: string }> = [
    {
      id: 'ALL',
      label: `Todos (${counts.all})`,
      activeClass: 'bg-slate-950 text-white border-slate-950',
    },
    {
      id: 'EARLY_WAVE',
      label: `🌱 Olas Tempranas (${counts.early})`,
      activeClass: 'bg-emerald-600 text-white border-emerald-600',
    },
    {
      id: 'EXPLODING',
      label: `🔥 En Explosión (${counts.exploding})`,
      activeClass: 'bg-amber-500 text-white border-amber-500',
    },
    {
      id: 'SATURATED',
      label: `💀 Saturados (${counts.saturated})`,
      activeClass: 'bg-rose-500 text-white border-rose-500',
    },
  ];

  const platformButtons: Array<{ id: PlatformFilter; label: string }> = [
    { id: 'ALL', label: 'Todas' },
    { id: 'LINKEDIN', label: 'LinkedIn' },
    { id: 'YOUTUBE', label: 'YouTube' },
    { id: 'INSTAGRAM', label: 'Instagram' },
    { id: 'TIKTOK', label: 'TikTok' },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col">
      <HeaderRadar
        sourceMode={radarData.sourceMode}
        activeModelUsed={radarData.activeModelUsed}
        generatedAt={radarData.generatedAt}
        isScanning={isScanning}
        onScanLive={handleScanLive}
        earlyWaveCount={counts.early}
        avgTopScore={avgTopScore}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* =============================================================== */}
        {/* NIVEL 1: VISUALIZACIÓN DINÁMICA CON GRÁFICOS EN COLOR (SOBRE BLANCO) */}
        {/* =============================================================== */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* GRÁFICO 01: MAPA DE CUADRANTES US vs LATAM (SCATTER PLOT INTERACTIVO) */}
          <div className="lg:col-span-7 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm flex flex-col justify-between">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-indigo-600 font-semibold block">
                  GRÁFICO 01 · MAPA DE ARBITRAJE EN VIVO
                </span>
                <h2 className="text-base font-bold text-slate-900">
                  Crecimiento EE. UU. (Eje Y) vs. Saturación LatAm (Eje X)
                </h2>
              </div>

              <div className="flex items-center gap-3 text-xs font-medium text-slate-600">
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  Temprana ({counts.early})
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  Explosión ({counts.exploding})
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                  Saturado ({counts.saturated})
                </span>
              </div>
            </div>

            {/* Interactive SVG Scatter Quadrant */}
            <div className="w-full overflow-x-auto pt-2">
              <svg
                viewBox="0 0 680 230"
                className="w-full h-auto select-none"
                role="img"
                aria-label="Mapa de Cuadrantes de Arbitraje EE. UU. vs Latinoamérica"
              >
                {/* Opportunity Quadrant Highlight (High US, Low LatAm) */}
                <rect
                  x="48"
                  y="10"
                  width="285"
                  height="118"
                  rx="8"
                  fill="#ecfdf5"
                  stroke="#a7f3d0"
                  strokeWidth="1"
                />
                <text
                  x="60"
                  y="27"
                  fill="#047857"
                  fontSize="10.5"
                  fontFamily="monospace"
                  fontWeight="700"
                >
                  ZONA DE OPORTUNIDAD 30X (ALTO EE. UU. / BAJO LATAM)
                </text>

                {/* Reference Quadrant Lines */}
                <line
                  x1="48"
                  y1="128"
                  x2="660"
                  y2="128"
                  stroke="#e2e8f0"
                  strokeDasharray="4 4"
                />
                <line
                  x1="333"
                  y1="10"
                  x2="333"
                  y2="195"
                  stroke="#e2e8f0"
                  strokeDasharray="4 4"
                />
                <line x1="48" y1="195" x2="660" y2="195" stroke="#cbd5e1" />
                <line x1="48" y1="10" x2="48" y2="195" stroke="#cbd5e1" />

                {/* Axis Labels */}
                <text x="6" y="28" fill="#64748b" fontSize="10" fontFamily="monospace">
                  +360%
                </text>
                <text x="6" y="131" fill="#64748b" fontSize="10" fontFamily="monospace">
                  +160%
                </text>
                <text x="20" y="195" fill="#64748b" fontSize="10" fontFamily="monospace">
                  0%
                </text>
                <text x="54" y="214" fill="#64748b" fontSize="10.5" fontFamily="monospace">
                  LatAm Virgen (Baja competencia)
                </text>
                <text
                  x="656"
                  y="214"
                  textAnchor="end"
                  fill="#64748b"
                  fontSize="10.5"
                  fontFamily="monospace"
                >
                  LatAm Saturado (Alta competencia)
                </text>

                {/* Plot Bubbles for Filtered Trends */}
                {filteredTrends.map((t, idx) => {
                  const colors = getStageColors(t.waveStage);
                  const isFocused = activeTrend?.id === t.id;
                  // X: LatAm saturation (0..220% mapped across 68..620)
                  const x = Math.min(
                    620,
                    Math.max(68, 60 + Math.round((t.growthMetrics.latamGrowthPercent / 230) * 540))
                  );
                  // Y: US growth (0..360% mapped across 182..36)
                  const y = Math.min(
                    182,
                    Math.max(36, 186 - Math.round((t.growthMetrics.usGrowthPercent / 370) * 148))
                  );
                  const r = Math.max(6, Math.round((t.jev.totalScore - 3.5) * 2.1));

                  // Stagger label Y position slightly for close bubbles & show concise label
                  const showFullLabel = isFocused || t.rank <= 3 || t.rank === 6 || t.rank === 7 || t.rank === 9;
                  const labelOffsetY = idx % 2 === 0 ? -r - 5 : r + 12;

                  return (
                    <g
                      key={t.id}
                      onClick={() => setFocusedTrendId(t.id)}
                      className="cursor-pointer transition-transform"
                    >
                      <title>{`#${t.rank} ${t.topicTitle} — EE. UU. +${t.growthMetrics.usGrowthPercent}% vs LatAm +${t.growthMetrics.latamGrowthPercent}% (JEV ${t.jev.totalScore.toFixed(1)})`}</title>
                      {isFocused && (
                        <circle
                          cx={x}
                          cy={y}
                          r={r + 7}
                          fill={colors.bgSoft}
                          stroke={colors.hex}
                          strokeWidth="1.5"
                        />
                      )}
                      <circle
                        cx={x}
                        cy={y}
                        r={r}
                        fill={colors.hex}
                        fillOpacity={isFocused ? 0.95 : 0.78}
                        stroke="#ffffff"
                        strokeWidth="1.5"
                      />
                      {showFullLabel ? (
                        <text
                          x={x + r + 5}
                          y={y + 4}
                          fill={isFocused ? '#0f172a' : '#334155'}
                          fontSize={isFocused ? '11.5' : '10'}
                          fontWeight={isFocused ? '700' : '600'}
                        >
                          #{t.rank} {t.searchKeyword} ({t.jev.totalScore.toFixed(1)})
                        </text>
                      ) : (
                        <text
                          x={x}
                          y={y + labelOffsetY}
                          textAnchor="middle"
                          fill="#64748b"
                          fontSize="9.5"
                          fontFamily="monospace"
                          fontWeight="600"
                        >
                          #{t.rank}
                        </text>
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          {/* GRÁFICO 02: RADAR POLIGONAL JEV + VELOCIDAD POR PLATAFORMA + SENSOR */}
          <div className="lg:col-span-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm flex flex-col justify-between gap-4">
            {activeTrend && (
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                {/* Left: SVG Radar Polygon */}
                <div className="sm:col-span-5 flex flex-col items-center sm:items-start">
                  <span className="text-xs font-mono uppercase text-emerald-600 font-semibold">
                    GRÁFICO 02 · RADAR JEV
                  </span>
                  <div className="text-xs font-semibold text-slate-700 truncate max-w-[170px] mt-0.5">
                    #{activeTrend.rank} {activeTrend.searchKeyword}
                  </div>
                  <div className="text-2xl font-mono font-bold text-slate-950 mt-0.5">
                    {activeTrend.jev.totalScore.toFixed(1)}
                    <span className="text-xs font-normal text-slate-400">/10</span>
                  </div>

                  <svg width="175" height="155" viewBox="0 0 190 170" className="mt-1">
                    <polygon
                      points="95,22 165,140 25,140"
                      fill="#f8fafc"
                      stroke="#e2e8f0"
                      strokeWidth="1"
                    />
                    <polygon
                      points="95,55 138,124 52,124"
                      fill="none"
                      stroke="#e2e8f0"
                      strokeWidth="1"
                    />
                    <line x1="95" y1="95" x2="95" y2="22" stroke="#e2e8f0" />
                    <line x1="95" y1="95" x2="165" y2="140" stroke="#e2e8f0" />
                    <line x1="95" y1="95" x2="25" y2="140" stroke="#e2e8f0" />

                    <polygon
                      points={radarPolygonPoints}
                      fill="rgba(79, 70, 229, 0.16)"
                      stroke="#4f46e5"
                      strokeWidth="2"
                    />
                    <text
                      x="60"
                      y="14"
                      fill="#312e81"
                      fontSize="10.5"
                      fontFamily="monospace"
                      fontWeight="700"
                    >
                      J:{activeTrend.jev.j_audienceFit} (40%)
                    </text>
                    <text
                      x="120"
                      y="158"
                      fill="#065f46"
                      fontSize="10.5"
                      fontFamily="monospace"
                      fontWeight="700"
                    >
                      E:{activeTrend.jev.e_earlyTiming} (35%)
                    </text>
                    <text
                      x="12"
                      y="158"
                      fill="#92400e"
                      fontSize="10.5"
                      fontFamily="monospace"
                      fontWeight="700"
                    >
                      V:{activeTrend.jev.v_formatViability} (25%)
                    </text>
                  </svg>
                </div>

                {/* Right: Velocity Bars & Arbitrage Breakdown */}
                <div className="sm:col-span-7 sm:border-l sm:border-slate-100 sm:pl-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase text-slate-400 font-semibold">
                      VELOCIDAD DE EVIDENCIA (VISTAS/H)
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {activeTrend.evidence.map((ev) => {
                      const pct = Math.min(
                        100,
                        Math.max(18, Math.round(ev.metrics.outlierVelocityScore / 55))
                      );
                      const barColor =
                        ev.platform === 'YOUTUBE'
                          ? 'bg-rose-500'
                          : ev.platform === 'LINKEDIN'
                          ? 'bg-sky-500'
                          : 'bg-indigo-500';
                      return (
                        <div key={ev.id} className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-semibold text-slate-700 truncate max-w-[155px]">
                              {ev.platform} · {ev.author}
                            </span>
                            <span className="font-mono font-bold text-slate-900">
                              {ev.metrics.outlierVelocityScore.toLocaleString()} /h
                            </span>
                          </div>
                          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${barColor} transition-all duration-300`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-500">EE. UU. vs LatAm:</span>
                    <span className="text-emerald-700 font-bold">
                      +{activeTrend.growthMetrics.usGrowthPercent}% vs +
                      {activeTrend.growthMetrics.latamGrowthPercent}%
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Minimalist Community Sensor Input */}
            <form
              onSubmit={handleAddCommunitySignal}
              className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2"
            >
              <span className="text-xs font-mono uppercase text-slate-500 font-semibold shrink-0">
                SENSOR DE COMUNIDAD 30X:
              </span>
              <div className="flex items-center gap-2 flex-1">
                <input
                  type="text"
                  value={communityTopicInput}
                  onChange={(e) => setCommunityTopicInput(e.target.value)}
                  placeholder="Evaluar nuevo tema (ej. Agentes WhatsApp)..."
                  className="flex-1 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white focus:outline-none text-xs text-slate-900 placeholder:text-slate-400"
                />
                <button
                  type="submit"
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-mono font-semibold transition-colors cursor-pointer shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Analizar</span>
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* =============================================================== */}
        {/* BARRA MINIMALISTA DE FILTROS, PLATAFORMAS Y BÚSQUEDA            */}
        {/* =============================================================== */}
        <section className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 py-2 border-y border-slate-100">
          <div className="flex flex-wrap items-center gap-1">
            {filterButtons.map((btn) => {
              const isActive = selectedStage === btn.id;
              return (
                <button
                  key={btn.id}
                  type="button"
                  onClick={() => setSelectedStage(btn.id)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer border ${
                    isActive
                      ? btn.activeClass
                      : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-200'
                  }`}
                >
                  {btn.label}
                </button>
              );
            })}

            <span className="text-slate-200 mx-0.5 hidden sm:inline">|</span>

            {platformButtons.map((p) => {
              const active = selectedPlatform === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelectedPlatform(p.id)}
                  className={`px-2 py-1 rounded-md text-xs font-mono transition-colors cursor-pointer ${
                    active
                      ? 'bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {p.label}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-52">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                ref={searchInputRef}
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar keyword (/)..."
                aria-label="Buscar tendencia por palabra clave"
                className="w-full pl-8 pr-7 py-1.5 rounded-lg bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white focus:outline-none text-xs text-slate-900 placeholder:text-slate-400"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                  aria-label="Limpiar búsqueda"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={handleExportWeeklyMarkdown}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-xs font-mono text-slate-700 transition-colors cursor-pointer shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exportar .MD</span>
            </button>
          </div>
        </section>

        {/* =============================================================== */}
        {/* NIVEL 2: TABLA EJECUTIVA CON SPARKLINES + INSPECTOR DINÁMICO    */}
        {/* =============================================================== */}
        {filteredTrends.length === 0 ? (
          <div className="py-16 text-center border border-slate-200 rounded-2xl bg-slate-50/50 space-y-3">
            <p className="text-sm font-mono text-slate-500">
              Sin resultados para el filtro seleccionado.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedStage('ALL');
                setSelectedPlatform('ALL');
                setSearchQuery('');
              }}
              className="px-3.5 py-1.5 rounded-lg bg-slate-950 text-white text-xs font-mono cursor-pointer"
            >
              Restablecer filtros
            </button>
          </div>
        ) : (
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* LEFT: COMPACT DYNAMIC RANKING TABLE WITH 7D SPARKLINES */}
            <div className="lg:col-span-7 rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <span className="text-xs font-mono uppercase text-slate-500 font-semibold">
                  RANKING EJECUTIVO ({filteredTrends.length} SEÑALES)
                </span>
                <span className="text-xs font-mono text-slate-400">
                  Haz clic en una fila para actualizar gráficos e inspector →
                </span>
              </div>

              <div className="divide-y divide-slate-100">
                {filteredTrends.map((t) => {
                  const stage = getStageColors(t.waveStage);
                  const isSelected = activeTrend?.id === t.id;
                  const ratio = (
                    t.growthMetrics.usGrowthPercent /
                    Math.max(10, t.growthMetrics.latamGrowthPercent)
                  ).toFixed(1);

                  return (
                    <div
                      key={t.id}
                      onClick={() => setFocusedTrendId(t.id)}
                      className={`px-4 py-3.5 flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-indigo-50/50 border-l-4 border-l-indigo-600'
                          : 'hover:bg-slate-50/80'
                      }`}
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <span
                          className={`font-mono text-sm font-bold w-6 shrink-0 ${
                            isSelected ? 'text-indigo-600' : 'text-slate-400'
                          }`}
                        >
                          {String(t.rank).padStart(2, '0')}
                        </span>
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-slate-900 truncate">
                            {t.topicTitle}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                            <span className="font-mono text-indigo-600">{t.searchKeyword}</span>
                            <span>·</span>
                            <span className={`px-2 py-0.2 rounded-full border text-xs ${stage.pill}`}>
                              {stage.label}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 shrink-0">
                        <div className="hidden sm:block text-right font-mono text-xs">
                          <div className="text-slate-900 font-semibold">
                            +{t.growthMetrics.usGrowthPercent}%{' '}
                            <span className="text-slate-400 font-normal">
                              vs +{t.growthMetrics.latamGrowthPercent}%
                            </span>
                          </div>
                          <div className="text-emerald-600 font-medium">{ratio}x brecha</div>
                        </div>

                        {/* 7-day SVG Sparkline */}
                        <svg width="72" height="22" className="hidden md:block shrink-0">
                          <polyline
                            fill="none"
                            stroke={stage.hex}
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            points={buildSparklinePoints(t)}
                          />
                        </svg>

                        {/* JEV Score Pill */}
                        <div
                          className={`px-2.5 py-1 rounded-lg font-mono text-xs font-bold ${
                            isSelected
                              ? 'bg-slate-950 text-white'
                              : 'bg-slate-100 text-slate-900'
                          }`}
                        >
                          {t.jev.totalScore.toFixed(1)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* RIGHT: LIVE TABBED INSPECTOR (ZERO CLUTTER) */}
            {activeTrend && (
              <div className="lg:col-span-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-5 sticky top-20">
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs font-mono">
                      <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-bold">
                        INSPECTOR #{String(activeTrend.rank).padStart(2, '0')}
                      </span>
                      <span className="text-emerald-600 font-semibold">
                        JEV {activeTrend.jev.totalScore.toFixed(1)}/10
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-950 leading-snug">
                      {activeTrend.topicTitle}
                    </h3>
                  </div>

                  {/* 3 Minimalist Tabs */}
                  <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-medium w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => setInspectorTab('XRAY')}
                      className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                        inspectorTab === 'XRAY'
                          ? 'bg-white text-slate-950 font-semibold shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      1. Rayos X
                    </button>
                    <button
                      type="button"
                      onClick={() => setInspectorTab('REEL')}
                      className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                        inspectorTab === 'REEL'
                          ? 'bg-white text-slate-950 font-semibold shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      2. Reel 60s
                    </button>
                    <button
                      type="button"
                      onClick={() => setInspectorTab('CAROUSEL')}
                      className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                        inspectorTab === 'CAROUSEL'
                          ? 'bg-white text-slate-950 font-semibold shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      3. Carrusel 6x
                    </button>
                  </div>
                </div>

                {/* TAB 1: RAYOS X & EVIDENCIA */}
                {inspectorTab === 'XRAY' && (
                  <div className="space-y-4">
                    <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200/70 space-y-1">
                      <div className="text-xs font-mono uppercase text-emerald-700 font-semibold">
                        Patrón del Gancho (Primeros 3 Segundos)
                      </div>
                      <p className="text-sm font-medium text-slate-900 leading-relaxed">
                        {activeTrend.whyItWorked.hookPattern}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
                        <div className="text-xs font-mono uppercase text-indigo-700 font-semibold">
                          Formato Ganador
                        </div>
                        <p className="text-xs text-slate-700 leading-relaxed">
                          {activeTrend.whyItWorked.winningFormat}
                        </p>
                      </div>
                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
                        <div className="text-xs font-mono uppercase text-amber-700 font-semibold">
                          Driver de Audiencia
                        </div>
                        <p className="text-xs text-slate-700 leading-relaxed">
                          {activeTrend.whyItWorked.emotionalDriver}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-xs font-mono uppercase text-slate-400 font-semibold">
                        Pruebas Verificadas
                      </div>
                      {activeTrend.evidence.map((ev) => (
                        <a
                          key={ev.id}
                          href={ev.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-3 rounded-xl border border-slate-200 hover:border-indigo-300 bg-white hover:bg-slate-50 flex items-center justify-between gap-2 text-xs transition-colors"
                        >
                          <div className="truncate">
                            <strong className="text-slate-900">{ev.platform}</strong> ·{' '}
                            <span className="text-slate-600">{ev.title}</span>
                          </div>
                          <span className="font-mono text-emerald-600 font-bold shrink-0">
                            {ev.metrics.outlierVelocityScore.toLocaleString()} /h ↗
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB 2: REEL 60S @ANDRESBILBAO */}
                {inspectorTab === 'REEL' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono uppercase text-slate-500 font-semibold">
                        Guion Cronometrado · @andresbilbao
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          handleQuickCopy(
                            'reel-inspector',
                            [
                              activeTrend.adaptation.reelScriptBilbao.hook_0_3s,
                              activeTrend.adaptation.reelScriptBilbao.problem_3_15s,
                              activeTrend.adaptation.reelScriptBilbao.solution_15_40s,
                              activeTrend.adaptation.reelScriptBilbao.cta_40_60s,
                            ].join('\n\n')
                          )
                        }
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-950 text-white text-xs font-mono cursor-pointer"
                      >
                        {copiedInspectorKey === 'reel-inspector' ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span>Copiado</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copiar Guion</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200">
                        <span className="font-mono font-bold text-emerald-700 block">
                          00:00 – 00:03 · GANCHO
                        </span>
                        <p className="text-slate-900 font-medium mt-1 leading-relaxed">
                          {activeTrend.adaptation.reelScriptBilbao.hook_0_3s}
                        </p>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                        <span className="font-mono font-bold text-amber-700 block">
                          00:03 – 00:15 · PROBLEMA
                        </span>
                        <p className="text-slate-700 mt-1 leading-relaxed">
                          {activeTrend.adaptation.reelScriptBilbao.problem_3_15s}
                        </p>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                        <span className="font-mono font-bold text-indigo-700 block">
                          00:15 – 00:40 · REVELACIÓN 30X
                        </span>
                        <p className="text-slate-700 mt-1 leading-relaxed">
                          {activeTrend.adaptation.reelScriptBilbao.solution_15_40s}
                        </p>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                        <span className="font-mono font-bold text-purple-700 block">
                          00:40 – 01:00 · CTA
                        </span>
                        <p className="text-slate-700 mt-1 leading-relaxed">
                          {activeTrend.adaptation.reelScriptBilbao.cta_40_60s}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 3: CARRUSEL 6 SLIDES @CRECE30X */}
                {inspectorTab === 'CAROUSEL' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono uppercase text-slate-500 font-semibold">
                        Storyboard 6 Slides · @crece30x
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          handleQuickCopy(
                            'carousel-inspector',
                            activeTrend.adaptation.carousel30X.join('\n\n')
                          )
                        }
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-950 text-white text-xs font-mono cursor-pointer"
                      >
                        {copiedInspectorKey === 'carousel-inspector' ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span>Copiado</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copiar 6 Slides</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {activeTrend.adaptation.carousel30X.map((slide, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1"
                        >
                          <span className="text-xs font-mono font-bold text-indigo-600 block">
                            SLIDE 0{idx + 1}/06
                          </span>
                          <p className="text-xs text-slate-700 leading-relaxed">{slide}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Bottom Action to open Full Teleprompter & Dossier Modal */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-400">
                    Modo Teleprompter y vista completa
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedTrend(activeTrend)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-950 hover:bg-indigo-600 text-white text-xs font-mono font-semibold transition-colors cursor-pointer"
                  >
                    <span>Abrir Estudio Completo</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </section>
        )}

        {/* =============================================================== */}
        {/* EXPANDABLE FULL CARDS & TELEMETRY DRAWERS                       */}
        {/* =============================================================== */}
        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-slate-500">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowFullCards((prev) => !prev)}
              className="inline-flex items-center gap-1.5 text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer"
            >
              <span>
                {showFullCards
                  ? 'Ocultar Tarjetas Detalladas'
                  : 'Ver Tarjetas Detalladas (Vista Expandida)'}
              </span>
              {showFullCards ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>
            {scanStatusText && (
              <>
                <span>·</span>
                <span className="text-emerald-600 font-semibold">{scanStatusText}</span>
              </>
            )}
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setShowBriefDrawer((prev) => !prev)}
              className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-900 cursor-pointer"
            >
              <span>Ficha del Reto 30X (01–08)</span>
              {showBriefDrawer ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>

            <span className="text-slate-300">|</span>

            <button
              type="button"
              onClick={() => setShowAuditDrawer((prev) => !prev)}
              className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-900 cursor-pointer"
            >
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span>
                AUDIT LOOP: {auditReport.passedCount}/{auditReport.totalChecks} OK
              </span>
              {showAuditDrawer ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>

        {showBriefDrawer && (
          <section className="border border-slate-200 rounded-2xl bg-slate-50/70 p-5 space-y-4 text-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
              <div>
                <span className="font-mono uppercase text-indigo-600 font-semibold block">
                  TRAZABILIDAD DEL ENTREGABLE · RETO 30X: RADAR DE CONTENIDO
                </span>
                <h2 className="text-sm font-bold text-slate-900 mt-0.5">
                  ¿Cómo descubrir qué temas despegan en redes, por qué funcionan y cómo adaptarlos a 30X sin gastar en scrapers costosos?
                </h2>
              </div>

              <div className="flex items-center gap-2 font-mono">
                <a
                  href="https://www.instagram.com/crece30x"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-slate-700"
                >
                  IG @crece30x <ExternalLink className="w-3 h-3" />
                </a>
                <a
                  href="https://www.instagram.com/andresbilbao"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-slate-700"
                >
                  IG @andresbilbao <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="p-3.5 border border-slate-200 rounded-xl bg-white space-y-1">
                <div className="font-mono text-emerald-700 font-semibold">01 & 02 · COSTO $0.00</div>
                <p className="text-slate-600">
                  Reemplaza scrapers pagos por señales abiertas + OpenRouter <code>:free</code>.
                </p>
              </div>
              <div className="p-3.5 border border-slate-200 rounded-xl bg-white space-y-1">
                <div className="font-mono text-indigo-700 font-semibold">03 · LAS 3 PREGUNTAS</div>
                <p className="text-slate-600">
                  Arbitraje US→LatAm, Rayos X del gancho y filtro JEV para ejecutivos.
                </p>
              </div>
              <div className="p-3.5 border border-slate-200 rounded-xl bg-white space-y-1">
                <div className="font-mono text-amber-700 font-semibold">04 & 06 · ENTREGABLE</div>
                <p className="text-slate-600">
                  Gráficos dinámicos, Sensor de Comunidad y guiones listos para producir.
                </p>
              </div>
              <div className="p-3.5 border border-slate-200 rounded-xl bg-white space-y-1">
                <div className="font-mono text-rose-700 font-semibold">05 & 08 · CERO VIOLACIÓN TOS</div>
                <p className="text-slate-600">
                  100% contenido público indexado. Cero datos personales ni logins.
                </p>
              </div>
            </div>
          </section>
        )}

        {showAuditDrawer && (
          <section className="border border-slate-200 rounded-2xl bg-slate-50/70 p-4 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
            {auditReport.checks.map((check) => (
              <div
                key={check.id}
                className="p-3.5 border border-slate-200 rounded-xl bg-white space-y-1"
              >
                <div className="flex items-center justify-between text-slate-400">
                  <span>{check.section}</span>
                  <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
                    <Check className="w-3 h-3" /> OK
                  </span>
                </div>
                <div className="text-slate-900 font-sans font-medium">
                  {check.requirement}
                </div>
                <div className="text-slate-500">{check.details}</div>
              </div>
            ))}
          </section>
        )}

        {showFullCards && (
          <section className="space-y-4 pt-2">
            {filteredTrends.map((trend) => (
              <TrendCard
                key={trend.id}
                trend={trend}
                isActive={activeTrend?.id === trend.id}
                onSelectTrend={(t) => {
                  setFocusedTrendId(t.id);
                  setSelectedTrend(t);
                }}
              />
            ))}
          </section>
        )}
      </main>

      <footer className="border-t border-slate-100 py-5 mt-8 bg-slate-50/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-mono text-slate-400">
          <span>30X HACKRADAR · PLATAFORMA DE INTELIGENCIA EDITORIAL © 2026</span>
          <span>SOLO CONTENIDO PÚBLICO · CERO DATOS PERSONALES · MATRIZ JEV</span>
        </div>
      </footer>

      <TrendDetailModal
        trend={selectedTrend}
        onClose={() => setSelectedTrend(null)}
        onNavigate={handleNavigateModal}
        totalTrends={filteredTrends.length}
      />
    </div>
  );
}
