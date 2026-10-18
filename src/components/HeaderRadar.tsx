'use client';

import React, { useEffect, useState } from 'react';
import { ArrowUpRight, Check, ExternalLink, KeyRound, RefreshCw, X } from 'lucide-react';

interface HeaderRadarProps {
  sourceMode: 'LIVE_APIS' | 'HYBRID_FALLBACK';
  activeModelUsed: string;
  generatedAt: string;
  isScanning: boolean;
  onScanLive: () => void;
  earlyWaveCount: number;
  avgTopScore: string;
}

export default function HeaderRadar({
  sourceMode,
  generatedAt,
  isScanning,
  onScanLive,
  earlyWaveCount,
  avgTopScore,
}: HeaderRadarProps) {
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [openrouterKey, setOpenrouterKey] = useState('');
  const [youtubeKey, setYoutubeKey] = useState('');
  const [tavilyKey, setTavilyKey] = useState('');
  const [keyStatus, setKeyStatus] = useState({
    openrouterConfigured: false,
    youtubeConfigured: false,
    tavilyConfigured: false,
  });
  const [savingKeys, setSavingKeys] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);

  useEffect(() => {
    fetch('/api/config-keys')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setKeyStatus(data);
      })
      .catch(() => {});
  }, []);

  const handleSaveKeys = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingKeys(true);
    setSavedNotice(false);
    try {
      const res = await fetch('/api/config-keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          OPENROUTER_API_KEY: openrouterKey,
          YOUTUBE_API_KEY: youtubeKey,
          TAVILY_API_KEY: tavilyKey,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setKeyStatus({
          openrouterConfigured: data.openrouterConfigured,
          youtubeConfigured: data.youtubeConfigured,
          tavilyConfigured: data.tavilyConfigured,
        });
        setOpenrouterKey('');
        setYoutubeKey('');
        setTavilyKey('');
        setSavedNotice(true);
        onScanLive();
      }
    } finally {
      setSavingKeys(false);
    }
  };

  const formattedTime = React.useMemo(() => {
    try {
      return new Date(generatedAt).toLocaleTimeString('es-CO', {
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'Ahora';
    }
  }, [generatedAt]);

  const connectedCount =
    Number(keyStatus.openrouterConfigured) +
    Number(keyStatus.youtubeConfigured) +
    Number(keyStatus.tavilyConfigured);

  return (
    <header className="border-b border-slate-200 bg-white/95 backdrop-blur sticky top-0 z-30">
      {/* Minimalist Top Bar */}
      <div className="border-b border-slate-100 bg-slate-50/70 px-4 sm:px-6 lg:px-8 py-1.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-slate-500">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 text-emerald-700 font-medium bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 rounded-full">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Costo Operativo: $0.00 (OpenRouter :free)
            </span>
            <span className="hidden md:inline text-slate-400">
              Fuentes: Google Trends + YouTube + LinkedIn Público
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowKeyModal((prev) => !prev)}
              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-slate-200 bg-white hover:border-slate-300 text-slate-700 hover:text-slate-950 transition-colors cursor-pointer"
            >
              <KeyRound className="w-3 h-3 text-indigo-600" />
              <span>APIs ({connectedCount}/3)</span>
            </button>
            <span className="text-slate-300">·</span>
            <span className="text-slate-500">
              {sourceMode === 'LIVE_APIS' ? 'LIVE' : 'DEMO'} · {formattedTime}
            </span>
          </div>
        </div>
      </div>

      {/* Collapsible API Key Configurator */}
      {showKeyModal && (
        <div className="border-b border-slate-200 bg-slate-50 px-4 sm:px-6 lg:px-8 py-5">
          <div className="max-w-7xl mx-auto space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-indigo-600" />
                  Conectar APIs Gratuitas en .env.local
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Pega tus llaves y haz clic en Guardar y Escanear.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowKeyModal(false)}
                className="p-1 text-slate-400 hover:text-slate-900 cursor-pointer"
                aria-label="Cerrar panel de APIs"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={handleSaveKeys}
              className="grid grid-cols-1 md:grid-cols-3 gap-3"
            >
              <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-900 font-medium">1. OPENROUTER_API_KEY</span>
                  <span className={keyStatus.openrouterConfigured ? 'text-emerald-600' : 'text-amber-600'}>
                    {keyStatus.openrouterConfigured ? '✓ Conectada' : 'Opcional'}
                  </span>
                </div>
                <input
                  type="password"
                  value={openrouterKey}
                  onChange={(e) => setOpenrouterKey(e.target.value)}
                  placeholder="sk-or-v1-..."
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-mono text-slate-900"
                />
                <a
                  href="https://openrouter.ai/settings/keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:underline"
                >
                  Obtener llave gratis <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-900 font-medium">2. YOUTUBE_API_KEY</span>
                  <span className={keyStatus.youtubeConfigured ? 'text-emerald-600' : 'text-amber-600'}>
                    {keyStatus.youtubeConfigured ? '✓ Conectada' : 'Opcional'}
                  </span>
                </div>
                <input
                  type="password"
                  value={youtubeKey}
                  onChange={(e) => setYoutubeKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-mono text-slate-900"
                />
                <a
                  href="https://console.cloud.google.com/apis/library/youtube.googleapis.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:underline"
                >
                  Obtener en Google Cloud <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-900 font-medium">3. TAVILY_API_KEY</span>
                  <span className={keyStatus.tavilyConfigured ? 'text-emerald-600' : 'text-amber-600'}>
                    {keyStatus.tavilyConfigured ? '✓ Conectada' : 'Opcional'}
                  </span>
                </div>
                <input
                  type="password"
                  value={tavilyKey}
                  onChange={(e) => setTavilyKey(e.target.value)}
                  placeholder="tvly-..."
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-mono text-slate-900"
                />
                <a
                  href="https://app.tavily.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:underline"
                >
                  Obtener en Tavily <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="md:col-span-3 flex items-center justify-between gap-4 pt-1">
                <span className="text-xs font-mono text-emerald-600">
                  {savedNotice ? '✓ Llaves guardadas y escaneo activado.' : ''}
                </span>
                <button
                  type="submit"
                  disabled={savingKeys}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-950 hover:bg-slate-800 text-white text-xs font-mono font-semibold cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{savingKeys ? 'Guardando...' : 'Guardar y Escanear'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Main Minimalist White Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-slate-950">
              30X HackRadar
            </h1>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
              <span>Arbitraje US→LatAm & Matriz JEV</span>
              <span>·</span>
              <a
                href="https://www.instagram.com/crece30x"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:text-indigo-800 font-medium inline-flex items-center gap-0.5"
              >
                @crece30x
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
              <span>/</span>
              <a
                href="https://www.instagram.com/andresbilbao"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-600 hover:text-emerald-800 font-medium inline-flex items-center gap-0.5"
              >
                @andresbilbao
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="px-3 py-1.5 rounded-lg bg-emerald-50/80 border border-emerald-200/70 flex items-baseline gap-2">
                <span className="text-xs text-emerald-700 font-medium">Olas Tempranas</span>
                <span className="text-sm font-mono font-bold text-emerald-900">{earlyWaveCount}</span>
              </div>
              <div className="px-3 py-1.5 rounded-lg bg-indigo-50/80 border border-indigo-200/70 flex items-baseline gap-2">
                <span className="text-xs text-indigo-700 font-medium">JEV Top 3</span>
                <span className="text-sm font-mono font-bold text-indigo-900">{avgTopScore}/10</span>
              </div>
            </div>

            <button
              type="button"
              onClick={onScanLive}
              disabled={isScanning}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono font-semibold bg-slate-950 text-white hover:bg-slate-800 active:translate-y-px transition-all disabled:opacity-50 cursor-pointer shadow-sm"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`}
              />
              <span>
                {isScanning ? 'Escaneando...' : '⚡ Escanear Semana en Vivo'}
              </span>
              {!isScanning && <ArrowUpRight className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
