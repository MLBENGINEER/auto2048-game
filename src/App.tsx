import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  RotateCcw,
  Volume2,
  VolumeX,
  BookOpen,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Maximize2,
  Trophy,
  Globe,
  Sparkles,
  Flame,
  Gamepad2,
  CheckCircle2,
} from 'lucide-react';
import { TileData, Direction } from './types/game';
import {
  calculateMove,
  createRandomTile,
  getEmptyCells,
  checkHasAvailableMoves,
  getRequiredGridSize,
  removeLowestTilesRandomly,
} from './game/engine';
import { EVOLUTION_LEVELS, getEvolutionByLevel, MILESTONE_LEVELS } from './constants/evolutions';
import { GameBoard } from './components/GameBoard';
import { CodexModal } from './components/CodexModal';
import { RewardedAdModal } from './components/RewardedAdModal';
import { MilestoneCelebrationModal } from './components/MilestoneCelebrationModal';
import {
  soundManager,
  reproducirSonidoFusionNormal,
  reproducirSonidoHitoLeyenda,
} from './utils/audio';
import { preloadEvolutionImages } from './utils/preloadImages';
import {
  primerFotogramaListo,
  juegoListo,
  enviarPuntuacion,
  guardarDatos,
  cargarDatos,
  anuncioIntersticial,
} from './utils/playables';

// Hitos Clave para Celebración Masiva en Pop-up Gigante (Nivel 11: 2048, 12: 4096, 13: 8192, 14: 16384, 15: 32768, 16: 65536, 17: 131072, 18: 262144 / Modo Infinito)
const CELEBRATION_MILESTONE_LEVELS = [11, 12, 13, 14, 15, 16, 17, 18];

