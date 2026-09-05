import React, { useState } from 'react';
import { Sparkles, Rocket, ChevronDown, Trophy, Zap, X, ShieldAlert, Cpu, Flame } from 'lucide-react';
import { EVOLUTION_LEVELS } from '../constants/evolutions';

interface DevCheatMenuProps {
  onSpawnRockets: () => void;
  onSpawnBatimovil16: () => void;
  onSpawnAutoVolador17: () => void;
  onInjectTile?: (level: number) => void;
  onTriggerLevelCelebration: (level: number) => void;
  onOpenLeaderboard: () => void;
  currentHighestLevel: number;
}

export const DevCheatMenu: React.FC<DevCheatMenuProps> = ({
  onSpawnRockets,
  onSpawnBatimovil16,
  onSpawnAutoVolador17,
  onInjectTile,
  onTriggerLevelCelebration,
  onOpenLeaderboard,
  currentHighestLevel,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLevelSelectorOpen, setIsLevelSelectorOpen] = useState<boolean>(false);

  // Determinar estado actual de la regla de spawn dinámico
  const spawnTierInfo = (() => {
    if (currentHighestLevel >= 11) {
      return {
        name: 'Tier 3: Extremo (Nvl 11+)',
        desc: '50% Nvl 1-2 • 30% Nvl 3-4 • 20% Nvl 5-6',
        color: 'text-amber-300 border-amber-500/40 bg-amber-500/10',
      };
    }
    if (currentHighestLevel >= 8) {
      return {
        name: 'Tier 2: Avanzado (Nvl 8-10)',
        desc: '70% Nvl 1-2 • 30% Nvl 3-4 (Volante/Chasis)',
        color: 'text-sky-300 border-sky-500/40 bg-sky-500/10',
      };
    }
    return {
      name: 'Tier 1: Clásico (< Nvl 7/8)',
      desc: '90% Nivel 1 • 10% Nivel 2',
      color: 'text-emerald-300 border-emerald-500/40 bg-emerald-500/10',
    };
  })();

  return (
    <div className="fixed top-3 right-3 z-40 flex flex-col items-end">
      {/* Botón flotante discreto de apertura/cierre */}
      {!isOpen ? (
        <button
          id="btn-open-dev-menu"
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-black/75 hover:bg-black/90 border border-amber-400/40 text-amber-300 shadow-lg backdrop-blur-md transition-all active:scale-95 cursor-pointer text-xs font-theme-mono font-bold"
          title="Panel de Pruebas y Trucos (Cheat Menu)"
        >
          <Zap className="w-3.5 h-3.5 text-amber-400 group-hover:animate-bounce" />
          <span className="text-[11px] tracking-wider uppercase">DEV CHEAT</span>
        </button>
      ) : (
        <div
          id="dev-cheat-panel"
          className="w-76 bg-zinc-950/95 border border-amber-500/40 rounded-2xl shadow-2xl backdrop-blur-xl p-3.5 text-white animate-in fade-in slide-in-from-top-2 duration-150"
        >
          {/* Header del Panel */}
          <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-2.5">
            <div className="flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-black uppercase tracking-wider text-amber-300">
                Panel de Desarrollo
              </span>
            </div>
            <button
              id="btn-close-dev-menu"
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Monitor de Spawn Dinámico Activo */}
          <div className={`p-2 rounded-xl border text-[10px] mb-3 ${spawnTierInfo.color}`}>
            <div className="flex items-center gap-1 font-bold font-theme-mono uppercase">
              <Cpu className="w-3 h-3" />
              <span>Spawn Activo: {spawnTierInfo.name}</span>
            </div>
            <p className="mt-0.5 text-[10px] opacity-90 leading-tight">
              {spawnTierInfo.desc}
            </p>
          </div>

          <div className="space-y-2">
            {/* Botón A: Inyección de Batimóviles (Nivel 16) -> Fusión a Nivel 17 */}
            <button
              id="btn-spawn-batimovil-nvl16"
              onClick={() => onSpawnBatimovil16()}
              className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-purple-700 via-fuchsia-600 to-indigo-600 hover:brightness-110 text-white font-black text-xs uppercase tracking-wider shadow-md transition active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer border border-purple-400/40"
            >
              <Flame className="w-4 h-4 fill-white text-purple-200" />
              <span>Generar Batimóviles (Nvl 16)</span>
            </button>

            {/* Botón B: Inyección de Autos Voladores (Nivel 17) -> Fusión a Nivel 18 (Modo Infinito) */}
            <button
              id="btn-spawn-voladores-nvl17"
              onClick={() => onSpawnAutoVolador17()}
              className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-cyan-600 via-sky-500 to-blue-600 hover:brightness-110 text-black font-black text-xs uppercase tracking-wider shadow-md transition active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer border border-sky-300/40"
            >
              <Zap className="w-4 h-4 fill-black text-black" />
              <span>Generar Autos Voladores (Nvl 17)</span>
            </button>

            {/* Botón C: Inyección de Cohetes (Nivel 14) -> Fusión a Nivel 15 */}
            <button
              id="btn-spawn-rockets-nvl14"
              onClick={() => onSpawnRockets()}
              className="w-full py-1.5 px-3 rounded-xl bg-gradient-to-r from-rose-600/80 via-amber-600/80 to-yellow-600/80 hover:brightness-110 text-white font-bold text-[11px] uppercase tracking-wider shadow-sm transition active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer border border-white/10"
            >
              <Rocket className="w-3.5 h-3.5 fill-white" />
              <span>Generar Cohetes (Nvl 14)</span>
            </button>

            {/* Inyección rápida para probar Spawn Dinámico y fichas altas */}
            {onInjectTile && (
              <div className="grid grid-cols-4 gap-1">
                <button
                  id="btn-inject-v8"
                  onClick={() => onInjectTile(8)}
                  className="py-1 px-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-sky-300 text-[10px] font-bold text-center transition cursor-pointer"
                  title="Inyectar Motor V8 (Nvl 8)"
                >
                  + Nvl 8
                </button>
                <button
                  id="btn-inject-supercar"
                  onClick={() => onInjectTile(11)}
                  className="py-1 px-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-amber-300 text-[10px] font-bold text-center transition cursor-pointer"
                  title="Inyectar Superdeportivo (Nvl 11)"
                >
                  + Nvl 11
                </button>
                <button
                  id="btn-inject-batimovil"
                  onClick={() => onInjectTile(16)}
                  className="py-1 px-1 rounded-lg bg-white/5 hover:bg-white/10 border border-purple-500/30 text-purple-300 text-[10px] font-bold text-center transition cursor-pointer"
                  title="Inyectar Batimóvil (Nvl 16)"
                >
                  + Nvl 16
                </button>
                <button
                  id="btn-inject-volador"
                  onClick={() => onInjectTile(17)}
                  className="py-1 px-1 rounded-lg bg-white/5 hover:bg-white/10 border border-cyan-500/30 text-cyan-300 text-[10px] font-bold text-center transition cursor-pointer"
                  title="Inyectar Auto Volador (Nvl 17)"
                >
                  + Nvl 17
                </button>
              </div>
            )}

            {/* Selector Desplegable: Desbloquear Nivel (1 al 18) */}
            <div className="relative">
              <button
                id="btn-toggle-level-picker"
                onClick={() => setIsLevelSelectorOpen((prev) => !prev)}
                className="w-full py-2 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-850 border border-white/15 text-zinc-200 text-xs font-bold flex items-center justify-between transition cursor-pointer"
              >
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Desbloquear Nivel...</span>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isLevelSelectorOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Lista de niveles 1 al 15 */}
              {isLevelSelectorOpen && (
                <div
                  id="dev-levels-dropdown"
                  className="mt-1.5 max-h-56 overflow-y-auto rounded-xl bg-black/95 border border-amber-500/30 p-1.5 shadow-2xl space-y-1"
                >
                  {EVOLUTION_LEVELS.map((evo) => (
                    <button
                      key={evo.level}
                      id={`btn-dev-level-${evo.level}`}
                      onClick={() => {
                        onTriggerLevelCelebration(evo.level);
                        setIsLevelSelectorOpen(false);
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-amber-500/20 hover:border-amber-400/40 border border-transparent flex items-center justify-between text-xs transition group cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-md bg-zinc-800 text-amber-300 font-mono font-bold flex items-center justify-center text-[10px] border border-white/10">
                          {evo.level}
                        </span>
                        <span className="font-semibold text-zinc-200 group-hover:text-amber-200 truncate max-w-[130px]">
                          {evo.name}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-zinc-400">
                        {evo.milestone ? `Hito ${evo.milestone}` : `${evo.hpPoints} HP`}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Botón 3: Ver Clasificación con Puesto #1 */}
            <button
              id="btn-dev-open-leaderboard"
              onClick={onOpenLeaderboard}
              className="w-full py-1.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 text-xs font-medium flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>Ver Clasificación Global (#1)</span>
            </button>
          </div>

          <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-theme-mono text-zinc-500">
            <span>Máximo Nivel: {currentHighestLevel}</span>
            <span className="text-amber-400/80">Modo Test Activo</span>
          </div>
        </div>
      )}
    </div>
  );
};
