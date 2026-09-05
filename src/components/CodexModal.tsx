import React, { useEffect, useState } from 'react';
import { X, Trophy, Sparkles, CheckCircle2, Lock } from 'lucide-react';
import { EVOLUTION_LEVELS } from '../constants/evolutions';
import { EvolutionIcon } from './EvolutionIcon';
import { getCustomImageSync, initCustomImages, onCustomImagesChange } from '../utils/customImages';
import { cleanImageFilename, getVehicleImageUrl, getVehicleImageFallbackUrl } from '../utils/imagePath';

interface CodexModalProps {
  isOpen: boolean;
  onClose: () => void;
  highestLevelUnlocked: number;
}

export const CodexModal: React.FC<CodexModalProps> = ({
  isOpen,
  onClose,
  highestLevelUnlocked,
}) => {
  const [, setVersion] = useState(0);

  useEffect(() => {
    initCustomImages().then(() => setVersion((v) => v + 1));
    return onCustomImagesChange(() => setVersion((v) => v + 1));
  }, []);

  if (!isOpen) return null;

  return (
    <div
      id="codex-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-in fade-in duration-150"
    >
      <div
        id="codex-modal-container"
        className="w-full max-w-2xl max-h-[90vh] bg-[var(--bg-surface)] border border-white/10 rounded-xl shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[var(--bg-deep)]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[var(--accent)]/15 border border-[var(--accent)]/30 flex items-center justify-center text-[var(--accent)]">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-white uppercase tracking-tight">
                Evolución Automotriz • Museo
              </h2>
              <p className="text-xs font-theme-mono text-[var(--text-dim)]">
                {highestLevelUnlocked} de {EVOLUTION_LEVELS.length} eras descubiertas
              </p>
            </div>
          </div>
          <button
            id="btn-close-codex"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--text-dim)] hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-3">
          {EVOLUTION_LEVELS.map((item) => {
            const isUnlocked = item.level <= highestLevelUnlocked;
            const isLevel10Expansion = item.level === 10;
            const milestoneVal = item.milestone;

            return (
              <div
                key={item.level}
                id={`codex-item-lvl-${item.level}`}
                className={`p-3.5 sm:p-4 rounded-xl border transition flex items-start gap-4 ${
                  isUnlocked
                    ? `bg-black/40 ${item.borderColor} shadow-md`
                    : 'bg-black/20 border-white/5 opacity-40'
                }`}
              >
                {/* Icon box */}
                <div
                  className={`w-16 h-16 sm:w-18 sm:h-18 rounded-xl flex items-center justify-center shrink-0 border relative overflow-hidden ${
                    isUnlocked
                      ? item.image
                        ? `p-0 border-white/20 shadow-md`
                        : `p-2 bg-gradient-to-br ${item.bgGradient} ${item.borderColor} cyber-tile-surface`
                      : 'p-2 bg-[var(--bg-deep)] border-white/5 text-zinc-600'
                  }`}
                  style={isUnlocked ? { boxShadow: `0 0 14px ${item.glowColor}` } : undefined}
                >
                  {isUnlocked ? (
                    item.image ? (
                      (() => {
                        const cleanImg = cleanImageFilename(item.image);
                        const customSrc = getCustomImageSync(cleanImg);
                        const activeSrc = customSrc || getVehicleImageUrl(cleanImg);

                        return (
                          <img
                            src={activeSrc}
                            alt={item.name}
                            className="w-full h-full object-cover block"
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              const imgEl = e.currentTarget as HTMLImageElement;
                              const current = imgEl.getAttribute('src') || '';
                              const fallback = getVehicleImageFallbackUrl(cleanImg);
                              if (!current.includes('assets/')) {
                                imgEl.src = fallback;
                              } else {
                                imgEl.style.display = 'none';
                              }
                            }}
                          />
                        );
                      })()
                    ) : (
                      <EvolutionIcon level={item.level} className="w-full h-full drop-shadow-md" />
                    )
                  ) : (
                    <Lock className="w-6 h-6 text-zinc-600" />
                  )}

                  {/* Level pill */}
                  <span className="absolute bottom-1 right-1 bg-black/80 font-theme-mono text-[9px] px-1 py-0.2 rounded text-[var(--text-dim)] border border-white/10 z-10">
                    L{item.level}
                  </span>
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="text-sm sm:text-base font-bold text-white truncate uppercase tracking-tight">
                      {isUnlocked ? item.name : `Nivel ${item.level} (Bloqueado)`}
                    </h3>

                    {isUnlocked && (
                      <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded font-medium">
                        <CheckCircle2 className="w-3 h-3" />
                        Descubierto
                      </span>
                    )}

                    {milestoneVal && (
                      <span className="inline-flex items-center gap-1 text-[10px] bg-amber-500/15 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded font-bold font-theme-mono">
                        <Sparkles className="w-3 h-3" />
                        Hito {milestoneVal}
                      </span>
                    )}

                    {isLevel10Expansion && (
                      <span className="inline-flex items-center gap-1 text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/40 px-2 py-0.5 rounded font-bold">
                        ★ Expansión a 5x5
                      </span>
                    )}
                  </div>

                  <div className="text-xs text-[var(--accent)] font-medium mb-1">
                    {item.era} • <span className="text-[var(--text-dim)] font-theme-mono">{item.yearRange}</span>
                  </div>

                  <p className="text-xs text-[var(--text-dim)] leading-relaxed">
                    {isUnlocked ? item.description : 'Combina dos piezas del nivel anterior para desbloquear esta era de la ingeniería automotriz.'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
