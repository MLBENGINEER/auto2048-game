import React, { useEffect, useState } from 'react';
import { Play, Sparkles, X, Tv, Trophy } from 'lucide-react';
import { getEvolutionByLevel, MILESTONE_LEVELS } from '../constants/evolutions';
import { EvolutionIcon } from './EvolutionIcon';

export interface YouTubeAdEvent {
  type: 'milestone' | 'expansion' | 'gameover';
  level: number;
  milestoneValue?: number;
  newSize?: number;
  timestamp: number;
}

interface YouTubeAdBannerProps {
  adEvent: YouTubeAdEvent | null;
  onClose: () => void;
}

export const YouTubeAdBanner: React.FC<YouTubeAdBannerProps> = ({ adEvent, onClose }) => {
  const [countdown, setCountdown] = useState(3);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!adEvent) return;
    setCountdown(3);
    setProgress(0);

    const startTime = Date.now();
    const duration = 3000;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);

      const rem = Math.max(0, 3 - Math.floor(elapsed / 1000));
      setCountdown(rem);

      if (elapsed >= duration) {
        clearInterval(interval);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [adEvent]);

  if (!adEvent) return null;

  const evolution = getEvolutionByLevel(adEvent.level);
  const milestoneNumber = adEvent.milestoneValue || MILESTONE_LEVELS[adEvent.level] || Math.pow(2, adEvent.level);
  const isMilestone = adEvent.type === 'milestone';

  return (
    <div
      id="yt-ad-interstitial-modal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200"
    >
      <div
        id="yt-ad-card"
        className="w-full max-w-md bg-[var(--bg-surface)] border border-white/10 rounded-2xl p-6 shadow-2xl relative overflow-hidden"
      >
        {/* Ambient Top Glow */}
        <div
          className="absolute -top-16 -right-16 w-36 h-36 rounded-full blur-3xl pointer-events-none opacity-40"
          style={{ backgroundColor: evolution.accentColor }}
        />

        {/* YouTube Playables Header Badge */}
        <div className="flex items-center justify-between mb-4 relative z-10">
          <div className="flex items-center gap-2 bg-red-500/15 text-red-400 border border-red-500/30 px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wider">
            <Tv className="w-3.5 h-3.5" />
            <span>YouTube Playables • Anuncio Intersticial</span>
          </div>
          <button
            id="btn-close-ad-early"
            onClick={onClose}
            className="text-[var(--text-dim)] hover:text-white p-1 rounded-md hover:bg-white/10 transition"
            title="Omitir simulación"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Milestone Display */}
        <div className="text-center my-3 relative z-10">
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl border mb-3 shadow-lg relative p-2"
            style={{
              borderColor: evolution.accentColor,
              backgroundColor: 'rgba(0,0,0,0.6)',
              boxShadow: `0 0 20px ${evolution.glowColor}`,
            }}
          >
            <EvolutionIcon level={adEvent.level} className="w-full h-full object-contain" />
            <div className="absolute -bottom-1.5 -right-1.5 bg-amber-500 text-black rounded-full p-1 shadow">
              <Sparkles className="w-3 h-3 fill-black" />
            </div>
          </div>

          <div className="flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[var(--accent)] mb-1">
            <Trophy className="w-3.5 h-3.5" />
            <span>¡Hito Alcanzado!</span>
          </div>

          <h3 className="text-2xl font-black text-white uppercase tracking-tight">
            {isMilestone ? `Meta ${milestoneNumber}` : `¡Tablero ${adEvent.newSize}x${adEvent.newSize}!`}
          </h3>

          <p className="text-sm font-semibold text-zinc-300 mt-1">
            {evolution.name} <span className="text-[var(--text-dim)] text-xs font-normal">({evolution.era})</span>
          </p>

          <p className="text-xs text-[var(--text-dim)] mt-1.5 max-w-xs mx-auto leading-relaxed">
            {evolution.description}
          </p>
        </div>

        {/* Interstitial Ad 3-second simulation progress */}
        <div className="bg-black/50 border border-white/10 rounded-xl p-3 my-4 relative z-10">
          <div className="flex items-center justify-between text-xs font-theme-mono text-[var(--text-dim)] mb-1.5">
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              ejecutarAnuncioYouTube() en pausa (3s)
            </span>
            <span className="font-bold text-white">{countdown > 0 ? `${countdown}s` : 'Listo'}</span>
          </div>

          <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden border border-white/5">
            <div
              className="h-full bg-gradient-to-r from-red-500 via-amber-400 to-emerald-400 transition-all duration-75"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="text-[10px] text-zinc-500 mt-2 font-theme-mono">
            ytgame.ads.requestInterstitialAd() • Felicitación por hito histórico
          </p>
        </div>

        {/* Action Button */}
        <div className="mt-4 flex items-center justify-between gap-3 relative z-10">
          <span className="text-xs font-theme-mono text-[var(--text-dim)]">
            {countdown > 0 ? `Reanudando en ${countdown}s...` : 'Juego reanudado'}
          </span>
          <button
            id="btn-resume-game"
            onClick={onClose}
            className="flex items-center gap-1.5 bg-[var(--accent)] hover:brightness-110 text-black font-extrabold px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider transition active:scale-95 shadow-lg"
          >
            <Play className="w-3.5 h-3.5 fill-black" />
            <span>Continuar Jugando</span>
          </button>
        </div>
      </div>
    </div>
  );
};
