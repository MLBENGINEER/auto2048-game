import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, Wrench, Film, CheckCircle2 } from 'lucide-react';
import { anuncioRecompensa } from '../utils/playables';

interface RewardedAdModalProps {
  isOpen: boolean;
  score: number;
  boardSize: number;
  /** huboAnuncio distingue la revivida pagada con un anuncio de la de cortesía. */
  onAdCompleted: (huboAnuncio: boolean) => void;
  onGameOverRestart: () => void;
  /** Revividas de cortesía que quedan si YouTube no tiene anuncios que mostrar. */
  revividasGratisRestantes: number;
}

export const RewardedAdModal: React.FC<RewardedAdModalProps> = ({
  isOpen,
  score,
  boardSize,
  onAdCompleted,
  onGameOverRestart,
  revividasGratisRestantes,
}) => {
  const [isPlayingAd, setIsPlayingAd] = useState(false);
  const [noCompletado, setNoCompletado] = useState(false);
  const [sinAnunciosNiCupo, setSinAnunciosNiCupo] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setIsPlayingAd(false);
      setNoCompletado(false);
      setSinAnunciosNiCupo(false);
    }
  }, [isOpen]);

  const handleStartRewardedAd = async () => {
    setIsPlayingAd(true);
    setNoCompletado(false);

    // El anuncio lo dibuja YouTube por encima del juego. Aquí solo se espera al
    // resultado; no hay barra de progreso propia porque no controlamos el vídeo.
    const resultado = await anuncioRecompensa('revivir-cochera');

    setIsPlayingAd(false);

    if (resultado === 'no-ganada') {
      // Hubo anuncio y el jugador no lo terminó: no hay premio.
      setNoCompletado(true);
      return;
    }

    if (resultado === 'ganada') {
      // Vio el anuncio: revive siempre, sin límite.
      onAdCompleted(true);
      return;
    }

    // 'no-disponible': YouTube no tiene anuncio para esta región, o estamos
    // fuera de Playables. Se conceden unas pocas revividas de cortesía, porque
    // no hay ingreso que proteger, pero no infinitas: con revividas ilimitadas
    // y gratis la clasificación premiaría a quien juegue donde no hay anuncios.
    if (revividasGratisRestantes > 0) {
      onAdCompleted(false);
      return;
    }

    setSinAnunciosNiCupo(true);
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

            {sinAnunciosNiCupo && (
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 mb-1 text-center">
                <p className="text-xs font-semibold text-amber-300">
                  Ahora mismo no hay anuncios disponibles en tu zona y ya usaste
                  tus rescates de cortesía de esta partida.
                </p>
              </div>
            )}

            {noCompletado && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 mb-1 text-center">
                <p className="text-xs font-semibold text-red-300">
                  No completaste el anuncio, así que la cochera sigue llena.
                  Puedes intentarlo otra vez.
                </p>
              </div>
            )}

            {/* Buttons */}
            <div className="space-y-2.5 mt-5">
              <button
                id="btn-watch-rewarded-ad"
                onClick={handleStartRewardedAd}
                disabled={sinAnunciosNiCupo}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-black rounded-xl shadow-lg transition transform active:scale-95 flex items-center justify-center gap-2 text-xs uppercase tracking-wider cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:from-amber-500"
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
                Cargando anuncio...
              </h3>
              <p className="text-xs text-amber-300 mt-1 font-medium">
                Despejando 4 o 5 piezas menores para continuar tu racha hacia el Top Mundial
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 text-xs font-theme-mono text-[var(--text-dim)] my-4">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Limpieza lista al terminar</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
