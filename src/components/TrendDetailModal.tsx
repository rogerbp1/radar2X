'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  ExternalLink,
  Instagram,
  Linkedin,
  MonitorPlay,
  PlaySquare,
  X,
  Youtube,
} from 'lucide-react';
import { EvidenceItem, RadarTrendItem } from '@/types/radar';

interface TrendDetailModalProps {
  trend: RadarTrendItem | null;
  onClose: () => void;
  onNavigate?: (direction: 'prev' | 'next') => void;
  totalTrends?: number;
}

function getPlatformIcon(platform: EvidenceItem['platform']) {
  switch (platform) {
    case 'YOUTUBE':
      return <Youtube className="w-3.5 h-3.5 text-slate-300" />;
    case 'LINKEDIN':
      return <Linkedin className="w-3.5 h-3.5 text-slate-300" />;
    case 'INSTAGRAM':
      return <Instagram className="w-3.5 h-3.5 text-slate-300" />;
    default:
      return <PlaySquare className="w-3.5 h-3.5 text-slate-300" />;
  }
}

export default function TrendDetailModal({
  trend,
  onClose,
  onNavigate,
  totalTrends = 10,
}: TrendDetailModalProps) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [teleprompterMode, setTeleprompterMode] = useState<boolean>(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (trend) {
      if (!dialog.open) {
        dialog.showModal();
      }
    } else if (dialog.open) {
      dialog.close();
    }
  }, [trend]);

  // Keyboard navigation (ArrowLeft / ArrowRight) when modal is open
  useEffect(() => {
    if (!trend || !onNavigate) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        onNavigate('prev');
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        onNavigate('next');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [trend, onNavigate]);

  // Fallback for browsers without native <dialog closedby="any"> support
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleClose = () => {
      onClose();
    };

    const handleBackdropClick = (event: MouseEvent) => {
      if ('closedBy' in HTMLDialogElement.prototype) return;
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      const isDialogContent =
        rect.top <= event.clientY &&
        event.clientY <= rect.top + rect.height &&
        rect.left <= event.clientX &&
        event.clientX <= rect.left + rect.width;
      if (!isDialogContent) {
        dialog.close();
      }
    };

    dialog.addEventListener('close', handleClose);
    dialog.addEventListener('click', handleBackdropClick);
    return () => {
      dialog.removeEventListener('close', handleClose);
      dialog.removeEventListener('click', handleBackdropClick);
    };
  }, [onClose]);

  const handleCopy = async (key: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch {
      // Clipboard fallback
    }
  };

  const formatFullReelScript = (t: RadarTrendItem) => {
    return [
      `TEMA: ${t.topicTitle}`,
      `FORMATO: Guion Reel @andresbilbao`,
      ``,
      `[0-3s GANCHO]`,
      t.adaptation.reelScriptBilbao.hook_0_3s,
      ``,
      `[3-15s PROBLEMA]`,
      t.adaptation.reelScriptBilbao.problem_3_15s,
      ``,
      `[15-40s REVELACIÓN]`,
      t.adaptation.reelScriptBilbao.solution_15_40s,
      ``,
      `[40-60s CTA]`,
      t.adaptation.reelScriptBilbao.cta_40_60s,
    ].join('\n');
  };

  const formatFullCarousel = (t: RadarTrendItem) => {
    return [
      `CARRUSEL 6 SLIDES @crece30x — ${t.topicTitle}`,
      ``,
      ...t.adaptation.carousel30X,
    ].join('\n\n');
  };

  return (
    <dialog
      ref={dialogRef}
      closedby="any"
      aria-labelledby="modal-trend-title"
      className="w-full max-w-5xl rounded-xl bg-slate-950 text-slate-100 border border-slate-800 shadow-2xl p-0 m-auto backdrop:bg-slate-950/85 open:flex open:flex-col max-h-[90vh]"
    >
      {trend && (
        <>
          {/* Minimalist Dossier Header */}
          <div className="sticky top-0 z-20 flex items-start justify-between gap-4 px-6 py-5 bg-slate-950/95 backdrop-blur border-b border-slate-800">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono text-slate-400">
                <span className="text-white font-semibold">
                  DOSSIER #{String(trend.rank).padStart(2, '0')} / {String(totalTrends).padStart(2, '0')}
                </span>
                <span>·</span>
                <span>JEV {trend.jev.totalScore.toFixed(1)}/10</span>
                <span>·</span>
                <span>KEYWORD: “{trend.searchKeyword}”</span>
                <span>·</span>
                <span className="text-emerald-400">
                  US +{trend.growthMetrics.usGrowthPercent}% / LATAM +{trend.growthMetrics.latamGrowthPercent}%
                </span>
              </div>
              <h2
                id="modal-trend-title"
                className="text-xl sm:text-2xl font-semibold text-white tracking-tight"
              >
                {trend.topicTitle}
              </h2>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {onNavigate && (
                <>
                  <button
                    type="button"
                    onClick={() => onNavigate('prev')}
                    className="p-2 rounded-lg border border-slate-800 hover:border-slate-600 text-slate-400 hover:text-white transition-colors cursor-pointer"
                    title="Tendencia anterior (←)"
                    aria-label="Tendencia anterior"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigate('next')}
                    className="p-2 rounded-lg border border-slate-800 hover:border-slate-600 text-slate-400 hover:text-white transition-colors cursor-pointer"
                    title="Siguiente tendencia (→)"
                    aria-label="Siguiente tendencia"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </>
              )}
              <button
                type="button"
                onClick={() => dialogRef.current?.close()}
                className="p-2 rounded-lg border border-slate-800 hover:border-slate-600 text-slate-400 hover:text-white transition-colors cursor-pointer"
                aria-label="Cerrar modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Scrollable Production Sheet */}
          <div className="p-6 sm:p-8 overflow-y-auto space-y-10">
            {/* SECCIÓN A: INGENIERÍA INVERSA (5 Dimensiones del Reto 03) */}
            <section className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h3 className="text-xs font-mono uppercase tracking-widest text-slate-400">
                  A · INGENIERÍA INVERSA (EL GANCHO · EL FORMATO · EL TEMA · EL MOMENTO · QUIÉN PUBLICÓ)
                </h3>
                <span className="text-[11px] font-mono text-slate-500">
                  PREGUNTA 03 DEL RETO
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 border border-slate-800 rounded-lg divide-y md:divide-y-0 md:divide-x divide-slate-800">
                <div className="p-4 space-y-1.5">
                  <div className="text-[10px] font-mono uppercase tracking-widest text-slate-500">
                    01 / PATRÓN DEL GANCHO
                  </div>
                  <p className="text-sm text-slate-200 leading-relaxed">
                    {trend.whyItWorked.hookPattern}
                  </p>
                </div>

                <div className="p-4 space-y-1.5">
                  <div className="text-[10px] font-mono uppercase tracking-widest text-slate-500">
                    02 / FORMATO VISUAL
                  </div>
                  <p className="text-sm text-slate-200 leading-relaxed">
                    {trend.whyItWorked.winningFormat}
                  </p>
                </div>

                <div className="p-4 space-y-1.5">
                  <div className="text-[10px] font-mono uppercase tracking-widest text-slate-500">
                    03 / DRIVER Y TEMA
                  </div>
                  <p className="text-sm text-slate-200 leading-relaxed">
                    {trend.whyItWorked.emotionalDriver}
                  </p>
                </div>
              </div>

              {/* Evidence Table (Includes Who Published It & Velocity) */}
              <div className="border border-slate-800 rounded-lg divide-y divide-slate-800/80">
                {trend.evidence.map((ev) => (
                  <a
                    key={ev.id}
                    href={ev.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 hover:bg-slate-900/60 transition-colors"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 text-xs text-white font-medium">
                        {getPlatformIcon(ev.platform)}
                        <span className="font-mono text-[10px] uppercase text-slate-400">
                          {ev.platform}
                        </span>
                        <span className="text-slate-500">·</span>
                        <span className="font-mono text-[11px] text-emerald-300">
                          Autor: {ev.author}
                        </span>
                        <span className="text-slate-500">·</span>
                        <span className="truncate">{ev.title}</span>
                        <ExternalLink className="w-3 h-3 text-slate-500 shrink-0" />
                      </div>
                      <p className="text-xs text-slate-400 truncate">
                        “{ev.snippetOrTranscript}”
                      </p>
                    </div>

                    <div className="flex items-center gap-4 shrink-0 font-mono text-xs">
                      <span className="text-slate-400">
                        {ev.metrics.viewsOrEngagement.toLocaleString()} views
                      </span>
                      <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-emerald-400">
                        {ev.metrics.outlierVelocityScore.toLocaleString()} vistas/h
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </section>

            {/* SECCIÓN B: JUSTIFICACIÓN JEV LATAM (ESTADÍSTICA + CONSENSO MULTI-MODELO) */}
            <section className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2">
                <h3 className="text-xs font-mono uppercase tracking-widest text-slate-400">
                  B · AUDITORÍA ESTADÍSTICA Y CONSENSO MULTI-MODELO (MATRIZ JEV)
                </h3>
                <div className="flex items-center gap-3 text-xs font-mono text-slate-300">
                  <span>
                    J: {trend.jev.j_audienceFit} <span className="text-slate-500">(×0.4={(trend.jev.j_audienceFit * 0.4).toFixed(2)})</span>
                  </span>
                  <span>·</span>
                  <span>
                    E: {trend.jev.e_earlyTiming} <span className="text-slate-500">(×0.35={(trend.jev.e_earlyTiming * 0.35).toFixed(2)})</span>
                  </span>
                  <span>·</span>
                  <span>
                    V: {trend.jev.v_formatViability} <span className="text-slate-500">(×0.25={(trend.jev.v_formatViability * 0.25).toFixed(2)})</span>
                  </span>
                </div>
              </div>

              {trend.jev.statisticalTelemetry && (
                <div className="space-y-4">
                  {/* TypeSafe Jev System 1 Classifier Primitives (`noul`, `choice`, `score`) */}
                  {trend.jev.statisticalTelemetry.typesafeJevSystemOne && (
                    <div className="p-4 rounded-lg border border-emerald-500/30 bg-emerald-950/10 space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
                        <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-300 font-semibold">
                          CLASIFICADOR SISTEMA 1 · {trend.jev.statisticalTelemetry.typesafeJevSystemOne.engineUsed}
                        </span>
                        <span className="text-[11px] font-mono text-slate-400">
                          LATENCIA: {trend.jev.statisticalTelemetry.typesafeJevSystemOne.latencyMs}ms · SALIDA PROBABILÍSTICA TIPADA
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
                        <div className="p-2.5 rounded bg-slate-950/80 border border-slate-800/80 space-y-1">
                          <div className="text-[10px] text-slate-500">PRIMITIVA 1 · NOUL (BOOLEANO PROB.)</div>
                          <div className="text-slate-200 font-semibold">
                            is_actionable_b2b:{' '}
                            <span className="text-emerald-400">
                              {Math.round(trend.jev.statisticalTelemetry.typesafeJevSystemOne.noulB2bActionableProb * 100)}%
                            </span>
                          </div>
                        </div>
                        <div className="p-2.5 rounded bg-slate-950/80 border border-slate-800/80 space-y-1">
                          <div className="text-[10px] text-slate-500">PRIMITIVA 2 · CHOICE (DISTRIBUCIÓN)</div>
                          <div className="text-slate-200 font-semibold">
                            {trend.jev.statisticalTelemetry.typesafeJevSystemOne.choiceWaveStage.selected}{' '}
                            <span className="text-emerald-400">
                              (conf: {Math.round(trend.jev.statisticalTelemetry.typesafeJevSystemOne.choiceWaveStage.confidence * 100)}%)
                            </span>
                          </div>
                        </div>
                        <div className="p-2.5 rounded bg-slate-950/80 border border-slate-800/80 space-y-1">
                          <div className="text-[10px] text-slate-500">PRIMITIVA 3 · SCORE CALIBRADO</div>
                          <div className="text-slate-200 font-semibold">
                            Fit:{Math.round(trend.jev.statisticalTelemetry.typesafeJevSystemOne.calibratedScores.audienceFit.score * 100)}% ·
                            Timing:{Math.round(trend.jev.statisticalTelemetry.typesafeJevSystemOne.calibratedScores.earlyTiming.score * 100)}%
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Pillar 1: 60% Empirical Statistical Telemetry */}
                    <div className="p-4 rounded-lg border border-slate-800 bg-slate-900/30 space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                        <span className="text-[11px] font-mono uppercase tracking-wider text-slate-300">
                          1 · TELEMETRÍA ESTADÍSTICA EMPÍRICA (PESO 60%)
                        </span>
                        <span className="text-xs font-mono font-semibold text-white">
                          BASE: {trend.jev.statisticalTelemetry.statBase.statTotal.toFixed(1)}/10
                        </span>
                      </div>
                      <div className="space-y-1.5 text-xs font-mono text-slate-400">
                        <div className="flex items-center justify-between">
                          <span>J_stat (Densidad B2B/ROI: {trend.jev.statisticalTelemetry.empiricalMetrics.b2bSignalDensityPercent}%)</span>
                          <span className="text-slate-200">{trend.jev.statisticalTelemetry.statBase.j_stat.toFixed(1)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>E_stat (Ratio Arbitraje US/LatAm: {trend.jev.statisticalTelemetry.empiricalMetrics.arbitrageRatioUsLatam}x)</span>
                          <span className="text-slate-200">{trend.jev.statisticalTelemetry.statBase.e_stat.toFixed(1)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>
                            V_stat (log10 Pico {trend.jev.statisticalTelemetry.empiricalMetrics.maxOutlierVelocityPerHour.toLocaleString()} v/h · {trend.jev.statisticalTelemetry.empiricalMetrics.activeNetworksCount} redes)
                          </span>
                          <span className="text-slate-200">{trend.jev.statisticalTelemetry.statBase.v_stat.toFixed(1)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Pillar 2: 40% Multi-Model Consensus Jury */}
                    <div className="p-4 rounded-lg border border-slate-800 bg-slate-900/30 space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                        <span className="text-[11px] font-mono uppercase tracking-wider text-slate-300">
                          2 · COMITÉ DE CONSENSO ({trend.jev.statisticalTelemetry.llmConsensus.modelsConsulted} JUECES · PESO 40%)
                        </span>
                        <span className="text-xs font-mono font-semibold text-emerald-400">
                          ACUERDO {trend.jev.statisticalTelemetry.llmConsensus.consensusConfidence}% (σ={trend.jev.statisticalTelemetry.llmConsensus.stdDevSigma})
                        </span>
                      </div>
                      <div className="space-y-1.5 text-[11px] font-mono">
                        {trend.jev.statisticalTelemetry.llmConsensus.votes.map((vote, idx) => (
                          <div key={idx} className="flex items-center justify-between gap-2 text-slate-400">
                            <span className="truncate text-slate-300">{vote.model}</span>
                            <span className="shrink-0 text-slate-400">
                              J:{vote.j.toFixed(1)} E:{vote.e.toFixed(1)} V:{vote.v.toFixed(1)} →{' '}
                              <strong className="text-white">{vote.total.toFixed(1)}</strong>
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="p-4 rounded-lg bg-slate-900/40 border border-slate-800/90 space-y-2">
                <p className="text-sm text-slate-200 leading-relaxed">
                  {trend.jev.reasoning}
                </p>
                <p className="text-xs font-mono text-slate-400">
                  EL MOMENTO (ARBITRAJE US→LATAM): {trend.growthMetrics.arbitrageGap}
                </p>
              </div>
            </section>

            {/* SECCIÓN C: ADAPTACIÓN LISTA PARA PRODUCIR */}
            <section className="space-y-8">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h3 className="text-xs font-mono uppercase tracking-widest text-slate-400">
                  C · ESTUDIO DE PRODUCCIÓN 30X (@andresbilbao & @crece30x)
                </h3>
              </div>

              {/* C.1: 3 Ganchos Sugeridos */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-wider text-slate-300">
                    1. TRES ÁNGULOS DE APERTURA (PRIMEROS 3 SEGUNDOS)
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      handleCopy(
                        'hooks',
                        trend.adaptation.suggestedHooks
                          .map((h, i) => `${i + 1}. ${h}`)
                          .join('\n')
                      )
                    }
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded border border-slate-800 hover:border-slate-600 text-xs font-mono text-slate-300 cursor-pointer"
                  >
                    {copiedKey === 'hooks' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Copiado</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar 3 Ganchos</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {trend.adaptation.suggestedHooks.map((hook, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleCopy(`hook-${idx}`, hook)}
                      className="text-left p-4 rounded-lg border border-slate-800 hover:border-slate-600 bg-slate-900/20 flex flex-col justify-between gap-3 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center justify-between w-full font-mono text-[10px] text-slate-500">
                        <span>OPCIÓN 0{idx + 1}</span>
                        <span>{copiedKey === `hook-${idx}` ? 'COPIADO ✓' : 'CLIC PARA COPIAR'}</span>
                      </div>
                      <p className="text-sm text-white leading-relaxed">“{hook}”</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* C.2: Teleprompter / Timeline Reel Script for @andresbilbao */}
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-mono uppercase tracking-wider text-white">
                    2. TELEPROMPTER DE REEL — @andresbilbao (60 SEGUNDOS)
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setTeleprompterMode((prev) => !prev)}
                      className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer ${
                        teleprompterMode
                          ? 'bg-emerald-400/15 border-emerald-400 text-emerald-300'
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-600'
                      }`}
                    >
                      <MonitorPlay className="w-3.5 h-3.5" />
                      <span>{teleprompterMode ? 'Vista Normal' : 'Modo Teleprompter'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleCopy('reel', formatFullReelScript(trend))}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white hover:bg-slate-200 text-slate-950 font-mono text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      {copiedKey === 'reel' ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Guion Copiado</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copiar Guion</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="border border-slate-800 rounded-lg divide-y divide-slate-800">
                  <div className="grid grid-cols-1 sm:grid-cols-12 p-4 gap-3">
                    <div className="sm:col-span-3 font-mono text-xs text-emerald-400">
                      00:00 – 00:03
                      <span className="block text-[10px] text-slate-500">GANCHO</span>
                    </div>
                    <p
                      className={`sm:col-span-9 text-white leading-relaxed ${
                        teleprompterMode ? 'text-lg sm:text-xl font-medium' : 'text-sm'
                      }`}
                    >
                      {trend.adaptation.reelScriptBilbao.hook_0_3s}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 p-4 gap-3">
                    <div className="sm:col-span-3 font-mono text-xs text-slate-300">
                      00:03 – 00:15
                      <span className="block text-[10px] text-slate-500">PROBLEMA</span>
                    </div>
                    <p
                      className={`sm:col-span-9 text-slate-200 leading-relaxed ${
                        teleprompterMode ? 'text-lg sm:text-xl font-medium' : 'text-sm'
                      }`}
                    >
                      {trend.adaptation.reelScriptBilbao.problem_3_15s}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 p-4 gap-3">
                    <div className="sm:col-span-3 font-mono text-xs text-slate-300">
                      00:15 – 00:40
                      <span className="block text-[10px] text-slate-500">REVELACIÓN 30X</span>
                    </div>
                    <p
                      className={`sm:col-span-9 text-slate-200 leading-relaxed ${
                        teleprompterMode ? 'text-lg sm:text-xl font-medium' : 'text-sm'
                      }`}
                    >
                      {trend.adaptation.reelScriptBilbao.solution_15_40s}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 p-4 gap-3">
                    <div className="sm:col-span-3 font-mono text-xs text-slate-300">
                      00:40 – 01:00
                      <span className="block text-[10px] text-slate-500">CIERRE / CTA</span>
                    </div>
                    <p
                      className={`sm:col-span-9 text-slate-200 leading-relaxed ${
                        teleprompterMode ? 'text-lg sm:text-xl font-medium' : 'text-sm'
                      }`}
                    >
                      {trend.adaptation.reelScriptBilbao.cta_40_60s}
                    </p>
                  </div>
                </div>
              </div>

              {/* C.3: 6-Slide Storyboard for @crece30x */}
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-mono uppercase tracking-wider text-white">
                    3. STORYBOARD CARRUSEL (6 SLIDES) — @crece30x
                  </span>

                  <button
                    type="button"
                    onClick={() => handleCopy('carousel', formatFullCarousel(trend))}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-700 hover:border-white bg-slate-900 hover:bg-white text-white hover:text-slate-950 font-mono text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    {copiedKey === 'carousel' ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Carrusel Copiado</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar Carrusel</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {trend.adaptation.carousel30X.map((slide, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleCopy(`slide-${idx}`, slide)}
                      className="text-left p-4 rounded-lg border border-slate-800 hover:border-slate-600 bg-slate-900/20 flex flex-col justify-between gap-3 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center justify-between w-full text-[10px] font-mono text-slate-500 border-b border-slate-900 pb-2">
                        <span>SLIDE 0{idx + 1} / 06</span>
                        <span>{copiedKey === `slide-${idx}` ? 'COPIADO ✓' : '@CRECE30X'}</span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                        {slide}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </>
      )}
    </dialog>
  );
}
