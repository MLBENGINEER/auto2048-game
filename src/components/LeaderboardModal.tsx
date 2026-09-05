import React from 'react';
import { X, Trophy, Globe, Flame, Award, ChevronUp } from 'lucide-react';
import { getEvolutionByLevel } from '../constants/evolutions';

export interface LeaderboardEntry {
  rank: number;
  name: string;
  country: string;
  flag: string;
  score: number;
  maxLevel: number;
  isUser?: boolean;
}

export const BASE_TOP_10_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, name: 'ApexTurbo_99', country: 'Alemania', flag: '🇩🇪', score: 489200, maxLevel: 9 },
  { rank: 2, name: 'CyberRacer_JP', country: 'Japón', flag: '🇯🇵', score: 412500, maxLevel: 9 },
  { rank: 3, name: 'V8_Thunder', country: 'EE.UU.', flag: '🇺🇸', score: 345800, maxLevel: 8 },
  { rank: 4, name: 'ScuderiaPro', country: 'Italia', flag: '🇮🇹', score: 278900, maxLevel: 8 },
  { rank: 5, name: 'NitroDrifter', country: 'México', flag: '🇲🇽', score: 215400, maxLevel: 7 },
  { rank: 6, name: 'SilverstoneAce', country: 'Reino Unido', flag: '🇬🇧', score: 168300, maxLevel: 7 },
  { rank: 7, name: 'SpeedPhantom', country: 'Francia', flag: '🇫🇷', score: 124600, maxLevel: 7 },
  { rank: 8, name: 'TorqueQueen', country: 'España', flag: '🇪🇸', score: 89400, maxLevel: 6 },
  { rank: 9, name: 'PaddockHero', country: 'Brasil', flag: '🇧🇷', score: 67200, maxLevel: 6 },
  { rank: 10, name: 'GearShift_94', country: 'Canadá', flag: '🇨🇦', score: 51800, maxLevel: 5 },
];

/**
 * Fórmula matemática dinámica e inversa de posición global:
 * - 0 puntos: puesto #3,542,119
 * - 15,000 puntos: puesto #142,305
 * - Al superar 51,800 puntos: ingresa al Top 10 mundial
 */
