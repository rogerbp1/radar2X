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
      barColor: 'bg-indigo-500',
      textColor: 'text-indigo-600',
    },
    {
      key: 'E',
      label: 'Timing',
      weight: '35%',
      value: jev.e_earlyTiming,
      barColor: 'bg-emerald-500',
      textColor: 'text-emerald-600',
    },
    {
      key: 'V',
      label: 'Formato',
      weight: '25%',
      value: jev.v_formatViability,
      barColor: 'bg-amber-500',
      textColor: 'text-amber-600',
    },
  ];

  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (Math.min(10, Math.max(0, jev.totalScore)) / 10) * circumference;

  return (
    <div className="border border-slate-200/90 bg-slate-50/60 rounded-xl p-3.5 space-y-3">
      {/* Precision Score Readout with Minimalist Ring */}
      <div className="flex items-center justify-between border-b border-slate-200/80 pb-2.5">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block">
            MATRIZ JEV
          </span>
          <span className="text-xs text-slate-600 font-medium">
            Prioridad Ejecutiva
          </span>
        </div>

        <div className="relative flex items-center justify-center">
          <svg className="w-12 h-12 -rotate-90" viewBox="0 0 44 44">
            <circle
              cx="22"
              cy="22"
              r={radius}
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="3.5"
            />
            <circle
              cx="22"
              cy="22"
              r={radius}
              fill="none"
              stroke="#10b981"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
            />
          </svg>
          <span className="absolute font-mono text-xs font-bold text-slate-900">
            {jev.totalScore.toFixed(1)}
          </span>
        </div>
      </div>

      {/* 3-Bar Color Micro-Meter */}
      <div className="space-y-2">
        {metrics.map((m) => {
          const pct = Math.min(100, Math.max(10, Math.round(m.value * 10)));
          return (
            <div key={m.key} className="space-y-1">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-600">
                  <strong className={`${m.textColor} font-bold`}>{m.key}</strong> · {m.label}{' '}
                  <span className="text-slate-400">({m.weight})</span>
                </span>
                <span className="text-slate-900 font-semibold">{m.value.toFixed(1)}</span>
              </div>
              <div className="w-full h-1.5 bg-slate-200/80 rounded-full overflow-hidden">
                <div
                  className={`h-full ${m.barColor} rounded-full transition-all duration-300`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
