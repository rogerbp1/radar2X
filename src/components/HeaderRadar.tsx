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
  activeModelUsed,
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
    <header className="border-b border-slate-800/80 bg-slate-950 sticky top-0 z-30">
      {/* Top Micro-Status Ticker (Editorial Terminal Style) */}
      <div className="border-b border-slate-900 bg-slate-950 px-4 sm:px-6 lg:px-8 py-2">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-y-1 gap-x-4 text-[11px] font-mono text-slate-400">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span className="inline-flex items-center gap-1.5 text-slate-200">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Costo Operativo: $0.00 (OpenRouter :free)
            </span>
            <span className="text-slate-700">·</span>
            <span>Fuentes: Google Trends + YouTube + LinkedIn Público</span>
            <span className="text-slate-700 hidden sm:inline">·</span>
            <span className="hidden sm:inline text-emerald-400">
              Ahorro vs. Scrapers Pagos: ~$4,800 USD/año
            </span>
          </div>

          <div className="flex items-center gap-3 text-slate-500">
            <button
              type="button"
              onClick={() => setShowKeyModal((prev) => !prev)}
              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded border border-slate-800 hover:border-slate-600 text-slate-200 hover:text-white transition-colors cursor-pointer"
            >
              <KeyRound className="w-3 h-3 text-emerald-400" />
              <span>Conectar APIs ({connectedCount}/3)</span>
            </button>
            <span className="text-slate-700">/</span>
            <span>
              {sourceMode === 'LIVE_APIS' ? 'LIVE_APIS' : 'DEMO_SAFE'} · {formattedTime}
            </span>
          </div>
        </div>
      </div>

      {/* Collapsible Visual API Key Configurator (Writes directly to .env.local) */}
      {showKeyModal && (
        <div className="border-b border-slate-800 bg-slate-900/90 px-4 sm:px-6 lg:px-8 py-5">
          <div className="max-w-6xl mx-auto space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-emerald-400" />
                  Conectar APIs Gratuitas en .env.local (Sin usar la Terminal)
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Pega tus llaves aquí abajo y haz clic en <strong>Guardar y Escanear</strong>. Se guardarán automáticamente en el archivo <code>.env.local</code> de tu Mac.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowKeyModal(false)}
                className="p-1 text-slate-400 hover:text-white cursor-pointer"
                aria-label="Cerrar panel de APIs"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={handleSaveKeys}
              className="grid grid-cols-1 md:grid-cols-3 gap-3"
            >
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-white">1. OPENROUTER_API_KEY</span>
                  <span
                    className={
                      keyStatus.openrouterConfigured
                        ? 'text-emerald-400'
                        : 'text-amber-400'
                    }
                  >
                    {keyStatus.openrouterConfigured ? '✓ Conectada' : 'Pendiente'}
                  </span>
                </div>
                <input
                  type="password"
                  value={openrouterKey}
                  onChange={(e) => setOpenrouterKey(e.target.value)}
                  placeholder="sk-or-v1-..."
                  className="w-full px-2.5 py-1.5 rounded bg-slate-900 border border-slate-800 text-xs font-mono text-white"
                />
                <a
                  href="https://openrouter.ai/settings/keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-emerald-300"
                >
                  Obtener llave gratis en OpenRouter <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-white">2. YOUTUBE_API_KEY</span>
                  <span
                    className={
                      keyStatus.youtubeConfigured
                        ? 'text-emerald-400'
                        : 'text-amber-400'
                    }
                  >
                    {keyStatus.youtubeConfigured ? '✓ Conectada' : 'Pendiente'}
                  </span>
                </div>
                <input
                  type="password"
                  value={youtubeKey}
                  onChange={(e) => setYoutubeKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full px-2.5 py-1.5 rounded bg-slate-900 border border-slate-800 text-xs font-mono text-white"
                />
                <a
                  href="https://console.cloud.google.com/apis/library/youtube.googleapis.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-emerald-300"
                >
                  Obtener llave gratis en Google Cloud <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-white">3. TAVILY_API_KEY</span>
                  <span
                    className={
                      keyStatus.tavilyConfigured
                        ? 'text-emerald-400'
                        : 'text-amber-400'
                    }
                  >
                    {keyStatus.tavilyConfigured ? '✓ Conectada' : 'Pendiente'}
                  </span>
                </div>
                <input
                  type="password"
                  value={tavilyKey}
                  onChange={(e) => setTavilyKey(e.target.value)}
                  placeholder="tvly-..."
                  className="w-full px-2.5 py-1.5 rounded bg-slate-900 border border-slate-800 text-xs font-mono text-white"
                />
                <a
                  href="https://app.tavily.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-emerald-300"
                >
                  Obtener llave gratis en Tavily <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>

              <div className="md:col-span-3 flex items-center justify-between gap-4 pt-1">
                <span className="text-xs font-mono text-emerald-400">
                  {savedNotice
                    ? '✓ Llaves guardadas en .env.local y escaneo en vivo activado.'
                    : 'Puedes guardar 1, 2 o las 3 llaves.'}
                </span>
                <button
                  type="submit"
                  disabled={savingKeys}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white hover:bg-slate-200 text-slate-950 text-xs font-mono font-semibold uppercase tracking-wider cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{savingKeys ? 'Guardando...' : 'Guardar en .env.local y Escanear'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Main Editorial Header */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono uppercase tracking-widest text-slate-400">
              <span>RETO 30X: RADAR DE CONTENIDO</span>
              <span>—</span>
              <a
                href="https://www.instagram.com/crece30x"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-slate-300 hover:text-white underline underline-offset-4"
              >
                @crece30x
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
              <span>·</span>
              <a
                href="https://www.instagram.com/andresbilbao"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-slate-300 hover:text-white underline underline-offset-4"
              >
                @andresbilbao
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white">
              30X HackRadar
            </h1>
            <p className="text-sm text-slate-400 max-w-xl">
              Inteligencia de Tendencias, Deconstrucción de Ganchos y Priorización JEV
            </p>
          </div>

          {/* Minimalist Metrics + Primary Action */}
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-6 border-l border-slate-800 pl-5">
              <div>
                <div className="text-[10px] font-mono uppercase tracking-widest text-slate-500">
                  Arbitraje US→LatAm
                </div>
                <div className="text-lg font-mono font-semibold text-white">
                  {earlyWaveCount} <span className="text-xs font-normal text-slate-400">olas tempranas</span>
                </div>
              </div>

              <div>
                <div className="text-[10px] font-mono uppercase tracking-widest text-slate-500">
                  Índice JEV Top 3
                </div>
                <div className="text-lg font-mono font-semibold text-white">
                  {avgTopScore}<span className="text-xs font-normal text-slate-500">/10</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onScanLive}
              disabled={isScanning}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-mono uppercase tracking-wider font-semibold bg-white text-slate-950 hover:bg-slate-200 active:translate-y-px transition-all disabled:opacity-50 cursor-pointer"
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
