import { TileData, Direction } from '../types/game';

let tileCounter = 0;
export function generateTileId(): string {
  tileCounter += 1;
  return `tile-${Date.now()}-${tileCounter}-${Math.random().toString(36).substring(2, 7)}`;
}

export type YouTubeAdTriggerType = 'gameover' | 'milestone' | 'expansion';

export interface YouTubeAdTriggerDetail {
  type: YouTubeAdTriggerType;
  level?: number;
  milestoneValue?: number;
  title?: string;
  description?: string;
  newSize?: number;
  score?: number;
  timestamp: number;
}

/**
 * Hook para la plataforma YouTube Playables.
 * Se detona automáticamente en dos situaciones clave:
 *  A) En Game Over (Lógica de salvación de cochera)
 *  B) Al alcanzar un Hito Histórico (2048, 4096, 8192, 16384, 32768, 65536)
 *  y al expandirse el tablero.
 */
export function ejecutarAnuncioYouTube(
  targetOrDetail?: YouTubeAdTriggerDetail | number | string,
  legacyLevel?: number
) {
  let detail: YouTubeAdTriggerDetail;
  if (!targetOrDetail) {
    detail = {
      type: 'milestone',
      title: 'YouTube Playables • Anuncio Obligatorio (3s)',
      timestamp: Date.now(),
    };
  } else if (typeof targetOrDetail === 'object' && targetOrDetail !== null) {
    detail = targetOrDetail as YouTubeAdTriggerDetail;
  } else if (typeof targetOrDetail === 'number') {
    detail = {
      type: 'expansion',
      newSize: targetOrDetail,
      level: legacyLevel || 10,
      title: `¡Tablero Expandido a ${targetOrDetail}x${targetOrDetail}!`,
      timestamp: Date.now(),
    };
  } else {
    detail = {
      type: 'gameover',
      title: String(targetOrDetail),
      level: legacyLevel || 1,
      timestamp: Date.now(),
    };
  }

  console.log(`[YouTube Playables Hook] ejecutarAnuncioYouTube() detonado:`, detail);

  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('youtube-ad-triggered', {
        detail,
      })
    );
  }

  const ytgame = (window as unknown as { ytgame?: { ads?: { requestInterstitialAd?: () => Promise<void> } } }).ytgame;
  if (ytgame?.ads?.requestInterstitialAd) {
    try {
      ytgame.ads.requestInterstitialAd().catch((err: unknown) => {
        console.warn('YouTube Playables Ad request error:', err);
      });
    } catch {
      // Sandbox fallback
    }
  }
}

// Registro global de ejecutarAnuncioYouTube en window
if (typeof window !== 'undefined') {
  (window as unknown as { ejecutarAnuncioYouTube: typeof ejecutarAnuncioYouTube }).ejecutarAnuncioYouTube = ejecutarAnuncioYouTube;
}

/**
 * Hook para YouTube Playables Anuncio de Recompensa (Revivir / Limpiar Cochera)
 */
export function ejecutarAnuncioRecompensa(): Promise<boolean> {
  console.log('[YouTube Playables Hook] ejecutarAnuncioRecompensa() invocado para revivir partida');

  window.dispatchEvent(
    new CustomEvent('youtube-rewarded-ad-started', {
      detail: { timestamp: Date.now() },
    })
  );

  return new Promise((resolve) => {
    const ytgame = (window as unknown as { ytgame?: { ads?: { requestRewardedAd?: () => Promise<void> } } }).ytgame;
    if (ytgame?.ads?.requestRewardedAd) {
      ytgame.ads
        .requestRewardedAd()
        .then(() => {
          console.log('[YouTube Playables Hook] Recompensa concedida por anuncio completado');
          resolve(true);
        })
        .catch((err: unknown) => {
          console.warn('[YouTube Playables Hook] Error en anuncio de recompensa:', err);
          resolve(true);
        });
    } else {
      resolve(true);
    }
  });
}

