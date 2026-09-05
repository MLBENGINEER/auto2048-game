import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, Wrench, Film, CheckCircle2 } from 'lucide-react';
import { ejecutarAnuncioRecompensa } from '../game/engine';

interface RewardedAdModalProps {
  isOpen: boolean;
  score: number;
  boardSize: number;
  onAdCompleted: () => void;
  onGameOverRestart: () => void;
}

export const RewardedAdModal: React.FC<RewardedAdModalProps> = ({
  isOpen,
  score,
  boardSize,
  onAdCompleted,
  onGameOverRestart,
}) => {
  const [isPlayingAd, setIsPlayingAd] = useState(false);
  const [adProgress, setAdProgress] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setIsPlayingAd(false);
      setAdProgress(0);
    }
  }, [isOpen]);

  const handleStartRewardedAd = async () => {
    setIsPlayingAd(true);
    setAdProgress(0);

    // Disparar hook de YouTube Playables
    ejecutarAnuncioRecompensa();

    // Animación de carga de 3 segundos simulando el anuncio de YouTube
    const duration = 3000;
    const interval = 50;
    let elapsed = 0;

    const timer = setInterval(() => {
      elapsed += interval;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setAdProgress(pct);

      if (elapsed >= duration) {
        clearInterval(timer);
        setTimeout(() => {
          setIsPlayingAd(false);
          onAdCompleted();
        }, 200);
      }
    }, interval);
  };

  if (!isOpen) return null;

  return (
    <div
      id="rewarded-ad-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-200"
    >
      <div
        id="rewarded-ad-card"
        className="w-full max-w-md bg-[var(--bg-surface)] border border-white/10 rounded-2xl p-6 shadow-2xl relative overflow-hidden"
      >
        {/* Glow Header */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-[var(--accent)]/15 rounded-full blur-2xl pointer-events-none" />

        {!isPlayingAd ? (
          /* PANTALLA PRINCIPAL: ¿Te quedaste sin espacio? */
          <div>
            {/* YouTube Playables Badge */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-1.5 bg-red-500/15 text-red-400 border border-red-500/30 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider">
                <Film className="w-3.5 h-3.5" />
                <span>YouTube Playables • Anuncio de Salvación</span>
              </div>
              <span className="text-[10px] font-theme-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-bold">
                Salvación Infinita
              </span>
            </div>

            {/* Title & Prompt exact message */}
            <div className="text-center my-3">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-[var(--accent)] mb-3 shadow-inner">
                <Wrench className="w-7 h-7" />
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white tracking-tight mb-2 leading-snug">
                ¡Oh no! Tu cochera está llena.
              </h2>
              <p className="text-sm font-semibold text-amber-300 max-w-xs mx-auto leading-relaxed">
                Mira un anuncio para continuar tu racha hacia el Top Mundial.
              </p>
            </div>

            {/* Garage Cleaning Bonus Highlight */}
            <div className="bg-black/40 border border-white/10 rounded-xl p-3.5 my-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/20 border border-amber-500/40 text-[var(--accent)] flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="flex-1 text-xs">
                <p className="font-bold text-white mb-0.5">
                  Limpieza Aleatoria: 4 o 5 Fichas
                </p>
                <p className="text-[var(--text-dim)] text-[11px] leading-relaxed">
                  Elimina de forma aleatoria 4 o 5 de las piezas de menor nivel que estorban en tu cochera ({boardSize}x{boardSize}) para rescatar tus <strong className="text-white">{score.toLocaleString()} pts</strong> y seguir rompiendo el récord.
                </p>
              </div>
            </div>

            {/* Buttons */}
            <div className="space-y-2.5 mt-5">
              <button
                id="btn-watch-rewarded-ad"
                onClick={handleStartRewardedAd}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-black rounded-xl shadow-lg transition transform active:scale-95 flex items-center justify-center gap-2 text-xs uppercase tracking-wider cursor-pointer"
              >
                <Play className="w-4 h-4 fill-black" />
                <span>Ver Anuncio y Continuar Racha</span>
              </button>

              <button
                id="btn-decline-rewarded-ad"
                onClick={onGameOverRestart}
                className="w-full py-2.5 px-4 bg-transparent hover:bg-white/5 text-[var(--text-dim)] hover:text-white rounded-xl transition text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Empezar nueva partida</span>
              </button>
            </div>
          </div>
        ) : (
          /* ANIMACIÓN DE CARGA DE 3 SEGUNDOS */
          <div className="py-6 text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-600/20 border border-red-500/40 text-red-400 mb-1 animate-pulse">
              <Film className="w-8 h-8" />
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--text-dim)] block mb-1">
                YouTube Playables SDK
              </span>
              <h3 className="text-lg font-black text-white">
                Transmitiendo Anuncio de Salvación...
              </h3>
              <p className="text-xs text-amber-300 mt-1 font-medium">
                Despejando 4 o 5 piezas menores para continuar tu racha hacia el Top Mundial
              </p>
            </div>

            {/* Barra de progreso de 3 segundos */}
            <div className="w-full bg-black/60 rounded-full h-3 overflow-hidden border border-white/10 p-0.5 my-4">
              <div
                className="bg-gradient-to-r from-red-500 via-amber-500 to-emerald-400 h-full rounded-full transition-all duration-75"
                style={{ width: `${adProgress}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-xs font-theme-mono text-[var(--text-dim)] px-1">
              <span>{Math.round((3 * adProgress) / 100)}s / 3s</span>
              <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Limpieza lista
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
