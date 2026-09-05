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
    saveData?: (data: string) => Promise<void>;
    loadData?: () => Promise<string>;
  };
  // Verificado contra el SDK real (v1.20260831): sendScore cuelga de
  // engagement, no de game. Puesto en game fallaba en silencio y la
  // puntuacion nunca llegaba a YouTube.
  engagement?: {
    sendScore?: (score: { value: number }) => Promise<void>;
  };
  ads?: {
    requestInterstitialAd?: () => Promise<void>;
    requestRewardedAd?: (id: string) => Promise<boolean>;
  };
  system?: {
    onPause?: (cb: () => void) => () => void;
    onResume?: (cb: () => void) => () => void;
    isAudioEnabled?: () => boolean;
    onAudioEnabledChange?: (cb: (activado: boolean) => void) => () => void;
  };
}

/** Función para cancelar una suscripción. No hacer nada es un cancelador válido. */
type Cancelar = () => void;
const SIN_SUSCRIPCION: Cancelar = () => {};

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
    await sdk()?.engagement?.sendScore?.({ value: entero });
  } catch {
    /* si falla, la partida sigue igual */
  }
}

/**
 * Guarda estado en YouTube. Máximo 3 MiB.
 *
 * Ojo con la forma de llamar: los métodos del SDK usan `this`, así que hay que
 * invocarlos sobre su objeto. Extraerlos a una variable y llamarlos sueltos
 * lanza, y el fallo queda enmascarado por el catch.
 */
export async function guardarDatos(datos: string): Promise<boolean> {
  const api = sdk();
  if (!api?.game?.saveData) return false;
  try {
    await api.game.saveData(datos);
    return true;
  } catch {
    return false;
  }
}

/** Recupera el estado guardado. Devuelve null si no hay o si falla. */
export async function cargarDatos(): Promise<string | null> {
  const api = sdk();
  if (!api?.game?.loadData) return null;
  try {
    const datos = await api.game.loadData();
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
  const api = sdk();
  if (!api?.ads?.requestRewardedAd) return 'no-disponible';
  try {
    return (await api.ads.requestRewardedAd(id)) === true ? 'ganada' : 'no-ganada';
  } catch {
    // El SDK lanza cuando no hay inventario para este usuario o region.
    return 'no-disponible';
  }
}

/**
 * YouTube pausa el juego cuando el usuario sale, cambia de pestaña o abre otra
 * cosa. Se llama en todas las pausas, incluida la salida definitiva, y no hay
 * ninguna garantía de que el juego vuelva a reanudarse: es el momento de
 * guardar, no de suponer que habrá un después.
 */
export function alPausar(cb: () => void): Cancelar {
  try {
    return sdk()?.system?.onPause?.(cb) ?? SIN_SUSCRIPCION;
  } catch {
    return SIN_SUSCRIPCION;
  }
}

/** Se dispara al volver de una pausa, si es que vuelve. */
export function alReanudar(cb: () => void): Cancelar {
  try {
    return sdk()?.system?.onResume?.(cb) ?? SIN_SUSCRIPCION;
  } catch {
    return SIN_SUSCRIPCION;
  }
}

/**
 * Estado del audio según los ajustes de YouTube, no del juego.
 * Fuera de Playables se asume permitido, que es lo que ocurre en cualquier
 * navegador normal.
 */
export function audioPermitido(): boolean {
  // Fuera de YouTube el ajuste no significa nada y el SDK no es fiable: se
  // asume permitido, que es como se comporta cualquier navegador.
  if (!enPlayables()) return true;
  const api = sdk();
  if (!api?.system?.isAudioEnabled) return true;
  try {
    return api.system.isAudioEnabled();
  } catch {
    return true;
  }
}

/**
 * Avisa cuando el usuario cambia el sonido desde los controles de YouTube.
 * La documentación lo marca como obligatorio: el juego DEBE reaccionar a esto.
 */
export function alCambiarAudio(cb: (activado: boolean) => void): Cancelar {
  // Fuera de Playables esta suscripcion avisa de inmediato con `false`, aunque
  // isAudioEnabled() diga lo contrario. Obedecerla dejaba el juego mudo en
  // GitHub Pages, asi que solo se escucha dentro de YouTube.
  if (!enPlayables()) return SIN_SUSCRIPCION;
  try {
    return sdk()?.system?.onAudioEnabledChange?.(cb) ?? SIN_SUSCRIPCION;
  } catch {
    return SIN_SUSCRIPCION;
  }
}