/**
 * REGLAS ESTRICTAS DE CONFIGURACIÓN Y EXPANSIÓN EXTREMA:
 * - El juego DEBE iniciar estrictamente en 4x4 y mantenerse en 4x4 durante toda la progresión clásica
 *   de 2048 (desde Nivel 1 Tuerca hasta Nivel 9 Hipercoche).
 * - Llegar al Nivel 9 (Hipercoche) NO expande el tablero.
 * - El tablero SOLO se expandirá a 5x5 en el momento extremo en que el jugador logre fusionar
 *   DOS fichas de Nivel 9 para descubrir la ficha secreta de Nivel 10 (Vehículo Conceptual del Futuro).
 */
export function getRequiredGridSize(maxLevel: number): number {
  if (maxLevel >= 12) return 5;
  return 4;
}

/**
 * Elimina del tablero de forma aleatoria las 4 o 5 fichas de menor nivel que estén estorbando,
 * permitiendo al jugador continuar su racha infinita de salvación tras ver el anuncio.
 */
export function removeLowestTilesRandomly(
  tiles: TileData[],
  requestedCount: number = 4
): { remainingTiles: TileData[]; removedTilesCount: number; removedLevels: number[] } {
  if (tiles.length === 0) {
    return { remainingTiles: [], removedTilesCount: 0, removedLevels: [] };
  }

  // Agrupar fichas por nivel ordenado ascendente (las menores primero)
  const uniqueLevels = Array.from(new Set(tiles.map((t) => t.level))).sort((a, b) => a - b);
  const candidates: TileData[] = [];

  for (const lvl of uniqueLevels) {
    const atThisLevel = tiles.filter((t) => t.level === lvl);
    // Mezclar aleatoriamente las fichas del mismo nivel menor
    const shuffled = [...atThisLevel].sort(() => Math.random() - 0.5);
    candidates.push(...shuffled);
    if (candidates.length >= requestedCount + 2) break;
  }

  const maxRemovable = Math.max(1, tiles.length - 1);
  const actualCount = Math.min(requestedCount, maxRemovable);
  const toRemove = candidates.slice(0, actualCount);
  const toRemoveIds = new Set(toRemove.map((t) => t.id));

  const remainingTiles = tiles.filter((t) => !toRemoveIds.has(t.id));
  return {
    remainingTiles,
    removedTilesCount: toRemove.length,
    removedLevels: toRemove.map((t) => t.level),
  };
}

/**
 * Elimina del tablero EXACTAMENTE las 4 fichas que tengan el nivel más bajo en ese momento,
 * liberando espacio para que el usuario continúe su racha sin reiniciar.
 */
export function removeLowestTiles(
  tiles: TileData[],
  count: number = 4
): { remainingTiles: TileData[]; removedTilesCount: number } {
  if (tiles.length === 0) {
    return { remainingTiles: [], removedTilesCount: 0 };
  }

  // Ordenar fichas por nivel ascendente (las de menor nivel primero)
  const sorted = [...tiles].sort((a, b) => a.level - b.level);
  const toRemove = sorted.slice(0, Math.min(count, Math.max(1, tiles.length - 1)));
  const toRemoveIds = new Set(toRemove.map((t) => t.id));

  const remainingTiles = tiles.filter((t) => !toRemoveIds.has(t.id));
  return {
    remainingTiles,
    removedTilesCount: toRemove.length,
  };
}

/**
 * Encuentra todas las celdas vacías en una cuadrícula de tamaño `size`.
 */
export function getEmptyCells(tiles: TileData[], size: number): { x: number; y: number }[] {
  const occupied = new Set<string>();
  for (const t of tiles) {
    if (typeof t.x === 'number' && typeof t.y === 'number' && t.x >= 0 && t.x < size && t.y >= 0 && t.y < size) {
      occupied.add(`${t.x},${t.y}`);
    }
  }

  const empty: { x: number; y: number }[] = [];
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (!occupied.has(`${x},${y}`)) {
        empty.push({ x, y });
      }
    }
  }
  return empty;
}