export default function App() {
  // Navigation tabs: 'game' o 'leaderboard'
  // Solo queda la vista de juego: la clasificación la muestra YouTube, no el
  // juego, porque el SDK permite enviar puntuaciones pero no leerlas.
  const [activeTab, setActiveTab] = useState<'game'>('game');

  // Game states
  const [boardSize, setBoardSize] = useState<number>(4); // Estrictamente 4x4 al inicio
  const [tiles, setTiles] = useState<TileData[]>([]);
  const [score, setScore] = useState<number>(0);
  const [bestScore, setBestScore] = useState<number>(() => {
    try {
      return parseInt(localStorage.getItem('auto2048_best') || '0', 10);
    } catch {
      return 0;
    }
  });
  const [highestLevelUnlocked, setHighestLevelUnlocked] = useState<number>(1);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isCodexOpen, setIsCodexOpen] = useState<boolean>(false);
  const [isRewardedAdOpen, setIsRewardedAdOpen] = useState<boolean>(false);
  const [isExpandedRecently, setIsExpandedRecently] = useState<boolean>(false);
  const [salvageNotice, setSalvageNotice] = useState<string | null>(null);
  const [history, setHistory] = useState<{ tiles: TileData[]; score: number; boardSize: number } | null>(null);

  // Estado de Celebración Masiva de Hitos (Pop-up Gigante a pantalla completa)
  const [celebrationLevel, setCelebrationLevel] = useState<number | null>(null);
  const [isCelebrationOpen, setIsCelebrationOpen] = useState<boolean>(false);

  // Hitos alcanzados (2048, 4096, 8192, 16384, 32768, 65536)
  const [reachedMilestones, setReachedMilestones] = useState<number[]>(() => {
    try {
      const raw = localStorage.getItem('auto2048_reached_milestones');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const reachedMilestonesRef = useRef(reachedMilestones);
  reachedMilestonesRef.current = reachedMilestones;

  // YouTube Playables ad simulation state

  // State refs to prevent stale closure in event listeners
  const isMovingRef = useRef(false);
  // Direccion pulsada mientras habia un movimiento en curso. Se guarda solo la
  // ultima: encolarlas todas haria que el tablero siguiera moviendose despues
  // de que el jugador soltara las teclas.
  const pendingMoveRef = useRef<Direction | null>(null);
  // Referencia a la version mas reciente de handleMove, para poder invocarla
  // desde dentro de su propio setTimeout sin capturar una version obsoleta.
  const handleMoveRef = useRef<(direction: Direction) => void>(() => {});
  const tilesRef = useRef(tiles);
  tilesRef.current = tiles;
  const boardSizeRef = useRef(boardSize);
  boardSizeRef.current = boardSize;
  const highestLevelRef = useRef(highestLevelUnlocked);
  highestLevelRef.current = highestLevelUnlocked;
  const isGameOverRef = useRef(isGameOver);
  isGameOverRef.current = isGameOver;

  // Touch coordinates
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const moveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize a fresh game (estrictamente 4x4 con 2 fichas iniciales Nivel 1 o 2)
  const initGame = useCallback(() => {
    if (moveTimeoutRef.current) {
      clearTimeout(moveTimeoutRef.current);
      moveTimeoutRef.current = null;
    }
    isMovingRef.current = false;
    pendingMoveRef.current = null;

    const size = 4;
    setBoardSize(size);
    boardSizeRef.current = size;

    setScore(0);
    setIsGameOver(false);
    isGameOverRef.current = false;
    setIsRewardedAdOpen(false);
    setIsCelebrationOpen(false);
    setCelebrationLevel(null);
    setIsExpandedRecently(false);
    setSalvageNotice(null);
    setHistory(null);

    // Initial 2 tiles: SOLO Nivel 1 (90%) o Nivel 2 (10%) en cuadrícula 4x4
    const initialTiles: TileData[] = [];
    const t1 = createRandomTile(initialTiles, size);
    if (t1) initialTiles.push(t1);
    const t2 = createRandomTile(initialTiles, size);
    if (t2) initialTiles.push(t2);

    tilesRef.current = initialTiles;
    setTiles(initialTiles);
    setHighestLevelUnlocked((prev) => Math.max(prev, 1));
  }, []);

  useEffect(() => {
    initGame();
    return () => {
      if (moveTimeoutRef.current) {
        clearTimeout(moveTimeoutRef.current);
      }
    };
  }, [initGame]);

  // Traer las imagenes de todas las evoluciones antes de que hagan falta, para
  // que una fusion no dispare una descarga en mitad de la animacion.
  useEffect(() => {
    preloadEvolutionImages();
  }, []);

  // Handshake obligatorio con YouTube Playables. Fuera de YouTube no hace nada.
  useEffect(() => {
    primerFotogramaListo();
    juegoListo();
  }, []);

  // El record vive en YouTube cuando el SDK esta disponible, para que siga al
  // jugador entre dispositivos. localStorage queda como respaldo local.
  useEffect(() => {
    let cancelado = false;
    (async () => {
      const guardado = await cargarDatos();
      if (cancelado || !guardado) return;
      try {
        const { best } = JSON.parse(guardado) as { best?: number };
        if (typeof best === 'number' && Number.isFinite(best)) {
          setBestScore((prev) => Math.max(prev, best));
        }
      } catch {
        // dato corrupto: se ignora y manda el respaldo local
      }
    })();
    return () => {
      cancelado = true;
    };
  }, []);

  // El record se guarda en los dos sitios y se publica en la clasificacion de
  // YouTube, que es la unica real: el SDK permite enviar puntuaciones pero no
  // leerlas, asi que el ranking lo muestra YouTube en su propia interfaz.
  useEffect(() => {
    if (score <= bestScore) return;

    setBestScore(score);
    try {
      localStorage.setItem('auto2048_best', score.toString());
    } catch {
      // modo privado o almacenamiento lleno: no es critico
    }
    void guardarDatos(JSON.stringify({ best: score }));
    void enviarPuntuacion(score);
  }, [score, bestScore]);

  // Main Move Handler with Fluid CSS Transition & Logical Delay
  const handleMove = useCallback(
    (direction: Direction) => {
      if (isGameOverRef.current || activeTab !== 'game' || isCelebrationOpen) return;

      // Antes se descartaba la tecla y el movimiento se perdia: al encadenar
      // fusiones rapido se sentia como un tiron. Ahora se guarda y se ejecuta
      // en cuanto termina la animacion en curso.
      if (isMovingRef.current) {
        pendingMoveRef.current = direction;
        return;
      }

      const currentTiles = tilesRef.current;
      const currentSize = boardSizeRef.current;

      const movePlan = calculateMove(currentTiles, currentSize, direction);
      if (!movePlan.hasMoved) return;

      // Save undo snapshot
      setHistory({
        tiles: currentTiles.map((t) => ({ ...t })),
        score,
        boardSize: currentSize,
      });

      // Play slide sound
      soundManager.playSlide();
      if (moveTimeoutRef.current) {
        clearTimeout(moveTimeoutRef.current);
        moveTimeoutRef.current = null;
      }
      isMovingRef.current = true;

      // FASE 1: DESPLAZAMIENTO FLUIDO (0.15s transition)
      const slidingTiles: TileData[] = movePlan.tilesBeforeSlide
        .filter((st) => st.targetX >= 0 && st.targetX < currentSize && st.targetY >= 0 && st.targetY < currentSize)
        .map((st) => ({
          id: st.id,
          x: st.targetX,
          y: st.targetY,
          level: st.level,
          isNew: false,
          isMerged: false,
        }));
      tilesRef.current = slidingTiles;
      setTiles(slidingTiles);

      // FASE 2: RETRASO LÓGICO
      moveTimeoutRef.current = setTimeout(() => {
        moveTimeoutRef.current = null;
        let nextSize = currentSize;
        let newHighestLevel = highestLevelRef.current;

        // Fichas fusionadas
        const postMergeTiles = movePlan.finalTilesAfterMerge.map((t) => ({ ...t }));

        // Comprobar si se descubrió un nuevo nivel superior
        if (movePlan.maxLevelCreated > newHighestLevel) {
          newHighestLevel = movePlan.maxLevelCreated;
          setHighestLevelUnlocked(newHighestLevel);
          highestLevelRef.current = newHighestLevel;

          if (newHighestLevel >= 15) {
            // Asignar de inmediato puntuación de Puesto #1 en la clasificación global
            setScore((prev) => Math.max(prev + 100000, 520000));
          }

          if (newHighestLevel === 4) {
            soundManager.playVintageHorn();
          }

          // CELEBRACIÓN MASIVA DE HITOS CLAVE (Nivel 11: 2048, 12: 4096, 13: 8192, 14: 16384)
          // La primera vez que el jugador descubra estos hitos legendarios:
          const isKeyMilestone = CELEBRATION_MILESTONE_LEVELS.includes(newHighestLevel);
          const isFirstTimeMilestone = isKeyMilestone && !reachedMilestonesRef.current.includes(newHighestLevel);

          if (isFirstTimeMilestone) {
            setReachedMilestones((prev) => {
              const nextList = [...prev, newHighestLevel];
              try {
                localStorage.setItem('auto2048_reached_milestones', JSON.stringify(nextList));
              } catch {
                // ignore
              }
              return nextList;
            });

            // Pausar el juego y congelar el tablero temporalmente
            isMovingRef.current = true;
            setCelebrationLevel(newHighestLevel);
            setIsCelebrationOpen(true);

            // Audio de celebración épica de hito
            reproducirSonidoHitoLeyenda(newHighestLevel);
          } else {
            const milestoneNumber = MILESTONE_LEVELS[newHighestLevel];
            if (milestoneNumber && !reachedMilestonesRef.current.includes(newHighestLevel)) {
              setReachedMilestones((prev) => {
                const nextList = [...prev, newHighestLevel];
                try {
                  localStorage.setItem('auto2048_reached_milestones', JSON.stringify(nextList));
                } catch {
                  // ignore
                }
                return nextList;
              });

              // Anuncio intersticial real de YouTube en la pausa del hito.
              // Lo dibuja YouTube por encima del juego; si no hay inventario
              // para este usuario, la promesa resuelve igual y no pasa nada.
              void anuncioIntersticial();
            }
          }
        }

        // REGLA ESTRICTA DE EXPANSIÓN EXTREMA:
        // El tablero se mantiene en 4x4 durante toda la progresión clásica hasta Nivel 9 (Hipercoche).
        // Se expande a 5x5 ÚNICAMENTE al fusionar dos Nivel 9 para descubrir el Nivel 10 Secreto en el tablero.
        const currentMaxOnBoard = Math.max(...postMergeTiles.map((t) => t.level), 1);
        const reqSize = getRequiredGridSize(currentMaxOnBoard);
        if (reqSize > currentSize) {
          nextSize = reqSize;
          setBoardSize(nextSize);
          boardSizeRef.current = nextSize;
          setIsExpandedRecently(true);
          soundManager.playBoardExpansion();

          // La expansión de tablero es otra pausa natural del juego.
          void anuncioIntersticial();

          setTimeout(() => {
            setIsExpandedRecently(false);
          }, 3000);
        }

        // FEEDBACK DE AUDIO DINÁMICO PARA FUSIONES:
        // Fusiones normales (niveles 1 al 10): reproducirSonidoFusionNormal()
        // Fusiones de hito legendario (Nivel 11 en adelante): reproducirSonidoHitoLeyenda()
        if (movePlan.scoreGained > 0) {
          if (movePlan.maxLevelCreated >= 11) {
            reproducirSonidoHitoLeyenda(movePlan.maxLevelCreated);
          } else {
            reproducirSonidoFusionNormal(movePlan.maxLevelCreated);
          }
        }

        // Sumar puntuación
        setScore((prev) => prev + movePlan.scoreGained);

        // MECÁNICA AVANZADA: Spawn Dinámico de Piezas
        // Se calcula con la ficha más alta en el tablero tras la fusión o el hito alcanzado:
        const currentMaxLevel = Math.max(
          ...postMergeTiles.map((t) => t.level),
          newHighestLevel,
          1
        );
        const newSpawned = createRandomTile(postMergeTiles, nextSize, currentMaxLevel);
        if (newSpawned) {
          postMergeTiles.push(newSpawned);
        }

        // Sanitización geométrica estricta de coordenadas antes de actualizar estado
        const safePostMerge = postMergeTiles.filter(
          (t) => t.x >= 0 && t.x < nextSize && t.y >= 0 && t.y < nextSize
        );

        // Actualizar tablero final y ref sincronizada
        tilesRef.current = safePostMerge;
        setTiles(safePostMerge);

        // Verificar si quedan movimientos disponibles
        if (!checkHasAvailableMoves(safePostMerge, nextSize)) {
          setIsGameOver(true);
          isGameOverRef.current = true;
          soundManager.playGameOver();

          // Aquí no se pide intersticial: la monetización del game over es el
          // anuncio con recompensa para revivir, y encadenar dos seguidos
          // molesta al jugador.
          setIsRewardedAdOpen(true);
        }

        // Solo liberar movimiento si no se abrió el pop-up de celebración
        if (!isCelebrationOpen) {
          isMovingRef.current = false;

          const encolado = pendingMoveRef.current;
          pendingMoveRef.current = null;
          if (encolado && !isGameOverRef.current) {
            handleMoveRef.current(encolado);
          }
        }
      }, 150);
    },
    [score, activeTab, isCelebrationOpen]
  );

  // El setTimeout de handleMove necesita invocar la version vigente de si mismo
  // para poder ejecutar el movimiento encolado.
  useEffect(() => {
    handleMoveRef.current = handleMove;
  }, [handleMove]);

  // Undo last move
  const handleUndo = () => {
    if (!history || isMovingRef.current || isCelebrationOpen) return;
    if (moveTimeoutRef.current) {
      clearTimeout(moveTimeoutRef.current);
      moveTimeoutRef.current = null;
    }
    isMovingRef.current = false;

    tilesRef.current = history.tiles;
    setTiles(history.tiles);
    setScore(history.score);

    boardSizeRef.current = history.boardSize;
    setBoardSize(history.boardSize);

    isGameOverRef.current = false;
    setIsGameOver(false);
    setIsRewardedAdOpen(false);
    setHistory(null);
  };

  // Reanudación tras completar el Anuncio Obligatorio de Hito (3s)
  const handleMilestoneCelebrationCompleted = () => {
    setIsCelebrationOpen(false);
    setCelebrationLevel(null);
    isMovingRef.current = false;
  };

  // Anuncio de salvación infinita completado: elimina de forma aleatoria 4 o 5 fichas de menor nivel
  const handleRewardedAdCompleted = () => {
    setIsRewardedAdOpen(false);

    // Elimina de forma aleatoria del tablero las 4 o 5 fichas de menor nivel que estén estorbando
    const countToRemove = Math.random() < 0.5 ? 4 : 5;
    const { remainingTiles, removedTilesCount } = removeLowestTilesRandomly(tilesRef.current, countToRemove);

    tilesRef.current = remainingTiles;
    setTiles(remainingTiles);
    isGameOverRef.current = false;
    setIsGameOver(false);
    isMovingRef.current = false;

    // Sonido de salvamento
    soundManager.playSalvageReward();

    setSalvageNotice(`¡Cochera despejada! Se eliminaron ${removedTilesCount} fichas menores. ¡A por el récord!`);
    setTimeout(() => {
      setSalvageNotice(null);
    }, 4000);
  };

  // Inyección de Fichas: Limpia el tablero y coloca exactamente dos cohetes (Ficha 14) juntos en el centro
  const handleSpawnRockets = useCallback(() => {
    setActiveTab('game');
    if (moveTimeoutRef.current) {
      clearTimeout(moveTimeoutRef.current);
      moveTimeoutRef.current = null;
    }
    isMovingRef.current = false;
    setIsGameOver(false);
    isGameOverRef.current = false;
    setIsRewardedAdOpen(false);
    setIsCelebrationOpen(false);

    // Asegurar tamaño 4x4 o el actual
    const currentSize = Math.max(boardSizeRef.current, 4);
    setBoardSize(currentSize);
    boardSizeRef.current = currentSize;

    // Colocar exactamente dos naves/cohetes espaciales (Ficha 14) juntos en el centro
    const centerRow = Math.floor(currentSize / 2);
    const centerCol1 = Math.floor(currentSize / 2) - 1;
    const centerCol2 = Math.floor(currentSize / 2);

    const testTiles: TileData[] = [
      {
        id: `rocket-14-a-${Date.now()}`,
        x: centerCol1,
        y: centerRow,
        level: 14,
        isMerged: false,
        isNew: true,
      },
      {
        id: `rocket-14-b-${Date.now() + 1}`,
        x: centerCol2,
        y: centerRow,
        level: 14,
        isMerged: false,
        isNew: true,
      },
    ];

    tilesRef.current = testTiles;
    setTiles(testTiles);
    setHighestLevelUnlocked((prev) => Math.max(prev, 14));
    soundManager.playSlide();

    setSalvageNotice('🚀 ¡Dos Cohetes (Nvl 14) listos en el centro! Desliza en horizontal para combinarlos.');
    setTimeout(() => {
      setSalvageNotice(null);
    }, 4500);
  }, []);

  // Inyección de Fichas: Limpia el tablero y coloca exactamente dos Batimóviles Cyberpunk (Nivel 16) juntos en el centro
  const handleSpawnBatimovil16 = useCallback(() => {
    setActiveTab('game');
    if (moveTimeoutRef.current) {
      clearTimeout(moveTimeoutRef.current);
      moveTimeoutRef.current = null;
    }
    isMovingRef.current = false;
    setIsGameOver(false);
    isGameOverRef.current = false;
    setIsRewardedAdOpen(false);
    setIsCelebrationOpen(false);

    const currentSize = Math.max(boardSizeRef.current, 4);
    setBoardSize(currentSize);
    boardSizeRef.current = currentSize;

    const centerRow = Math.floor(currentSize / 2);
    const centerCol1 = Math.floor(currentSize / 2) - 1;
    const centerCol2 = Math.floor(currentSize / 2);

    const testTiles: TileData[] = [
      {
        id: `batimovil-16-a-${Date.now()}`,
        x: centerCol1,
        y: centerRow,
        level: 16,
        isMerged: false,
        isNew: true,
      },
      {
        id: `batimovil-16-b-${Date.now() + 1}`,
        x: centerCol2,
        y: centerRow,
        level: 16,
        isMerged: false,
        isNew: true,
      },
    ];

    tilesRef.current = testTiles;
    setTiles(testTiles);
    setHighestLevelUnlocked((prev) => Math.max(prev, 16));
    soundManager.playSlide();

    setSalvageNotice('🦇 ¡Dos Batimóviles (Nvl 16) listos! Desliza para fusionar y descubrir el Auto Volador (Nvl 17).');
    setTimeout(() => {
      setSalvageNotice(null);
    }, 4500);
  }, []);

  // Inyección de Fichas: Limpia el tablero y coloca exactamente dos Autos Voladores Neón (Nivel 17) juntos en el centro
  const handleSpawnAutoVolador17 = useCallback(() => {
    setActiveTab('game');
    if (moveTimeoutRef.current) {
      clearTimeout(moveTimeoutRef.current);
      moveTimeoutRef.current = null;
    }
    isMovingRef.current = false;
    setIsGameOver(false);
    isGameOverRef.current = false;
    setIsRewardedAdOpen(false);
    setIsCelebrationOpen(false);

    const currentSize = Math.max(boardSizeRef.current, 4);
    setBoardSize(currentSize);
    boardSizeRef.current = currentSize;

    const centerRow = Math.floor(currentSize / 2);
    const centerCol1 = Math.floor(currentSize / 2) - 1;
    const centerCol2 = Math.floor(currentSize / 2);

    const testTiles: TileData[] = [
      {
        id: `volador-17-a-${Date.now()}`,
        x: centerCol1,
        y: centerRow,
        level: 17,
        isMerged: false,
        isNew: true,
      },
      {
        id: `volador-17-b-${Date.now() + 1}`,
        x: centerCol2,
        y: centerRow,
        level: 17,
        isMerged: false,
        isNew: true,
      },
    ];

    tilesRef.current = testTiles;
    setTiles(testTiles);
    setHighestLevelUnlocked((prev) => Math.max(prev, 17));
    soundManager.playSlide();

    setSalvageNotice('🛸 ¡Dos Autos Voladores (Nvl 17) listos! Desliza para forjar el Portal de Hiperviaje (Modo Infinito).');
    setTimeout(() => {
      setSalvageNotice(null);
    }, 4500);
  }, []);

  // Detona inmediatamente la pantalla de celebración masiva de cualquier nivel específico con sus fuegos y audio
  const handleTriggerLevelCelebration = useCallback((targetLevel: number) => {
    setActiveTab('game');
    isMovingRef.current = true;
    setCelebrationLevel(targetLevel);
    setIsCelebrationOpen(true);
    setHighestLevelUnlocked((prev) => Math.max(prev, targetLevel));

    if (targetLevel >= 15) {
      setScore((prev) => Math.max(prev + 100000, 520000));
    }

    if (targetLevel >= 11) {
      reproducirSonidoHitoLeyenda(targetLevel);
    } else {
      reproducirSonidoFusionNormal(targetLevel);
    }
  }, []);

  // Modo Dios / Test: Simula instantáneamente la celebración del Superdeportivo (Nivel 11)
  const handleTestMilestone = useCallback(() => {
    handleTriggerLevelCelebration(11);
  }, [handleTriggerLevelCelebration]);

  // Inyección de prueba para comprobar el Spawn Dinámico en vivo
  const handleInjectTile = useCallback((targetLevel: number) => {
    setActiveTab('game');
    const currentTiles = [...tilesRef.current];
    const size = boardSizeRef.current;

    // Buscar una posición libre o reemplazar la primera
    const empty = getEmptyCells(currentTiles, size);
    if (empty.length > 0) {
      const pos = empty[0];
      currentTiles.push({
        id: `injected-${targetLevel}-${Date.now()}`,
        x: pos.x,
        y: pos.y,
        level: targetLevel,
        isNew: true,
        isMerged: false,
      });
    } else if (currentTiles.length > 0) {
      currentTiles[0] = {
        ...currentTiles[0],
        level: targetLevel,
        isNew: true,
        isMerged: false,
      };
    }

    tilesRef.current = currentTiles;
    setTiles(currentTiles);
    setHighestLevelUnlocked((prev) => Math.max(prev, targetLevel));
    soundManager.playSlide();

    setSalvageNotice(`¡Pieza Nivel ${targetLevel} colocada! Mueve fichas para observar el Spawn Dinámico.`);
    setTimeout(() => {
      setSalvageNotice(null);
    }, 3500);
  }, []);

  // Atajos de prueba en consola, SOLO en desarrollo.
  //
  // En produccion no deben existir: permitian saltar a cualquier nivel desde la
  // consola del navegador (testNivel, inyectarFicha) y, al pasar del nivel 15,
  // el codigo asigna la puntuacion del puesto mas alto. Vite sustituye
  // import.meta.env.DEV por false al compilar, asi que este bloque entero
  // desaparece del bundle publicado.
  useEffect(() => {
    if (!import.meta.env.DEV) return;

    const w = window as unknown as {
      testHito?: () => void;
      spawnCohetes14?: () => void;
      spawnBatimovil16?: () => void;
      spawnAutoVolador17?: () => void;
      testNivel?: (lvl: number) => void;
      inyectarFicha?: (lvl: number) => void;
    };
    w.testHito = handleTestMilestone;
    w.spawnCohetes14 = handleSpawnRockets;
    w.spawnBatimovil16 = handleSpawnBatimovil16;
    w.spawnAutoVolador17 = handleSpawnAutoVolador17;
    w.testNivel = handleTriggerLevelCelebration;
    w.inyectarFicha = handleInjectTile;

    return () => {
      delete w.testHito;
      delete w.spawnCohetes14;
      delete w.spawnBatimovil16;
      delete w.spawnAutoVolador17;
      delete w.testNivel;
      delete w.inyectarFicha;
    };
  }, [
    handleTestMilestone,
    handleSpawnRockets,
    handleSpawnBatimovil16,
    handleSpawnAutoVolador17,
    handleTriggerLevelCelebration,
    handleInjectTile,
  ]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeTab !== 'game' || isCelebrationOpen) return;

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          e.preventDefault();
          handleMove('UP');
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault();
          handleMove('DOWN');
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault();
          handleMove('LEFT');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          e.preventDefault();
          handleMove('RIGHT');
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleMove, activeTab, isCelebrationOpen]);

  // Touch Swipe detection
  const handleTouchStart = (e: React.TouchEvent) => {
    if (activeTab !== 'game' || isCelebrationOpen) return;
    if (e.touches.length > 0) {
      touchStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (activeTab !== 'game' || isCelebrationOpen) return;
    if (!touchStartRef.current || e.changedTouches.length === 0) return;

    const touchEnd = {
      x: e.changedTouches[0].clientX,
      y: e.changedTouches[0].clientY,
    };

    const deltaX = touchEnd.x - touchStartRef.current.x;
    const deltaY = touchEnd.y - touchStartRef.current.y;
    touchStartRef.current = null;

    const minSwipeDistance = 24;

    if (Math.abs(deltaX) < minSwipeDistance && Math.abs(deltaY) < minSwipeDistance) {
      return;
    }

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > 0) {
        handleMove('RIGHT');
      } else {
        handleMove('LEFT');
      }
    } else {
      if (deltaY > 0) {
        handleMove('DOWN');
      } else {
        handleMove('UP');
      }
    }
  };

  // Cálculo inverso de posición global
  const currentEvolution = getEvolutionByLevel(highestLevelUnlocked);

  return (
    <div
      id="app-root"
      className="min-h-screen w-full bg-[var(--bg-deep)] text-[var(--text-main)] flex flex-col justify-between overflow-x-hidden select-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Header Geometric Balance con Pestañas Visibles */}
      <header
        id="game-header"
        className="w-full bg-[var(--bg-surface)] border-b border-white/10 px-4 sm:px-8 py-3 sm:py-3.5 flex flex-wrap items-center justify-between gap-3 shrink-0"
      >
        <div className="title-area flex flex-col">
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[var(--accent)] uppercase m-0 leading-none">
            Auto-Evolve 2048
          </h1>
          <span className="text-[11px] sm:text-xs font-theme-mono text-[var(--text-dim)] tracking-wider mt-1">
            YouTube Playables // Edición Automotriz
          </span>
        </div>

        {/* Pestañas de Navegación Visibles: Tablero vs Clasificación Global */}
        {/* Stats Container */}
        <div className="stats-container flex items-center gap-2 sm:gap-3 flex-wrap">
          <div
            id="stat-score-box"
            className="bg-black/30 border border-white/10 px-3 sm:px-4 py-1.5 rounded-lg text-center min-w-[80px] sm:min-w-[95px]"
          >
            <div className="text-[10px] uppercase text-[var(--text-dim)] font-bold tracking-wider mb-0.5">
              Puntuación
            </div>
            <div className="text-base sm:text-lg font-extrabold font-theme-mono text-[var(--text-main)] leading-none">
              {score.toLocaleString()}
            </div>
          </div>

          <div
            id="stat-record-box"
            className="bg-black/30 border border-white/10 px-3 sm:px-4 py-1.5 rounded-lg text-center min-w-[80px] sm:min-w-[95px]"
          >
            <div className="text-[10px] uppercase text-[var(--text-dim)] font-bold tracking-wider mb-0.5">
              Récord
            </div>
            <div className="text-base sm:text-lg font-extrabold font-theme-mono text-[var(--text-main)] leading-none">
              {bestScore.toLocaleString()}
            </div>
          </div>

          <div
            id="stat-grid-box"
            className="bg-black/30 border border-white/10 px-3 sm:px-4 py-1.5 rounded-lg text-center min-w-[70px] sm:min-w-[80px]"
          >
            <div className="text-[10px] uppercase text-[var(--text-dim)] font-bold tracking-wider mb-0.5">
              Grid
            </div>
            <div className="text-base sm:text-lg font-extrabold font-theme-mono text-[var(--accent)] leading-none">
              {boardSize}x{boardSize}
            </div>
          </div>

          {/* Quick Action Toolbar */}
          <div className="flex items-center gap-1.5 ml-1 sm:ml-2">
            <button
              id="btn-open-codex"
              onClick={() => setIsCodexOpen(true)}
              className="p-2 rounded-lg bg-white/[0.05] border border-white/10 text-zinc-300 hover:text-white hover:bg-white/10 transition"
              title="Museo de Evolución"
            >
              <BookOpen className="w-4 h-4 text-[var(--accent)]" />
            </button>

            <button
              id="btn-undo-move"
              onClick={handleUndo}
              disabled={!history}
              className={`p-2 rounded-lg border transition ${
                history
                  ? 'bg-white/[0.05] border-white/10 text-zinc-300 hover:text-white hover:bg-white/10'
                  : 'bg-black/20 border-white/5 text-zinc-600 cursor-not-allowed'
              }`}
              title="Deshacer movimiento"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              id="btn-toggle-sound"
              onClick={() => {
                const nextMuted = !isMuted;
                setIsMuted(nextMuted);
                soundManager.isMuted = nextMuted;
              }}
              className="p-2 rounded-lg bg-white/[0.05] border border-white/10 text-zinc-300 hover:text-white hover:bg-white/10 transition"
              title={isMuted ? 'Activar sonido' : 'Silenciar'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>

            <button
              id="btn-restart-game"
              onClick={initGame}
              className="p-2 rounded-lg bg-white/[0.05] border border-white/10 text-zinc-300 hover:text-red-400 hover:bg-red-500/10 transition"
              title="Reiniciar partida"
            >
              <RotateCcw className="w-4 h-4 rotate-90" />
            </button>
          </div>
        </div>
      </header>

      {/* VISTA 1: TABLERO DE JUEGO */}
      {activeTab === 'game' && (
        <div className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-8 py-4 sm:py-6 grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 items-start">
          {/* Sidebar: Ranking Status + Evolution Guide */}
          <aside className="hidden lg:flex flex-col gap-4">
            {/* Guía de Evolución Automotriz */}
            <div className="evolution-guide bg-white/[0.03] rounded-xl p-4 border border-white/10 shadow-sm">
              <div className="guide-title text-xs font-extrabold uppercase tracking-wider text-[var(--accent)] mb-3 border-b border-white/10 pb-2 flex items-center justify-between">
                <span>Evolución Automotriz</span>
                <span className="font-theme-mono text-[10px] text-[var(--text-dim)] font-normal">
                  {highestLevelUnlocked}/{EVOLUTION_LEVELS.length}
                </span>
              </div>

              <div className="space-y-2">
                {EVOLUTION_LEVELS.slice(0, 6).map((item) => {
                  const isUnlocked = item.level <= highestLevelUnlocked;
                  const isCurrentHole = item.level === highestLevelUnlocked;

                  return (
                    <div
                      key={item.level}
                      className={`flex items-center justify-between text-xs py-1 px-1.5 rounded transition ${
                        isCurrentHole
                          ? 'bg-[var(--accent)]/15 border border-[var(--accent)]/40 text-white font-semibold'
                          : isUnlocked
                          ? 'text-zinc-200'
                          : 'opacity-40 text-zinc-500'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: item.accentColor }}
                        />
                        <span className="truncate">{item.name}</span>
                      </div>
                      <span className="font-theme-mono text-[10px] text-[var(--text-dim)] shrink-0 ml-1">
                        L{item.level}
                      </span>
                    </div>
                  );
                })}
              </div>

              {highestLevelUnlocked > 6 && (
                <div className="mt-2 pt-2 border-t border-white/5 text-[11px] text-[var(--accent)] flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Niveles de élite desbloqueados</span>
                </div>
              )}
            </div>
          </aside>

          {/* Arena Central de Juego */}
          <main className="flex flex-col items-center justify-center w-full relative">
            {/* Tablero Minimalista (100% LIMPIEZA VISUAL: CERO TEXTOS EN FICHAS) */}
            <div className="w-full max-w-[500px] relative mx-auto">
              <GameBoard
                size={boardSize}
                tiles={tiles}
                isExpandedRecently={isExpandedRecently}
              />

              {/* Game Over Normal Overlay (si ya usó el anuncio de revivir) */}
              {isGameOver && !isRewardedAdOpen && (
                <div
                  id="game-over-overlay"
                  className="absolute inset-0 bg-black/85 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-200 z-30 border border-white/10"
                >
                  <div className="w-12 h-12 rounded-xl bg-red-950/60 border border-red-500/40 flex items-center justify-center text-red-400 mb-3 shadow-lg">
                    <Maximize2 className="w-6 h-6" />
                  </div>
                  <h2 className="text-xl font-extrabold text-white uppercase tracking-tight mb-1">
                    ¡Cochera Bloqueada!
                  </h2>
                  <p className="text-xs text-[var(--text-dim)] mb-4 max-w-xs">
                    No quedan movimientos posibles en la cuadrícula de {boardSize}x{boardSize}.
                  </p>

                  <div className="bg-black/40 border border-white/10 rounded-lg p-3 w-full max-w-xs mb-4 text-xs font-theme-mono space-y-1">
                    <div className="flex justify-between text-[var(--text-dim)]">
                      <span>Puntuación:</span>
                      <span className="font-bold text-[var(--accent)]">{score.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-[var(--text-dim)]">
                      <span>Récord:</span>
                      <span className="font-bold text-white">{bestScore.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-[var(--text-dim)]">
                      <span>Mayor Hito:</span>
                      <span className="font-bold text-white">{currentEvolution.name}</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 w-full max-w-xs">
                    <button
                      id="btn-reopen-salvage"
                      onClick={() => setIsRewardedAdOpen(true)}
                      className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-black px-4 py-2.5 rounded-lg shadow-md transition active:scale-95 flex items-center justify-center gap-1.5 text-xs uppercase tracking-wider cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Salvar Racha</span>
                    </button>
                    <button
                      id="btn-retry-game"
                      onClick={initGame}
                      className="flex-1 bg-white/10 hover:bg-white/15 text-white font-bold px-4 py-2.5 rounded-lg border border-white/10 transition active:scale-95 flex items-center justify-center gap-1.5 text-xs uppercase tracking-wider cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reiniciar</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Controles Táctiles en Pantalla para Móvil */}
            <div
              id="onscreen-dpad-controls"
              className="mt-4 flex items-center justify-center gap-2 sm:hidden select-none"
            >
              <button
                id="btn-dpad-left"
                onClick={() => handleMove('LEFT')}
                className="w-11 h-10 rounded-lg bg-[var(--bg-surface)] border border-white/10 active:bg-white/10 flex items-center justify-center text-zinc-300 shadow-sm"
                title="Izquierda"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex flex-col gap-1.5">
                <button
                  id="btn-dpad-up"
                  onClick={() => handleMove('UP')}
                  className="w-11 h-10 rounded-lg bg-[var(--bg-surface)] border border-white/10 active:bg-white/10 flex items-center justify-center text-zinc-300 shadow-sm"
                  title="Arriba"
                >
                  <ArrowUp className="w-5 h-5" />
                </button>
                <button
                  id="btn-dpad-down"
                  onClick={() => handleMove('DOWN')}
                  className="w-11 h-10 rounded-lg bg-[var(--bg-surface)] border border-white/10 active:bg-white/10 flex items-center justify-center text-zinc-300 shadow-sm"
                  title="Abajo"
                >
                  <ArrowDown className="w-5 h-5" />
                </button>
              </div>
              <button
                id="btn-dpad-right"
                onClick={() => handleMove('RIGHT')}
                className="w-11 h-10 rounded-lg bg-[var(--bg-surface)] border border-white/10 active:bg-white/10 flex items-center justify-center text-zinc-300 shadow-sm"
                title="Derecha"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </main>
        </div>
      )}

      {/* VISTA 2: SECCIÓN VISIBLE DE CLASIFICACIÓN GLOBAL (TOP 10 DE 50,000 A 500,000 PTS) */}
      {/* Modal de Anuncio de Recompensa (Revivir / Limpiar Cochera con 4 o 5 fichas) */}
      <RewardedAdModal
        isOpen={isRewardedAdOpen}
        score={score}
        boardSize={boardSize}
        onAdCompleted={handleRewardedAdCompleted}
        onGameOverRestart={() => {
          setIsRewardedAdOpen(false);
          setIsGameOver(true);
        }}
      />

      {/* Codex / Museum Modal */}
      <CodexModal
        isOpen={isCodexOpen}
        onClose={() => setIsCodexOpen(false)}
        highestLevelUnlocked={highestLevelUnlocked}
      />

    </div>
  );
}
