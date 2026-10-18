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
}

function getWaveIndicator(stage: WaveStage) {
  switch (stage) {
    case 'EARLY_WAVE':
      return {
        dot: 'bg-emerald-400',
        text: 'text-emerald-300',
        label: '🌱 Ola Temprana',
      };
    case 'EXPLODING':
      return {
        dot: 'bg-amber-400',
        text: 'text-amber-300',
        label: '🔥 En Explosión',
      };
    case 'SATURATED':
      return {
        dot: 'bg-rose-400',
        text: 'text-slate-400',
        label: '💀 Saturado',
      };
  }
}

function getPlatformIcon(platform: EvidenceItem['platform']) {
  switch (platform) {
    case 'YOUTUBE':
      return <Youtube className="w-3.5 h-3.5 text-slate-300 shrink-0" />;
    case 'LINKEDIN':
      return <Linkedin className="w-3.5 h-3.5 text-slate-300 shrink-0" />;
    case 'INSTAGRAM':
      return <Instagram className="w-3.5 h-3.5 text-slate-300 shrink-0" />;
    case 'TIKTOK':
      return <PlaySquare className="w-3.5 h-3.5 text-slate-300 shrink-0" />;
    default:
      return <Globe2 className="w-3.5 h-3.5 text-slate-300 shrink-0" />;
  }
}

export default function TrendCard({ trend, onSelectTrend }: TrendCardProps) {
  const wave = getWaveIndicator(trend.waveStage);
  const rankFormatted = String(trend.rank).padStart(2, '0');
  const usBarWidth = Math.min(100, Math.max(8, Math.round(trend.growthMetrics.usGrowthPercent / 3.5)));
  const latamBarWidth = Math.min(100, Math.max(5, Math.round(trend.growthMetrics.latamGrowthPercent / 3.5)));

  return (
    <article className="group border border-slate-800/80 hover:border-slate-600 bg-slate-950 transition-colors rounded-xl overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Column 1: Index Rank + Arbitrage Delta Meter (3 cols) */}
        <div className="lg:col-span-3 p-5 border-b lg:border-b-0 lg:border-r border-slate-800/70 flex flex-col justify-between gap-4 bg-slate-900/20">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 block">
                RANK #{trend.rank}
              </span>
              <span className="font-mono text-3xl sm:text-4xl font-light tracking-tighter text-white">
                {rankFormatted}
              </span>
            </div>

            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded border border-slate-800 bg-slate-900/80 text-[11px] font-mono ${wave.text}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${wave.dot}`} />
              {wave.label}
            </span>
          </div>

          {/* Visual US vs LatAm Arbitrage Comparison */}
          <div className="space-y-2 pt-2 border-t border-slate-900">
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-slate-400">US GROWTH</span>
              <span className="text-white font-semibold">
                +{trend.growthMetrics.usGrowthPercent}%
              </span>
            </div>
            <div className="w-full h-1 bg-slate-900">
              <div
                className="h-full bg-emerald-400"
                style={{ width: `${usBarWidth}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono pt-1">
              <span className="text-slate-400">LATAM GROWTH</span>
              <span className="text-slate-300">
                +{trend.growthMetrics.latamGrowthPercent}%
              </span>
            </div>
            <div className="w-full h-1 bg-slate-900">
              <div
                className="h-full bg-slate-500"
                style={{ width: `${latamBarWidth}%` }}
              />
            </div>
          </div>

          <div className="text-[11px] font-mono text-slate-400 pt-1">
            QUERY: <span className="text-slate-200">“{trend.searchKeyword}”</span>
          </div>
        </div>

        {/* Column 2: Editorial Thesis, Hook Anatomy & Evidence Links (6 cols) */}
        <div className="lg:col-span-6 p-5 sm:p-6 flex flex-col justify-between gap-5">
          <div className="space-y-2">
            <h2
              onClick={() => onSelectTrend(trend)}
              className="text-lg sm:text-xl font-medium text-white group-hover:text-emerald-300 transition-colors leading-snug cursor-pointer"
            >
              {trend.topicTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              {trend.growthMetrics.arbitrageGap}
            </p>
          </div>

          {/* Clean Hairline Split: Hook & Format */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-800/70">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 block">
                PSICOLOGÍA DEL GANCHO (0-3s)
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                {trend.whyItWorked.hookPattern}
              </p>
            </div>

            <div className="space-y-1 sm:border-l sm:border-slate-800/70 sm:pl-4">
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 block">
                FORMATO VISUAL GANADOR
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                {trend.whyItWorked.winningFormat}
              </p>
            </div>
          </div>

          {/* Evidence Links Row */}
          <div className="pt-3 border-t border-slate-900 flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 mr-1">
              EVIDENCIA PÚBLICA:
            </span>
            {trend.evidence.map((ev) => (
              <a
                key={ev.id}
                href={ev.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded border border-slate-800 hover:border-slate-600 bg-slate-900/50 hover:bg-slate-900 text-xs text-slate-300 transition-colors max-w-[260px]"
                title={`${ev.author} — ${ev.title}`}
              >
                {getPlatformIcon(ev.platform)}
                <span className="truncate">{ev.title}</span>
                <span className="font-mono text-[10px] text-emerald-400 shrink-0">
                  {ev.metrics.outlierVelocityScore.toLocaleString()}/h
                </span>
                <ExternalLink className="w-3 h-3 text-slate-500 shrink-0" />
              </a>
            ))}
          </div>
        </div>

        {/* Column 3: JEV Instrument & Action Trigger (3 cols) */}
        <div className="lg:col-span-3 p-5 border-t lg:border-t-0 lg:border-l border-slate-800/70 flex flex-col justify-between gap-4 bg-slate-900/10">
          <JevBadge jev={trend.jev} />

          <button
            type="button"
            onClick={() => onSelectTrend(trend)}
            className="w-full inline-flex items-center justify-between px-4 py-3 rounded-lg text-xs font-mono uppercase tracking-wider font-semibold bg-slate-900 hover:bg-white text-slate-100 hover:text-slate-950 border border-slate-700 hover:border-white transition-all cursor-pointer"
          >
            <span>Ver Rayos X y Guion 30X</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </article>
  );
}
