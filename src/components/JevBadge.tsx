'use client';

import React from 'react';
import { JevEvaluation } from '@/types/radar';

interface JevBadgeProps {
  jev: JevEvaluation;
}

export default function JevBadge({ jev }: JevBadgeProps) {
  const metrics = [
    {
      key: 'J',
      label: 'Audiencia',
      weight: '40%',
      value: jev.j_audienceFit,
    },
    {
      key: 'E',
      label: 'Timing',
      weight: '35%',
      value: jev.e_earlyTiming,
    },
    {
      key: 'V',
      label: 'Formato',
      weight: '25%',
      value: jev.v_formatViability,
    },
  ];

  return (
    <div className="border border-slate-800/90 bg-slate-950/60 rounded-lg p-3.5 space-y-3">
      {/* Precision Score Readout */}
      <div className="flex items-baseline justify-between border-b border-slate-800/80 pb-2.5">
        <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
          MATRIZ JEV
        </span>
        <div className="font-mono text-2xl font-semibold tracking-tight text-white">
          {jev.totalScore.toFixed(1)}
          <span className="text-xs font-normal text-slate-500"> / 10</span>
        </div>
      </div>

      {/* Minimalist 3-Bar Micro-Meter (Braun / Linear Instrument Style) */}
      <div className="space-y-2">
        {metrics.map((m) => {
          const pct = Math.min(100, Math.max(10, Math.round(m.value * 10)));
          return (
            <div key={m.key} className="space-y-1">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-slate-400">
                  <strong className="text-slate-200 font-semibold">{m.key}</strong> · {m.label}{' '}
                  <span className="text-slate-600">({m.weight})</span>
                </span>
                <span className="text-slate-200">{m.value.toFixed(1)}</span>
              </div>
              <div className="w-full h-1 bg-slate-900 overflow-hidden">
                <div
                  className="h-full bg-slate-200 transition-all duration-300"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* TypeSafe Jev System 1 & Multi-Model Consensus Readout */}
      {jev.statisticalTelemetry && (
        <div className="pt-2 border-t border-slate-800/80 space-y-1 text-[10px] font-mono text-slate-400">
          <div className="flex items-center justify-between">
            <span>
              {jev.statisticalTelemetry.typesafeJevSystemOne?.isLiveTypeSafeApi
                ? 'TYPESAFE JEV-1.14 (LIVE)'
                : 'JEV SISTEMA-1 ($0)'}
            </span>
            <span className="text-emerald-400 font-semibold">
              NOUL B2B:{' '}
              {Math.round(
                (jev.statisticalTelemetry.typesafeJevSystemOne?.noulB2bActionableProb ?? 0.9) * 100
              )}
              %
            </span>
          </div>
          <div className="flex items-center justify-between text-slate-500">
            <span>
              CONSENSO: {jev.statisticalTelemetry.llmConsensus.consensusConfidence}% (σ=
              {jev.statisticalTelemetry.llmConsensus.stdDevSigma})
            </span>
            <span>
              V_MAX:{' '}
              {jev.statisticalTelemetry.empiricalMetrics.maxOutlierVelocityPerHour.toLocaleString()}{' '}
              v/h
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
