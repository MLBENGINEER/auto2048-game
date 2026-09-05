import React, { useState, useEffect, useMemo } from 'react';
import { Sparkles, Trophy, Tv, Play, CheckCircle2 } from 'lucide-react';
import { getEvolutionByLevel, MILESTONE_LEVELS } from '../constants/evolutions';
import { EvolutionIcon } from './EvolutionIcon';
import { getCustomImageSync } from '../utils/customImages';
import { cleanImageFilename, getVehicleImageUrl, getVehicleImageFallbackUrl } from '../utils/imagePath';
import { anuncioIntersticial } from '../utils/playables';

interface MilestoneCelebrationModalProps {
  isOpen: boolean;
  level: number;
  onCompleted: () => void;
}

interface FireworkParticleData {
  id: number;
  originX: number; // percentage
  originY: number; // percentage
  dx: string;
  dy: string;
  color: string;
  duration: string;
  delay: string;
  size: number;
}

export const MilestoneCelebrationModal: React.FC<MilestoneCelebrationModalProps> = ({
  isOpen,
  level,
  onCompleted,
}) => {
  const [adPlaying, setAdPlaying] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);

  const evolution = getEvolutionByLevel(level);
  const milestoneValue = MILESTONE_LEVELS[level] || Math.pow(2, level);

  const rawImage = evolution.image || `${level}.png`;
  const cleanImg = cleanImageFilename(rawImage);
  const customSrc = getCustomImageSync(cleanImg);
  const activeSrc = customSrc || getVehicleImageUrl(cleanImg);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setAdPlaying(false);
      setImgFailed(false);
    }
  }, [isOpen, level]);

  // Generar partículas de fuegos artificiales digitales alrededor del vehículo
  const particles: FireworkParticleData[] = useMemo(() => {
    const neonColors = [
      '#f59e0b', // Amber/Gold
      '#06b6d4', // Cyan
      '#ec4899', // Pink
      '#10b981', // Emerald
      '#a855f7', // Purple
      '#f43f5e', // Rose
      '#38bdf8', // Sky
      '#fde047', // Yellow
    ];

    const origins = [
      { x: 20, y: 30 },
      { x: 80, y: 25 },
      { x: 30, y: 70 },
      { x: 75, y: 75 },
      { x: 50, y: 40 },
    ];

    const result: FireworkParticleData[] = [];
    let id = 0;

    origins.forEach((origin) => {
      const count = 7;
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * 2 * Math.PI + Math.random() * 0.4;
        const distance = 80 + Math.random() * 110;
        const dx = `${Math.cos(angle) * distance}px`;
        const dy = `${Math.sin(angle) * distance}px`;
        const color = neonColors[Math.floor(Math.random() * neonColors.length)];
        const duration = `${1.4 + Math.random() * 0.8}s`;
        const delay = `${Math.random() * 1.5}s`;
        const size = 5 + Math.random() * 5;

        result.push({
          id: id++,
          originX: origin.x,
          originY: origin.y,
          dx,
          dy,
          color,
          duration,
          delay,
          size,
        });
      }
    });

    return result;
  }, []);

  // El hito es una pausa natural: buen momento para el intersticial. Lo dibuja
  // YouTube por encima del juego, asi que aqui solo se espera al resultado.
  // Si no hay anuncio disponible, la promesa resuelve igual y se continua.
  const handleContinueClick = async () => {
    setAdPlaying(true);
    await anuncioIntersticial();
    setAdPlaying(false);
    onCompleted();
  };

  if (!isOpen) return null;

  return (
    <div
      id="milestone-celebration-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/92 backdrop-blur-xl overflow-y-auto animate-in fade-in duration-300"
    >
      {/* CAPA CONTINUA DE FUEGOS ARTIFICIALES DIGITALES CSS DETRÁS DEL VEHÍCULO */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Anillos de detonación luminosa */}
        <div
          className="absolute top-1/4 left-1/5 w-24 h-24 rounded-full border border-amber-400/40 firework-burst-ring pointer-events-none"
          style={{ '--delay': '0.2s' } as React.CSSProperties}
        />
        <div
          className="absolute top-1/3 right-1/4 w-32 h-32 rounded-full border border-cyan-400/40 firework-burst-ring pointer-events-none"
          style={{ '--delay': '0.8s' } as React.CSSProperties}
        />
        <div
          className="absolute bottom-1/4 left-1/3 w-28 h-28 rounded-full border border-rose-400/40 firework-burst-ring pointer-events-none"
          style={{ '--delay': '1.4s' } as React.CSSProperties}
        />

        {/* Partículas de fuegos artificiales de colores brillantes */}
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full firework-particle pointer-events-none shadow-lg"
            style={
              {
                left: `${p.originX}%`,
                top: `${p.originY}%`,
                width: `${p.size}px`,
                height: `${p.size}px`,
                backgroundColor: p.color,
                boxShadow: `0 0 14px ${p.color}, 0 0 24px ${p.color}`,
                '--dx': p.dx,
                '--dy': p.dy,
                '--duration': p.duration,
                '--delay': p.delay,
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      {/* CONTENIDO PRINCIPAL: CARTEL GIGANTE Y ELEGANTE */}
      <div className="relative z-10 w-full max-w-lg flex flex-col items-center text-center my-auto py-4">
        {!adPlaying ? (
          /* VISTA A: CELEBRACIÓN DE HITO CON CARRO GIGANTE */
          <div className="w-full flex flex-col items-center animate-in zoom-in-95 duration-300">
            {/* Badge de Hito Legendario o Trascendental */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-400/40 text-amber-300 text-xs font-extrabold uppercase tracking-widest mb-3 shadow-[0_0_20px_rgba(245,158,11,0.25)]">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>
                {level === 15
                  ? '¡HITO SUPREMO • PUESTO #1 MUNDIAL!'
                  : `Hito ${milestoneValue.toLocaleString()} • Nivel ${level}`}
              </span>
              <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
            </div>

            {/* Cartel Gigante y Elegante */}
            {level === 15 ? (
              <div className="flex flex-col items-center">
                <h1 className="text-2xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-200 to-yellow-500 drop-shadow-[0_0_35px_rgba(250,204,21,0.9)] shimmer-gold-text leading-tight">
                  ¡DIOS DE LA INGENIERÍA - MODO INFINITO DESBLOQUEADO!
                </h1>
                <p className="text-sm sm:text-base font-bold text-amber-200 tracking-wide mt-2 max-w-lg">
                  ¡Combinaste dos Naves Interdimensionales! Has alcanzado la cúspide universal del automovilismo y conquistado el Puesto #1 Global.
                </p>
              </div>
            ) : (
              <>
                <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-400 drop-shadow-[0_0_25px_rgba(245,158,11,0.6)] shimmer-gold-text">
                  ¡FELICIDADES!
                </h1>
                <p className="text-sm sm:text-lg font-bold text-zinc-200 tracking-wide mt-1.5 max-w-md">
                  {level >= 11
                    ? 'Desbloqueaste un nuevo vehículo legendario'
                    : `Desbloqueaste el vehículo de Nivel ${level}`}
                </p>
              </>
            )}

            {/* CENTRO: VEHÍCULO RECIÉN DESBLOQUEADO EN GRANDE (ESPACIO EQUIVALENTE A TODO EL TABLERO) */}
            <div className="w-full max-w-[360px] sm:max-w-[420px] aspect-square my-5 relative">
              <div
                id={`milestone-car-display-${level}`}
                className={`w-full h-full rounded-3xl border-4 overflow-hidden relative giant-neon-pulse flex items-center justify-center bg-gradient-to-br ${evolution.bgGradient} ${evolution.borderColor}`}
                style={
                  {
                    '--legend-glow': evolution.glowColor,
                    '--legend-glow-soft': evolution.glowColorSoft || 'rgba(245, 158, 11, 0.4)',
                  } as React.CSSProperties
                }
              >
                {!imgFailed && activeSrc ? (
                  <img
                    src={activeSrc}
                    alt={evolution.name}
                    className="w-full h-full object-cover block select-none pointer-events-none transition-transform duration-500 hover:scale-105"
                    draggable={false}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      const current = e.currentTarget.getAttribute('src') || '';
                      const fallback = getVehicleImageFallbackUrl(cleanImg);
                      if (!current.includes('assets/')) {
                        e.currentTarget.src = fallback;
                      } else {
                        setImgFailed(true);
                      }
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center p-6 bg-black/40">
                    <EvolutionIcon
                      level={level}
                      className="w-full h-full max-w-[85%] max-h-[85%] object-contain drop-shadow-[0_0_30px_var(--legend-glow)]"
                    />
                  </div>
                )}

                {/* Sombra y Gradiente de lectura inferior */}
                <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/90 via-black/50 to-transparent pointer-events-none" />

                {/* Etiqueta flotante inferior en la imagen */}
                <div className="absolute bottom-3 inset-x-4 flex items-end justify-between pointer-events-none">
                  <div className="text-left">
                    <span className="text-[11px] font-bold text-amber-300 uppercase tracking-widest block">
                      {evolution.era}
                    </span>
                    <h3 className="text-lg sm:text-xl font-black text-white leading-tight drop-shadow-md">
                      {evolution.name}
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-black font-theme-mono text-amber-300 bg-black/70 px-2.5 py-1 rounded-lg border border-amber-400/40">
                      {evolution.hpPoints.toLocaleString()} HP
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-zinc-400 max-w-sm mb-6 leading-relaxed">
              {evolution.description}
            </p>

            {/* BOTÓN CONTINUAR -> DETONA EJECUTAR ANUNCIO YOUTUBE */}
            <button
              id="btn-milestone-continue"
              onClick={handleContinueClick}
              className="w-full max-w-sm py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-black font-black text-sm uppercase tracking-widest shadow-[0_0_30px_rgba(245,158,11,0.5)] transition transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-black" />
              <span>Continuar</span>
            </button>
          </div>
        ) : (
          /* Espera breve mientras YouTube decide si hay anuncio que mostrar */
          <div className="w-full max-w-md bg-[var(--bg-surface)] border border-white/10 rounded-3xl p-8 shadow-2xl text-center animate-in zoom-in-95 duration-200">
            <div
              className="w-12 h-12 mx-auto rounded-full border-2 border-t-transparent animate-spin mb-4"
              style={{ borderColor: evolution.accentColor, borderTopColor: 'transparent' }}
            />
            <p className="text-sm font-bold text-white">Preparando la siguiente partida...</p>
          </div>
        )}
      </div>
    </div>
  );
};
