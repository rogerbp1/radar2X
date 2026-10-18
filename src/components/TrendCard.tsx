'use client';

import React from 'react';
import {
  ArrowUpRight,
  ExternalLink,
  Globe2,
  Instagram,
  Linkedin,
  PlaySquare,
  Youtube,
} from 'lucide-react';
import { EvidenceItem, RadarTrendItem, WaveStage } from '@/types/radar';
import JevBadge from '@/components/JevBadge';

interface TrendCardProps {
  trend: RadarTrendItem;
  onSelectTrend: (trend: RadarTrendItem) => void;
  isActive?: boolean;
}

function getWaveIndicator(stage: WaveStage) {
  switch (stage) {
    case 'EARLY_WAVE':
      return {
        dot: 'bg-emerald-500',
        pill: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        bar: 'bg-emerald-500',
        stroke: '#10b981',
        label: '🌱 Ola Temprana',
      };
    case 'EXPLODING':
      return {
        dot: 'bg-amber-500',
        pill: 'bg-amber-50 text-amber-700 border-amber-200',
        bar: 'bg-amber-500',
        stroke: '#f59e0b',
        label: '🔥 En Explosión',
      };
    case 'SATURATED':
      return {
        dot: 'bg-rose-400',
        pill: 'bg-rose-50 text-rose-700 border-rose-200',
        bar: 'bg-rose-400',
        stroke: '#f43f5e',
        label: '💀 Saturado',
      };
  }
}

function getPlatformIcon(platform: EvidenceItem['platform']) {
  switch (platform) {
    case 'YOUTUBE':
      return <Youtube className="w-3.5 h-3.5 text-red-500 shrink-0" />;
    case 'LINKEDIN':
      return <Linkedin className="w-3.5 h-3.5 text-sky-600 shrink-0" />;
    case 'INSTAGRAM':
      return <Instagram className="w-3.5 h-3.5 text-pink-600 shrink-0" />;
    case 'TIKTOK':
      return <PlaySquare className="w-3.5 h-3.5 text-indigo-600 shrink-0" />;
    default:
      return <Globe2 className="w-3.5 h-3.5 text-slate-500 shrink-0" />;
  }
}

export default function TrendCard({ trend, onSelectTrend, isActive = false }: TrendCardProps) {
  const wave = getWaveIndicator(trend.waveStage);
  const rankFormatted = String(trend.rank).padStart(2, '0');
  const usBarWidth = Math.min(100, Math.max(8, Math.round(trend.growthMetrics.usGrowthPercent / 3.5)));
  const latamBarWidth = Math.min(100, Math.max(5, Math.round(trend.growthMetrics.latamGrowthPercent / 3.5)));
  const ratio = (
    trend.growthMetrics.usGrowthPercent /
    Math.max(10, trend.growthMetrics.latamGrowthPercent)
  ).toFixed(1);

  return (
    <article
      className={`group border transition-all rounded-2xl overflow-hidden bg-white ${
        isActive
          ? 'border-indigo-500 ring-2 ring-indigo-500/10 shadow-md'
          : 'border-slate-200/90 hover:border-slate-300 shadow-sm'
      }`}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Column 1: Rank + Arbitrage Visual Bars (3 cols) */}
        <div className="lg:col-span-3 p-5 border-b lg:border-b-0 lg:border-r border-slate-100 flex flex-col justify-between gap-4 bg-slate-50/40">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block">
                RANK #{trend.rank}
              </span>
              <span className="font-mono text-3xl font-bold tracking-tight text-slate-900">
                {rankFormatted}
              </span>
            </div>

            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium ${wave.pill}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${wave.dot}`} />
              {wave.label}
            </span>
          </div>

          {/* US vs LatAm Arbitrage Comparison */}
          <div className="space-y-2.5 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-500">EE. UU.</span>
              <span className="text-slate-900 font-bold">
                +{trend.growthMetrics.usGrowthPercent}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-200/70 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${wave.bar}`}
                style={{ width: `${usBarWidth}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-xs font-mono pt-0.5">
              <span className="text-slate-500">LatAm</span>
              <span className="text-slate-600 font-medium">
                +{trend.growthMetrics.latamGrowthPercent}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-200/70 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-indigo-400"
                style={{ width: `${latamBarWidth}%` }}
              />
            </div>

            <div className="flex items-center justify-between pt-1 text-xs font-mono">
              <span className="text-slate-400">Multiplicador</span>
              <span className="text-indigo-600 font-semibold">{ratio}x brecha</span>
            </div>
          </div>
        </div>

        {/* Column 2: Clean Topic, Hook & Evidence Chips (6 cols) */}
        <div className="lg:col-span-6 p-5 sm:p-6 flex flex-col justify-between gap-4">
          <div className="space-y-1.5">
            <div className="text-xs font-mono text-indigo-600 font-medium">
              Keyword: “{trend.searchKeyword}”
            </div>
            <h2
              onClick={() => onSelectTrend(trend)}
              className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug cursor-pointer"
            >
              {trend.topicTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {trend.growthMetrics.arbitrageGap}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-100">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-xs font-mono uppercase text-emerald-700 font-semibold block">
                Gancho (0-3s)
              </span>
              <p className="text-xs text-slate-700 leading-relaxed">
                {trend.whyItWorked.hookPattern}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-xs font-mono uppercase text-indigo-700 font-semibold block">
                Formato Ganador
              </span>
              <p className="text-xs text-slate-700 leading-relaxed">
                {trend.whyItWorked.winningFormat}
              </p>
            </div>
          </div>

          {/* Evidence Links Row */}
          <div className="pt-2 flex flex-wrap items-center gap-2">
            {trend.evidence.map((ev) => (
              <a
                key={ev.id}
                href={ev.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-xs text-slate-700 transition-colors max-w-[260px]"
                title={`${ev.author} — ${ev.title}`}
              >
                {getPlatformIcon(ev.platform)}
                <span className="truncate font-medium">{ev.title}</span>
                <span className="font-mono text-xs text-emerald-600 font-semibold shrink-0">
                  {ev.metrics.outlierVelocityScore.toLocaleString()}/h
                </span>
                <ExternalLink className="w-3 h-3 text-slate-400 shrink-0" />
              </a>
            ))}
          </div>
        </div>

        {/* Column 3: JEV Instrument & Action Trigger (3 cols) */}
        <div className="lg:col-span-3 p-5 border-t lg:border-t-0 lg:border-l border-slate-100 flex flex-col justify-between gap-4 bg-slate-50/20">
          <JevBadge jev={trend.jev} />

          <button
            type="button"
            onClick={() => onSelectTrend(trend)}
            className="w-full inline-flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-mono font-semibold bg-slate-950 hover:bg-indigo-600 text-white transition-all cursor-pointer shadow-sm"
          >
            <span>Ver Rayos X y Guion 30X</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </article>
  );
}
