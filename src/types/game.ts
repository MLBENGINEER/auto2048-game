export interface EvolutionLevel {
  level: number;
  name: string;
  shortName: string;
  era: string;
  yearRange: string;
  description: string;
  image?: string;
  bgGradient: string;
  borderColor: string;
  textColor: string;
  accentColor: string;
  glowColor: string;
  glowColorSoft?: string;
  hpPoints: number; // Score multiplier
  milestone?: number;
}

export interface TileData {
  id: string;
  x: number;
  y: number;
  level: number;
  isNew?: boolean;
  isMerged?: boolean;
  slideFrom?: { x: number; y: number } | null;
}

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export interface MoveStep {
  tileId: string;
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  mergeWithId?: string;
}

export interface MoveResult {
  hasMoved: boolean;
  scoreGained: number;
  mergedLevels: number[];
  maxLevelCreated: number;
}