/**
 * ALGORITMO DE SPAWN DINÁMICO DE PIEZAS (Mecánica Avanzada de Viabilidad):
 * 1. Si la ficha más alta en el tablero es menor al Nivel 7 (o menor al Nivel 8):
 *    - 90% Nivel 1 (Tuerca)
 *    - 10% Nivel 2 (Engranaje)
 * 2. Si la ficha más alta en el tablero alcanza el Nivel 8 (Motor V8) o Nivel 9 (Muscle Car / Alerón):
 *    - 70% probabilidad de generar Nivel 1 o 2 (básicas)
 *    - 30% probabilidad de arrojar directamente Nivel 3 (Volante) o Nivel 4 (Chasis)
 * 3. Si el jugador desbloquea el Nivel 11 (Superdeportivo / 2048) o superior:
 *    - 50% piezas básicas (Nivel 1 o 2)
 *    - 30% piezas medianas (Nivel 3 o 4)
 *    - 20% probabilidad de que aparezca directamente Nivel 5 (Auto Clásico 20s) o Nivel 6 (Estructura 50s)
 */
export function determineDynamicSpawnLevel(highestLevelOnBoard: number): number {
  const roll = Math.random();

  // Regla 3: Si la ficha más alta en el tablero alcanza Nivel 11 (Superdeportivo / 2048) o superior
  if (highestLevelOnBoard >= 11) {
    if (roll < 0.50) {
      // 50% para piezas básicas (Nivel 1 o 2)
      return Math.random() < 0.85 ? 1 : 2;
    } else if (roll < 0.80) {
      // 30% para piezas medianas (Nivel 3 o 4)
      return Math.random() < 0.65 ? 3 : 4;
    } else {
      // 20% de probabilidad de que aparezca directamente Nivel 5 (Auto Clásico 20s) o Nivel 6 (Estructura 50s)
      return Math.random() < 0.65 ? 5 : 6;
    }
  }

  // Regla 2: Si la ficha más alta en el tablero alcanza el Nivel 8 (Motor V8) o Nivel 9 (Muscle Car)
  if (highestLevelOnBoard >= 8) {
    if (roll < 0.70) {
      // 70% de probabilidad de generar Nivel 1 o 2
      return Math.random() < 0.85 ? 1 : 2;
    } else {
      // 30% de probabilidad de arrojar directamente Nivel 3 (Volante) o Nivel 4 (Chasis)
      return Math.random() < 0.65 ? 3 : 4;
    }
  }

  // Regla 1: Si la ficha más alta en el tablero es menor al Nivel 7 / 8
  // El juego solo genera piezas de Nivel 1 (90%) o Nivel 2 (10%)
  return roll < 0.90 ? 1 : 2;
}

export function createRandomTile(
  tiles: TileData[],
  size: number,
  forcedHighestLevel?: number
): TileData | null {
  const validTiles = tiles.filter(
    (t) => typeof t.x === 'number' && typeof t.y === 'number' && t.x >= 0 && t.x < size && t.y >= 0 && t.y < size
  );
  const empty = getEmptyCells(validTiles, size);
  if (empty.length === 0) return null;

  const randCell = empty[Math.floor(Math.random() * empty.length)];
  const highestOnBoard =
    forcedHighestLevel ??
    (validTiles.length > 0 ? Math.max(...validTiles.map((t) => t.level), 1) : 1);

  const level = determineDynamicSpawnLevel(highestOnBoard);

  return {
    id: generateTileId(),
    x: Math.min(Math.max(0, randCell.x), size - 1),
    y: Math.min(Math.max(0, randCell.y), size - 1),
    level,
    isNew: true,
    isMerged: false,
  };
}

export interface PlannedMove {
  tilesBeforeSlide: (TileData & { targetX: number; targetY: number })[];
  finalTilesAfterMerge: TileData[];
  scoreGained: number;
  maxLevelCreated: number;
  hasMoved: boolean;
}

/**
 * Calcula la trayectoria de deslizamiento y las fusiones matemáticas.
 */
