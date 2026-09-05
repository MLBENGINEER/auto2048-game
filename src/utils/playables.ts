/**
 * Envoltorio del SDK de YouTube Playables.
 *
 * El SDK solo existe cuando el juego corre dentro de YouTube. En GitHub Pages,
 * en local o en cualquier otro sitio no está, así que todo lo de aquí degrada a
 * un no-op en vez de reventar. Ninguna funcion lanza: los anuncios y el guardado
 * son accesorios, y un fallo suyo nunca debe cortar la partida.
 *
 * Referencia: https://developers.google.com/youtube/gaming/playables/reference/sdk
 */

interface YTGame {
  IN_PLAYABLES_ENV?: boolean;
  game?: {
    firstFrameReady?: () => void;
    gameReady?: () => void;
    sendScore?: (score: { value: number }) => Promise<void>;
    saveData?: (data: string) => Promise<void>;
    loadData?: () => Promise<string>;
  };
  ads?: {
    requestInterstitialAd?: () => Promise<void>;
    requestRewardedAd?: (id: string) => Promise<boolean>;
  };
}

function sdk(): YTGame | undefined {
  return (globalThis as { ytgame?: YTGame }).ytgame;
}

/** True solo dentro del entorno de YouTube Playables. */
export function enPlayables(): boolean {
  return sdk()?.IN_PLAYABLES_ENV === true;
}

/** Obligatorio: avisa de que el primer fotograma ya se dibujó. */
export function primerFotogramaListo(): void {
  try {
    sdk()?.game?.firstFrameReady?.();
  } catch {
    /* fuera de Playables no hay nada que notificar */
  }
}

/** Obligatorio: avisa de que el juego ya es jugable. */
export function juegoListo(): void {
  try {
    sdk()?.game?.gameReady?.();
  } catch {
    /* idem */
  }
}

/**
 * Envía la puntuación a YouTube, que la usa para su clasificación.
 * Debe ser un entero; el SDK rechaza decimales.
 */
export async function enviarPuntuacion(valor: number): Promise<void> {
  const entero = Math.floor(valor);
  if (!Number.isFinite(entero) || entero < 0 || entero > Number.MAX_SAFE_INTEGER) return;
  try {
    await sdk()?.game?.sendScore?.({ value: entero });
  } catch {
    /* si falla, la partida sigue igual */
  }
}

/** Guarda estado en YouTube. Máximo 3 MiB. */
export async function guardarDatos(datos: string): Promise<boolean> {
  try {
    const fn = sdk()?.game?.saveData;
    if (!fn) return false;
    await fn(datos);
    return true;
  } catch {
    return false;
  }
}

/** Recupera el estado guardado. Devuelve null si no hay o si falla. */
export async function cargarDatos(): Promise<string | null> {
  try {
    const fn = sdk()?.game?.loadData;
    if (!fn) return null;
    const datos = await fn();
    return typeof datos === 'string' && datos.length > 0 ? datos : null;
  } catch {
    return null;
  }
}

/**
 * Pide un anuncio intersticial en una pausa natural del juego.
 * Resuelve igual si no se mostró ninguno: nunca bloquea la partida.
 */
export async function anuncioIntersticial(): Promise<void> {
  try {
    await sdk()?.ads?.requestInterstitialAd?.();
  } catch {
    /* sin anuncio disponible, se continua sin mas */
  }
}

/**
 * Resultado de pedir un anuncio con recompensa.
 *  - 'ganada'       el usuario vio el anuncio y merece el premio
 *  - 'no-ganada'    hubo anuncio pero el usuario no lo completó
 *  - 'no-disponible' no habia anuncio que mostrar, o estamos fuera de Playables
 *
 * La diferencia importa: si no habia anuncio, negarle el premio al jugador lo
 * castiga por algo que no depende de el, y no se pierde ingreso ninguno porque
 * no habia nada que mostrar.
 */
export type ResultadoRecompensa = 'ganada' | 'no-ganada' | 'no-disponible';

/**
 * Pide un anuncio con recompensa.
 *
 * El id no es un identificador de anuncio, sino una etiqueta propia de la
 * recompensa concedida. No debe contener datos del usuario.
 */
export async function anuncioRecompensa(id: string): Promise<ResultadoRecompensa> {
  const fn = sdk()?.ads?.requestRewardedAd;
  if (!fn) return 'no-disponible';
  try {
    return (await fn(id)) === true ? 'ganada' : 'no-ganada';
  } catch {
    // El SDK lanza cuando no hay inventario para este usuario o region.
    return 'no-disponible';
  }
}
