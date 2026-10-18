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
      return <Youtube className="w-3.5 h-3.5 text-red-500" />;
    case 'LINKEDIN':
      return <Linkedin className="w-3.5 h-3.5 text-sky-600" />;
    case 'INSTAGRAM':
      return <Instagram className="w-3.5 h-3.5 text-pink-600" />;
    default:
      return <PlaySquare className="w-3.5 h-3.5 text-indigo-600" />;
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
      // Fallback
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
      className="w-full max-w-5xl rounded-2xl bg-white text-slate-900 border border-slate-200 shadow-2xl p-0 m-auto open:flex open:flex-col max-h-[90vh]"
    >
      {trend && (
        <>
          {/* Minimalist White Header */}
          <div className="sticky top-0 z-20 flex items-start justify-between gap-4 px-6 py-5 bg-white/95 backdrop-blur border-b border-slate-200">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono text-slate-500">
                <span className="px-2 py-0.5 rounded-md bg-slate-950 text-white font-semibold">
                  #{String(trend.rank).padStart(2, '0')} / {String(totalTrends).padStart(2, '0')}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
                  JEV {trend.jev.totalScore.toFixed(1)}/10
                </span>
                <span>Keyword: “{trend.searchKeyword}”</span>
                <span className="text-indigo-600 font-semibold">
                  EE. UU. +{trend.growthMetrics.usGrowthPercent}% vs LatAm +{trend.growthMetrics.latamGrowthPercent}%
                </span>
              </div>
              <h2
                id="modal-trend-title"
                className="text-xl sm:text-2xl font-bold text-slate-950 tracking-tight"
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
                    className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-950 transition-colors cursor-pointer"
                    title="Tendencia anterior (←)"
                    aria-label="Tendencia anterior"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigate('next')}
                    className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-950 transition-colors cursor-pointer"
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
                className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-950 transition-colors cursor-pointer"
                aria-label="Cerrar modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="p-6 sm:p-8 overflow-y-auto space-y-8">
            {/* SECCIÓN A: INGENIERÍA INVERSA */}
            <section className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="text-xs font-mono uppercase tracking-wider text-slate-500 font-semibold">
                  A · Ingeniería Inversa (Gancho · Formato · Driver · Evidencia)
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200/70 space-y-1.5">
                  <div className="text-xs font-mono uppercase text-emerald-700 font-semibold">
                    01 / Patrón del Gancho (0-3s)
                  </div>
                  <p className="text-sm text-slate-800 leading-relaxed">
                    {trend.whyItWorked.hookPattern}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-200/70 space-y-1.5">
                  <div className="text-xs font-mono uppercase text-indigo-700 font-semibold">
                    02 / Formato Visual
                  </div>
                  <p className="text-sm text-slate-800 leading-relaxed">
                    {trend.whyItWorked.winningFormat}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200/70 space-y-1.5">
                  <div className="text-xs font-mono uppercase text-amber-700 font-semibold">
                    03 / Driver Emocional
                  </div>
                  <p className="text-sm text-slate-800 leading-relaxed">
                    {trend.whyItWorked.emotionalDriver}
                  </p>
                </div>
              </div>

              {/* Evidence List */}
              <div className="border border-slate-200 rounded-xl divide-y divide-slate-100">
                {trend.evidence.map((ev) => (
                  <a
                    key={ev.id}
                    href={ev.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 hover:bg-slate-50 transition-colors"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-900 font-semibold">
                        {getPlatformIcon(ev.platform)}
                        <span className="font-mono uppercase text-slate-500">
                          {ev.platform}
                        </span>
                        <span className="text-slate-300">·</span>
                        <span className="font-mono text-indigo-600">
                          {ev.author}
                        </span>
                        <span className="text-slate-300">·</span>
                        <span className="truncate">{ev.title}</span>
                        <ExternalLink className="w-3 h-3 text-slate-400 shrink-0" />
                      </div>
                      <p className="text-xs text-slate-500 truncate">
                        “{ev.snippetOrTranscript}”
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 font-mono text-xs">
                      <span className="text-slate-500">
                        {ev.metrics.viewsOrEngagement.toLocaleString()} views
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-semibold">
                        {ev.metrics.outlierVelocityScore.toLocaleString()} vistas/h
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </section>

            {/* SECCIÓN B: JUSTIFICACIÓN JEV LATAM */}
            <section className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
                <h3 className="text-xs font-mono uppercase tracking-wider text-slate-500 font-semibold">
                  B · Tesis de Arbitraje y Matriz JEV LatAm
                </h3>
                <div className="flex items-center gap-3 text-xs font-mono text-slate-600">
                  <span>J: <strong>{trend.jev.j_audienceFit}</strong> (40%)</span>
                  <span>·</span>
                  <span>E: <strong>{trend.jev.e_earlyTiming}</strong> (35%)</span>
                  <span>·</span>
                  <span>V: <strong>{trend.jev.v_formatViability}</strong> (25%)</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                <p className="text-sm text-slate-800 leading-relaxed">
                  {trend.jev.reasoning}
                </p>
                <p className="text-xs font-mono text-indigo-600">
                  Ventana US→LatAm: {trend.growthMetrics.arbitrageGap}
                </p>
              </div>
            </section>

            {/* SECCIÓN C: ADAPTACIÓN LISTA PARA PRODUCIR */}
            <section className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="text-xs font-mono uppercase tracking-wider text-slate-500 font-semibold">
                  C · Estudio de Producción (@andresbilbao & @crece30x)
                </h3>
              </div>

              {/* C.1: 3 Ganchos Sugeridos */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase text-slate-600 font-semibold">
                    1. Tres Ángulos de Gancho (Primeros 3 Segundos)
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
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-mono text-slate-700 cursor-pointer"
                  >
                    {copiedKey === 'hooks' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
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
                      className="text-left p-4 rounded-xl border border-slate-200 hover:border-indigo-400 bg-white hover:bg-indigo-50/20 flex flex-col justify-between gap-2 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center justify-between w-full font-mono text-xs text-indigo-600 font-semibold">
                        <span>ÁNGULO 0{idx + 1}</span>
                        <span>{copiedKey === `hook-${idx}` ? 'COPIADO ✓' : 'COPIAR'}</span>
                      </div>
                      <p className="text-sm text-slate-900 font-medium leading-relaxed">“{hook}”</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* C.2: Teleprompter Reel Script for @andresbilbao */}
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-mono uppercase text-slate-700 font-semibold">
                    2. Guion de Reel (60s) — @andresbilbao
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setTeleprompterMode((prev) => !prev)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-mono text-xs font-medium transition-colors cursor-pointer ${
                        teleprompterMode
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <MonitorPlay className="w-3.5 h-3.5" />
                      <span>{teleprompterMode ? 'Vista Normal' : 'Modo Teleprompter'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleCopy('reel', formatFullReelScript(trend))}
                      className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-slate-950 hover:bg-indigo-600 text-white font-mono text-xs font-semibold transition-colors cursor-pointer"
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

                <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 bg-white">
                  <div className="grid grid-cols-1 sm:grid-cols-12 p-4 gap-3">
                    <div className="sm:col-span-3 font-mono text-xs text-emerald-700 font-semibold">
                      00:00 – 00:03
                      <span className="block text-slate-400 font-normal">GANCHO</span>
                    </div>
                    <p
                      className={`sm:col-span-9 text-slate-900 font-medium leading-relaxed ${
                        teleprompterMode ? 'text-lg sm:text-xl' : 'text-sm'
                      }`}
                    >
                      {trend.adaptation.reelScriptBilbao.hook_0_3s}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 p-4 gap-3">
                    <div className="sm:col-span-3 font-mono text-xs text-amber-700 font-semibold">
                      00:03 – 00:15
                      <span className="block text-slate-400 font-normal">PROBLEMA</span>
                    </div>
                    <p
                      className={`sm:col-span-9 text-slate-800 leading-relaxed ${
                        teleprompterMode ? 'text-lg sm:text-xl' : 'text-sm'
                      }`}
                    >
                      {trend.adaptation.reelScriptBilbao.problem_3_15s}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 p-4 gap-3">
                    <div className="sm:col-span-3 font-mono text-xs text-indigo-700 font-semibold">
                      00:15 – 00:40
                      <span className="block text-slate-400 font-normal">REVELACIÓN 30X</span>
                    </div>
                    <p
                      className={`sm:col-span-9 text-slate-800 leading-relaxed ${
                        teleprompterMode ? 'text-lg sm:text-xl' : 'text-sm'
                      }`}
                    >
                      {trend.adaptation.reelScriptBilbao.solution_15_40s}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 p-4 gap-3">
                    <div className="sm:col-span-3 font-mono text-xs text-purple-700 font-semibold">
                      00:40 – 01:00
                      <span className="block text-slate-400 font-normal">CIERRE / CTA</span>
                    </div>
                    <p
                      className={`sm:col-span-9 text-slate-800 leading-relaxed ${
                        teleprompterMode ? 'text-lg sm:text-xl' : 'text-sm'
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
                  <span className="text-xs font-mono uppercase text-slate-700 font-semibold">
                    3. Storyboard Carrusel (6 Slides) — @crece30x
                  </span>

                  <button
                    type="button"
                    onClick={() => handleCopy('carousel', formatFullCarousel(trend))}
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg border border-slate-300 hover:border-slate-900 bg-white hover:bg-slate-950 text-slate-900 hover:text-white font-mono text-xs font-semibold transition-colors cursor-pointer"
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
                      className="text-left p-4 rounded-xl border border-slate-200 hover:border-indigo-400 bg-slate-50/50 hover:bg-white flex flex-col justify-between gap-3 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center justify-between w-full text-xs font-mono text-slate-400 border-b border-slate-200/80 pb-2">
                        <span className="text-indigo-600 font-semibold">SLIDE 0{idx + 1} / 06</span>
                        <span>{copiedKey === `slide-${idx}` ? 'COPIADO ✓' : '@CRECE30X'}</span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
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