export function calculateMove(tiles: TileData[], size: number, direction: Direction): PlannedMove {
  const grid: (TileData | null)[][] = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => null)
  );

  for (const t of tiles) {
    if (typeof t.x === 'number' && typeof t.y === 'number' && t.x >= 0 && t.x < size && t.y >= 0 && t.y < size) {
      grid[t.y][t.x] = { ...t };
    }
  }

  let hasMoved = false;
  let scoreGained = 0;
  let maxLevelCreated = 0;

  const slidingTiles: (TileData & { targetX: number; targetY: number })[] = [];
  const mergedResultTiles: TileData[] = [];

  const isHorizontal = direction === 'LEFT' || direction === 'RIGHT';
  const isPositive = direction === 'RIGHT' || direction === 'DOWN';

  for (let line = 0; line < size; line++) {
    const lineTiles: { tile: TileData; origIdx: number }[] = [];
    for (let i = 0; i < size; i++) {
      const idx = isPositive ? size - 1 - i : i;
      const t = isHorizontal ? grid[line][idx] : grid[idx][line];
      if (t) {
        lineTiles.push({ tile: t, origIdx: idx });
      }
    }

    if (lineTiles.length === 0) continue;

    let targetIdx = isPositive ? size - 1 : 0;
    const step = isPositive ? -1 : 1;

    let i = 0;
    while (i < lineTiles.length) {
      const current = lineTiles[i];
      const next = i + 1 < lineTiles.length ? lineTiles[i + 1] : null;

      if (next && current.tile.level === next.tile.level) {
        const newLevel = current.tile.level + 1;
        scoreGained += Math.pow(2, newLevel);
        if (newLevel > maxLevelCreated) {
          maxLevelCreated = newLevel;
        }

        const rawTargetX = isHorizontal ? targetIdx : line;
        const rawTargetY = isHorizontal ? line : targetIdx;
        const targetX = Math.min(Math.max(0, rawTargetX), size - 1);
        const targetY = Math.min(Math.max(0, rawTargetY), size - 1);

        slidingTiles.push({
          ...current.tile,
          targetX,
          targetY,
        });
        slidingTiles.push({
          ...next.tile,
          targetX,
          targetY,
        });

        hasMoved = true;

        mergedResultTiles.push({
          id: generateTileId(),
          x: targetX,
          y: targetY,
          level: newLevel,
          isNew: false,
          isMerged: true,
        });

        targetIdx += step;
        i += 2;
      } else {
        const rawTargetX = isHorizontal ? targetIdx : line;
        const rawTargetY = isHorizontal ? line : targetIdx;
        const targetX = Math.min(Math.max(0, rawTargetX), size - 1);
        const targetY = Math.min(Math.max(0, rawTargetY), size - 1);

        slidingTiles.push({
          ...current.tile,
          targetX,
          targetY,
        });

        if (current.tile.x !== targetX || current.tile.y !== targetY) {
          hasMoved = true;
        }

        mergedResultTiles.push({
          id: current.tile.id,
          x: targetX,
          y: targetY,
          level: current.tile.level,
          isNew: false,
          isMerged: false,
        });

        targetIdx += step;
        i += 1;
      }
    }
  }

  return {
    tilesBeforeSlide: slidingTiles,
    finalTilesAfterMerge: mergedResultTiles,
    scoreGained,
    maxLevelCreated,
    hasMoved,
  };
}

/**
 * Comprueba si el jugador aún tiene movimientos válidos en el tablero.
 */
export function checkHasAvailableMoves(tiles: TileData[], size: number): boolean {
  if (tiles.length < size * size) {
    return true;
  }

  const grid: (number | null)[][] = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => null)
  );

  for (const t of tiles) {
    if (t.x >= 0 && t.x < size && t.y >= 0 && t.y < size) {
      grid[t.y][t.x] = t.level;
    }
  }

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const val = grid[y][x];
      if (val === null) return true;

      if (x + 1 < size && grid[y][x + 1] === val) return true;
      if (y + 1 < size && grid[y + 1][x] === val) return true;
    }
  }

  return false;
}
