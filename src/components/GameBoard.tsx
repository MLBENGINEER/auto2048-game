import React, { useEffect, useState } from 'react';
import { TileData } from '../types/game';
import { getEvolutionByLevel } from '../constants/evolutions';
import { EvolutionIcon } from './EvolutionIcon';
import { getCustomImageSync, initCustomImages, onCustomImagesChange } from '../utils/customImages';
import { cleanImageFilename, getVehicleImageUrl, getVehicleImageFallbackUrl } from '../utils/imagePath';

interface GameBoardProps {
  size: number;
  tiles: TileData[];
  isExpandedRecently: boolean;
}

interface TileItemProps {
  tile: TileData;
  size: number;
  tileSizePct: number;
  gapPct: number;
}

const TileItem: React.FC<TileItemProps> = ({ tile, tileSizePct, gapPct }) => {
  const [imgFailed, setImgFailed] = useState(false);
  const evolution = getEvolutionByLevel(tile.level);
  const left = gapPct + tile.x * (tileSizePct + gapPct);
  const top = gapPct + tile.y * (tileSizePct + gapPct);
  const isSupercarOrAbove = tile.level >= 11;

  let animClass = 'tile-transition';
  if (tile.isMerged) {
    animClass += ' tile-pop z-20';
  } else if (tile.isNew) {
    animClass += ' tile-spawn z-10';
  } else {
    animClass += ' z-10';
  }

  if (isSupercarOrAbove) {
    animClass += ' tile-pulse-glow';
  }

  const rawImage = evolution.image || `${tile.level}.png`;
  const cleanImg = cleanImageFilename(rawImage);
  const customSrc = getCustomImageSync(cleanImg);
  const activeSrc = customSrc || getVehicleImageUrl(cleanImg);

  useEffect(() => {
    setImgFailed(false);
  }, [activeSrc, tile.level]);

  return (
    <div
      id={`tile-${tile.id}`}
      data-level={tile.level}
      data-x={tile.x}
      data-y={tile.y}
      className={`absolute rounded-xl border-2 flex items-center justify-center overflow-hidden bg-gradient-to-br ${evolution.bgGradient} ${evolution.borderColor} ${animClass} tile-clean-image p-0`}
      style={
        {
          position: 'absolute',
          left: `${left}%`,
          top: `${top}%`,
          width: `${tileSizePct}%`,
          height: `${tileSizePct}%`,
          boxSizing: 'border-box',
          boxShadow: isSupercarOrAbove
            ? undefined
            : `0 8px 24px rgba(0,0,0,0.6), 0 0 16px ${evolution.glowColor}, inset 0 0 14px rgba(255,255,255,0.12), inset 0 1px 1px rgba(255,255,255,0.4)`,
          '--tile-glow': evolution.glowColor,
          '--tile-glow-soft': evolution.glowColorSoft || 'rgba(56, 189, 248, 0.3)',
          '--tile-border': evolution.accentColor,
        } as React.CSSProperties
      }
    >
      {!imgFailed && activeSrc ? (
        <img
          src={activeSrc}
          alt={evolution.name}
          className="w-full h-full object-cover block select-none pointer-events-none transition-transform duration-200"
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
        <div className="w-full h-full flex items-center justify-center pointer-events-none p-1.5 relative z-10 bg-black/40">
          <EvolutionIcon
            level={tile.level}
            className="w-full h-full max-w-[85%] max-h-[85%] object-contain drop-shadow-[0_0_12px_var(--tile-glow)]"
          />
        </div>
      )}
    </div>
  );
};

export const GameBoard: React.FC<GameBoardProps> = ({
  size,
  tiles,
  isExpandedRecently,
}) => {
  const [, setCustomImageVersion] = useState(0);

  useEffect(() => {
    initCustomImages().then(() => setCustomImageVersion((v) => v + 1));
    return onCustomImagesChange(() => setCustomImageVersion((v) => v + 1));
  }, []);
  // Balanced geometric gap calculation
  const gapPct = size >= 6 ? 1.5 : size >= 5 ? 2 : 2.5;
  const remPct = 100 - (size + 1) * gapPct;
  const tileSizePct = remPct / size;

  // Background empty slots
  const emptySlots = [];
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const left = gapPct + c * (tileSizePct + gapPct);
      const top = gapPct + r * (tileSizePct + gapPct);
      emptySlots.push({ r, c, left, top });
    }
  }

  // Filtrado estricto de seguridad geométrica: Únicamente renderizar fichas dentro de los límites válidos del tablero
  const validTiles = tiles.filter(
    (tile) =>
      typeof tile.x === 'number' &&
      typeof tile.y === 'number' &&
      tile.x >= 0 &&
      tile.x < size &&
      tile.y >= 0 &&
      tile.y < size
  );

  return (
    <div
      id="game-board-wrapper"
      className="w-full max-w-[500px] aspect-square relative mx-auto select-none touch-none"
    >
      {/* Geometric Balance Container Surface */}
      <div
        id="game-board-container"
        className={`w-full h-full rounded-xl bg-[var(--bg-surface)] border border-white/[0.08] p-2.5 sm:p-3 relative shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden transition-all duration-300 ${
          isExpandedRecently ? 'board-expanded border-[var(--accent)] ring-2 ring-[var(--accent)]/30' : ''
        }`}
      >
        {/* Background Empty Cells and Active Tiles */}
        <div className="w-full h-full relative overflow-hidden rounded-lg">
          {emptySlots.map((slot) => (
            <div
              key={`slot-${slot.r}-${slot.c}`}
              id={`empty-slot-${slot.r}-${slot.c}`}
              className="absolute rounded-lg bg-white/[0.05] border border-white/[0.04] transition-all duration-200"
              style={{
                position: 'absolute',
                left: `${slot.left}%`,
                top: `${slot.top}%`,
                width: `${tileSizePct}%`,
                height: `${tileSizePct}%`,
                boxSizing: 'border-box',
              }}
            />
          ))}

          {/* Active Sliding & Merging Tiles (100% LIMPIEZA VISUAL: ESTILO CYBERPUNK / PREMIUM) */}
          {validTiles.map((tile) => (
            <TileItem
              key={tile.id}
              tile={tile}
              size={size}
              tileSizePct={tileSizePct}
              gapPct={gapPct}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
