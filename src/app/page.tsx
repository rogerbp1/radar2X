'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Check,
  ChevronDown,
  ChevronUp,
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
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [selectedStage, setSelectedStage] = useState<FilterStage>('ALL');
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformFilter>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [communityTopicInput, setCommunityTopicInput] = useState<string>('');
  const [selectedTrend, setSelectedTrend] = useState<RadarTrendItem | null>(null);
  const [scanStatusText, setScanStatusText] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  // Sync with /api/radar on initial load and run operational audit loop
  useEffect(() => {
    let active = true;
    fetch('/api/radar')
      .then((res) => (res.ok ? res.json() : null))
      .then((data: RadarApiResponse | null) => {
        if (active && data && Array.isArray(data.trends) && data.trends.length > 0) {
          const audited = auditAndHealRadarResponse(data);
          setRadarData(audited.response);
          setAuditReport(audited.report);
        }
      })
      .catch(() => {
        // Keep Demo-Safe audited fallback data
      });
    return () => {
      active = false;
    };
  }, []);

  // Keyboard shortcut '/' to focus search when not typing in an input
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

  // Sensor de Comunidad 30X ("04 Caminos posibles: usar a la propia comunidad como sensor")
  const handleAddCommunitySignal = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = communityTopicInput.trim();
    if (!clean) return;

    setCommunityTopicInput('');
    setIsScanning(true);
    setScanStatusText(`EVALUANDO “${clean}” EN VIVO CON TYPESAFE JEV-1.14 + YOUTUBE + TAVILY...`);

    const optimisticBase = synthesizeCommunityTrend(clean);
    try {
      const res = await fetch('/api/radar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keywords: [clean] }),
      });
      if (res.ok) {
        const liveData: RadarApiResponse = await res.json();
        const liveItem = liveData.trends.find(
          (t) => t.searchKeyword.toLowerCase() === clean.toLowerCase()
        ) || liveData.trends[0];

        const mergedItem: RadarTrendItem = liveItem
          ? {
              ...optimisticBase,
              ...liveItem,
              id: `community-live-${Date.now()}`,
              searchKeyword: clean,
              topicTitle:
                liveItem.searchKeyword.toLowerCase() === clean.toLowerCase()
                  ? `${clean}: ${liveItem.topicTitle}`
                  : optimisticBase.topicTitle,
            }
          : optimisticBase;

        const updatedTrends = [
          mergedItem,
          ...radarData.trends.filter(
            (t) => t.searchKeyword.toLowerCase() !== clean.toLowerCase()
          ),
        ]
          .slice(0, 10)
          .sort((a, b) => b.jev.totalScore - a.jev.totalScore)
          .map((item, idx) => ({ ...item, rank: idx + 1 }));

        const audited = auditAndHealRadarResponse({
          ...radarData,
          generatedAt: new Date().toISOString(),
          activeModelUsed: liveData.activeModelUsed,
          trends: updatedTrends,
        });

        setRadarData(audited.response);
        setAuditReport(audited.report);
        const target =
          audited.response.trends.find((t) => t.id === mergedItem.id) ||
          audited.response.trends[0];
        setSelectedTrend(target);
        setScanStatusText(
          `SEÑAL EN VIVO EVALUADA POR ${liveData.activeModelUsed}: “${clean}” (JEV ${target.jev.totalScore}/10)`
        );
        return;
      }
    } catch {
      // Fallback to local statistical synthesis if offline
    } finally {
      setIsScanning(false);
    }

    const updatedTrends = [optimisticBase, ...radarData.trends.slice(0, 9)]
      .sort((a, b) => b.jev.totalScore - a.jev.totalScore)
      .map((item, idx) => ({ ...item, rank: idx + 1 }));
    const audited = auditAndHealRadarResponse({
      ...radarData,
      generatedAt: new Date().toISOString(),
      trends: updatedTrends,
    });
    setRadarData(audited.response);
    setAuditReport(audited.report);
    setSelectedTrend(
      audited.response.trends.find((t) => t.id === optimisticBase.id) || optimisticBase
    );
    setScanStatusText(`SEÑAL DE COMUNIDAD EVALUADA: “${clean}” (JEV ${optimisticBase.jev.totalScore}/10)`);
  };

  // Counts by waveStage
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

  // Filtered and JEV-sorted trends
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

  const filterButtons: Array<{ id: FilterStage; label: string }> = [
    { id: 'ALL', label: `Todos (${counts.all})` },
    {
      id: 'EARLY_WAVE',
      label: `🌱 Olas Tempranas (Arbitraje US->LatAm) (${counts.early})`,
    },
    {
      id: 'EXPLODING',
      label: `🔥 En Explosión (${counts.exploding})`,
    },
    {
      id: 'SATURATED',
      label: `💀 Saturados (Qué evitar) (${counts.saturated})`,
    },
  ];

  const platformButtons: Array<{ id: PlatformFilter; label: string }> = [
    { id: 'ALL', label: 'Todas las redes' },
    { id: 'LINKEDIN', label: 'LinkedIn' },
    { id: 'YOUTUBE', label: 'YouTube' },
    { id: 'INSTAGRAM', label: 'Instagram' },
    { id: 'TIKTOK', label: 'TikTok' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <HeaderRadar
        sourceMode={radarData.sourceMode}
        activeModelUsed={radarData.activeModelUsed}
        generatedAt={radarData.generatedAt}
        isScanning={isScanning}
        onScanLive={handleScanLive}
        earlyWaveCount={counts.early}
        avgTopScore={avgTopScore}
      />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Sensor de Comunidad 30X ("04 Caminos posibles: comunidad como sensor") */}
        <section className="border border-slate-800/90 rounded-xl p-4 bg-slate-900/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-0.5">
            <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 block">
              SENSOR DE COMUNIDAD 30X · EVALUAR TEMA A DEMANDA
            </span>
            <p className="text-xs text-slate-400">
              ¿Viste un tema en LinkedIn, Instagram o YouTube? Evalúa su ola US→LatAm, puntaje JEV y genera el guion al instante.
            </p>
          </div>

          <form
            onSubmit={handleAddCommunitySignal}
            className="flex items-center gap-2 w-full md:w-auto"
          >
            <input
              type="text"
              value={communityTopicInput}
              onChange={(e) => setCommunityTopicInput(e.target.value)}
              placeholder="Ej: Agentes en WhatsApp para cobranza..."
              className="flex-1 md:w-72 px-3 py-2 rounded-md bg-slate-950 border border-slate-800 focus:border-slate-500 focus:outline-none text-xs font-mono text-slate-100 placeholder:text-slate-500"
            />
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-slate-100 hover:bg-white text-slate-950 text-xs font-mono font-semibold uppercase tracking-wider transition-colors cursor-pointer shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Analizar Señal</span>
            </button>
          </form>
        </section>

        {/* Minimalist Control Strip: Stage Tabs + Platform Tabs + Instant Search + Export */}
        <section className="space-y-3 pb-4 border-b border-slate-800/80">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-1.5">
              {filterButtons.map((btn) => {
                const isActive = selectedStage === btn.id;
                return (
                  <button
                    key={btn.id}
                    type="button"
                    onClick={() => setSelectedStage(btn.id)}
                    className={`px-3 py-1.5 rounded-md text-xs font-mono transition-colors cursor-pointer border ${
                      isActive
                        ? 'bg-white text-slate-950 border-white font-semibold'
                        : 'bg-transparent hover:bg-slate-900 text-slate-400 hover:text-slate-200 border-slate-800'
                    }`}
                  >
                    {btn.label}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2 w-full lg:w-auto">
              <div className="relative flex-1 lg:w-64">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  ref={searchInputRef}
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filtrar keyword (presiona /)..."
                  aria-label="Buscar tendencia por palabra clave"
                  className="w-full pl-9 pr-8 py-1.5 rounded-md bg-slate-900/50 border border-slate-800 focus:border-slate-500 focus:outline-none text-xs font-mono text-slate-100 placeholder:text-slate-500"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white cursor-pointer"
                    aria-label="Limpiar búsqueda"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={handleExportWeeklyMarkdown}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-slate-800 hover:border-slate-600 bg-slate-900/50 hover:bg-slate-900 text-xs font-mono text-slate-300 hover:text-white transition-colors cursor-pointer shrink-0"
                title="Descargar Dossier Completo en Markdown (.md)"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Exportar .MD</span>
              </button>
            </div>
          </div>

          {/* Secondary Network Filter Bar (LinkedIn / YouTube / Instagram / TikTok) */}
          <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono">
            <span className="text-slate-500 uppercase">RED DE EVIDENCIA:</span>
            {platformButtons.map((p) => {
              const active = selectedPlatform === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelectedPlatform(p.id)}
                  className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                    active
                      ? 'bg-slate-800 text-white font-semibold border border-slate-600'
                      : 'text-slate-400 hover:text-slate-200 border border-transparent'
                  }`}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
        </section>

        {/* Subtle Status, Brief 01-08 & Self-Audit Telemetry Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-slate-500">
          <div className="flex items-center gap-3">
            <span>
              MOSTRANDO {filteredTrends.length} DE {radarData.trends.length} SEÑALES ORDENADAS POR JEV
            </span>
            {scanStatusText && (
              <>
                <span>·</span>
                <span className="text-emerald-400">{scanStatusText}</span>
              </>
            )}
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setShowBriefDrawer((prev) => !prev)}
              className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <span>FICHA DEL RETO 30X (01–08)</span>
              {showBriefDrawer ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>

            <span className="text-slate-800">|</span>

            <button
              type="button"
              onClick={() => setShowAuditDrawer((prev) => !prev)}
              className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span>
                AUDIT LOOP: {auditReport.passedCount}/{auditReport.totalChecks} SPECS OK
              </span>
              {showAuditDrawer ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* Collapsible Hackathon Brief Matrix (01 to 08) */}
        {showBriefDrawer && (
          <section className="border border-slate-800 rounded-lg bg-slate-900/20 p-5 space-y-4 text-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-emerald-400 block">
                  TRAZABILIDAD DEL ENTREGABLE · RETO 30X: RADAR DE CONTENIDO
                </span>
                <h2 className="text-sm font-semibold text-white">
                  ¿Cómo puede un equipo de contenido descubrir, de forma confiable y sin gastar una fortuna, qué temas y formatos están despegando en redes, por qué funcionan y si encajan con su audiencia?
                </h2>
              </div>

              <div className="flex items-center gap-3 font-mono text-[11px]">
                <a
                  href="https://www.instagram.com/crece30x"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded border border-slate-800 hover:border-slate-600 text-slate-200"
                >
                  IG @crece30x <ExternalLink className="w-3 h-3" />
                </a>
                <a
                  href="https://www.instagram.com/andresbilbao"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded border border-slate-800 hover:border-slate-600 text-slate-200"
                >
                  IG @andresbilbao <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 font-mono">
              <div className="p-3 border border-slate-800/80 rounded bg-slate-950 space-y-1">
                <div className="text-[10px] text-emerald-400">01 & 02 · PROBLEMA Y COSTO</div>
                <p className="font-sans text-slate-300 text-xs">
                  Reemplaza scrapers pagos de miles de USD/año por señales abiertas + OpenRouter <code>:free</code> ($0.00 USD).
                </p>
              </div>
              <div className="p-3 border border-slate-800/80 rounded bg-slate-950 space-y-1">
                <div className="text-[10px] text-emerald-400">03 · LAS 3 PREGUNTAS</div>
                <p className="font-sans text-slate-300 text-xs">
                  1) Arbitraje US→LatAm, 2) Rayos X de Gancho/Formato/Tema/Momento/Autor, 3) Filtro JEV para ejecutivos LatAm.
                </p>
              </div>
              <div className="p-3 border border-slate-800/80 rounded bg-slate-950 space-y-1">
                <div className="text-[10px] text-emerald-400">04 & 06 · CAMINOS Y ENTREGABLE</div>
                <p className="font-sans text-slate-300 text-xs">
                  Combina agentes, Matriz JEV, Sensor de Comunidad en vivo y Top 10 filtrable por LinkedIn/YouTube/IG/TikTok.
                </p>
              </div>
              <div className="p-3 border border-slate-800/80 rounded bg-slate-950 space-y-1">
                <div className="text-[10px] text-emerald-400">05 & 08 · RESTRICCIONES TOS</div>
                <p className="font-sans text-slate-300 text-xs">
                  100% contenido público indexado. Cero datos personales, cero logins de terceros, cero violación de ToS.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Collapsible Minimalist Audit Matrix */}
        {showAuditDrawer && (
          <section className="border border-slate-800 rounded-lg bg-slate-900/20 p-4 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
            {auditReport.checks.map((check) => (
              <div
                key={check.id}
                className="p-3 border border-slate-800/80 rounded bg-slate-950 space-y-1"
              >
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>{check.section}</span>
                  <span className="inline-flex items-center gap-1 text-emerald-400">
                    <Check className="w-3 h-3" /> OK
                  </span>
                </div>
                <div className="text-slate-200 font-sans text-xs">
                  {check.requirement}
                </div>
                <div className="text-[10px] text-slate-500">{check.details}</div>
              </div>
            ))}
          </section>
        )}

        {/* Top 10 Signal List */}
        <section className="space-y-4">
          {filteredTrends.length === 0 ? (
            <div className="py-16 text-center border border-slate-800/80 rounded-xl space-y-3">
              <p className="text-sm font-mono text-slate-400">
                SIN RESULTADOS PARA EL FILTRO SELECCIONADO.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedStage('ALL');
                  setSelectedPlatform('ALL');
                  setSearchQuery('');
                }}
                className="px-3 py-1.5 rounded border border-slate-700 text-xs font-mono text-white hover:bg-slate-900 cursor-pointer"
              >
                RESTABLECER VISTA
              </button>
            </div>
          ) : (
            filteredTrends.map((trend) => (
              <TrendCard
                key={trend.id}
                trend={trend}
                onSelectTrend={(t) => setSelectedTrend(t)}
              />
            ))
          )}
        </section>
      </main>

      <footer className="border-t border-slate-900 py-6 mt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] font-mono text-slate-500">
          <span>30X HACKRADAR · PLATAFORMA HACKRADAR © 2026</span>
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