export function calculateGlobalRank(score: number): number {
  if (score <= 0) return 3542119;

  // Posiciones dentro del Top 10:
  if (score >= 489200) return 1;
  if (score >= 412500) return 2;
  if (score >= 345800) return 3;
  if (score >= 278900) return 4;
  if (score >= 215400) return 5;
  if (score >= 168300) return 6;
  if (score >= 124600) return 7;
  if (score >= 89400) return 8;
  if (score >= 67200) return 9;
  if (score >= 51800) return 10;

  // Entre puesto 11 y 100 (entre 40,000 y 51,800 pts):
  if (score >= 40000) {
    const frac = (score - 40000) / (51800 - 40000);
    return Math.round(100 - frac * 89);
  }

  const baseRank = 3542119;
  const targetAt15k = 142305;

  // Curva inversa suave decreciente:
  if (score <= 15000) {
    const t = score / 15000;
    return Math.round(targetAt15k + (baseRank - targetAt15k) * Math.pow(1 - t, 2.2));
  } else {
    const t = (score - 15000) / (40000 - 15000);
    return Math.round(101 + (targetAt15k - 101) * Math.pow(1 - t, 2.4));
  }
}

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentScore: number;
  bestScore: number;
  highestLevelUnlocked: number;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  isOpen,
  onClose,
  currentScore,
  bestScore,
  highestLevelUnlocked,
}) => {
  if (!isOpen) return null;

  const isGodOfEngineering = highestLevelUnlocked >= 15;
  const currentRank = isGodOfEngineering ? 1 : calculateGlobalRank(currentScore);
  const effectiveMaxScore = isGodOfEngineering ? Math.max(currentScore, bestScore, 500000) : Math.max(currentScore, bestScore);
  const bestRank = isGodOfEngineering ? 1 : calculateGlobalRank(effectiveMaxScore);
  const highestEvolution = getEvolutionByLevel(highestLevelUnlocked);

  // Armar el Top 10 con la inclusión del usuario si supera al puesto 10 (score >= 51,800) o si es Dios de la Ingeniería
  const maxScore = effectiveMaxScore;
  let leaderboardList: LeaderboardEntry[] = [...BASE_TOP_10_LEADERBOARD];

  if (maxScore >= 51800 || isGodOfEngineering) {
    const userEntry: LeaderboardEntry = {
      rank: isGodOfEngineering ? 1 : bestRank,
      name: isGodOfEngineering ? 'Tú (Dios de la Ingeniería)' : 'Tú (Récord Personal)',
      country: isGodOfEngineering ? 'Singularidad Cósmica' : 'Tu Cochera',
      flag: isGodOfEngineering ? '👑' : '⭐',
      score: maxScore,
      maxLevel: highestLevelUnlocked,
      isUser: true,
    };

    // Insertar y reordenar
    leaderboardList = [...BASE_TOP_10_LEADERBOARD, userEntry]
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
      .map((item, idx) => ({ ...item, rank: idx + 1 }));
  }

  return (
    <div
      id="leaderboard-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-in fade-in duration-150"
    >
      <div
        id="leaderboard-modal-container"
        className="w-full max-w-xl max-h-[90vh] bg-[var(--bg-surface)] border border-white/10 rounded-xl shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-white/10 bg-[var(--bg-deep)]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[var(--accent)]/15 border border-[var(--accent)]/30 flex items-center justify-center text-[var(--accent)]">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-white uppercase tracking-tight">
                Clasificación Global
              </h2>
              <p className="text-xs font-theme-mono text-[var(--text-dim)]">
                Ranking Mundial • 50,000 a 500,000 Pts
              </p>
            </div>
          </div>

          <button
            id="btn-close-leaderboard"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--text-dim)] hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dynamic Inverse Ranking Display Card */}
        <div className="p-4 bg-gradient-to-r from-amber-500/10 via-black/30 to-amber-500/5 border-b border-white/10">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <div className="text-[10px] uppercase font-bold text-[var(--accent)] tracking-wider flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-500" />
                <span>Tu Posición Global en Vivo</span>
              </div>
              <div className="text-xl sm:text-2xl font-extrabold font-theme-mono text-white tracking-tight mt-0.5">
                #{currentRank.toLocaleString()}
              </div>
              <div className="text-[11px] text-[var(--text-dim)]">
                Puntaje actual: <strong className="text-white font-theme-mono">{currentScore.toLocaleString()} pts</strong> • Mejor puesto: <strong className="text-[var(--accent)] font-theme-mono">#{bestRank.toLocaleString()}</strong>
              </div>
            </div>

            <div className="bg-black/40 border border-white/10 px-3 py-1.5 rounded-lg text-right">
              <div className="text-[9px] uppercase text-[var(--text-dim)] font-bold">
                Tu Mayor Hito
              </div>
              <div className="text-xs font-bold text-white uppercase truncate max-w-[140px]">
                {highestEvolution.shortName}
              </div>
            </div>
          </div>
        </div>

        {/* Top 10 Table */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-2">
          <div className="text-xs font-extrabold uppercase tracking-wider text-[var(--text-dim)] flex items-center justify-between px-2 mb-2">
            <span>Top 10 Mundial</span>
            <span>Puntos / Nivel</span>
          </div>

          {leaderboardList.map((player) => {
            const isUser = player.isUser;
            const isTop3 = player.rank <= 3;
            const evo = getEvolutionByLevel(player.maxLevel);

            return (
              <div
                key={`${player.rank}-${player.name}`}
                id={`leaderboard-row-${player.rank}`}
                className={`flex items-center justify-between p-2.5 rounded-lg border transition ${
                  isUser
                    ? 'bg-amber-500/20 border-amber-400 ring-1 ring-amber-400/50 shadow-md'
                    : isTop3
                    ? 'bg-amber-500/5 border-amber-500/30 shadow-sm'
                    : 'bg-black/20 border-white/5'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Rank Badge */}
                  <div
                    className={`w-7 h-7 rounded-md font-theme-mono font-extrabold text-xs flex items-center justify-center shrink-0 ${
                      player.rank === 1
                        ? 'bg-amber-400 text-black shadow-md'
                        : player.rank === 2
                        ? 'bg-zinc-300 text-black'
                        : player.rank === 3
                        ? 'bg-amber-700 text-white'
                        : isUser
                        ? 'bg-amber-500 text-black font-bold'
                        : 'bg-white/5 text-[var(--text-dim)] border border-white/5'
                    }`}
                  >
                    {player.rank === 1 ? <Trophy className="w-3.5 h-3.5" /> : player.rank}
                  </div>

                  {/* Player Details */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-sm font-bold truncate ${isUser ? 'text-[var(--accent)] font-extrabold' : 'text-white'}`}>
                        {player.name}
                      </span>
                      <span className="text-xs" title={player.country}>
                        {player.flag}
                      </span>
                    </div>
                    <span className="text-[10px] text-[var(--text-dim)] flex items-center gap-1 truncate">
                      <Award className="w-3 h-3 text-[var(--accent)]" />
                      {evo.name}
                    </span>
                  </div>
                </div>

                {/* Score */}
                <div className="text-right shrink-0">
                  <div className={`text-xs sm:text-sm font-extrabold font-theme-mono ${isUser ? 'text-white font-black' : 'text-[var(--accent)]'}`}>
                    {player.score.toLocaleString()}
                  </div>
                  <div className="text-[9px] font-theme-mono text-zinc-500">
                    NIVEL {player.maxLevel}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Hint */}
        <div className="p-3 bg-[var(--bg-deep)] border-t border-white/10 text-center text-[11px] text-[var(--text-dim)] flex items-center justify-center gap-1.5">
          <ChevronUp className="w-3.5 h-3.5 text-emerald-400 animate-bounce" />
          <span>Alcanza más de 51,800 puntos para posicionar tu nombre dentro del Top 10 mundial.</span>
        </div>
      </div>
    </div>
  );
};
