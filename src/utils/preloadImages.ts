import { EVOLUTION_LEVELS } from '../constants/evolutions';
import { cleanImageFilename, getVehicleImageUrl } from './imagePath';

/**
 * Descarga y decodifica por adelantado las imágenes de todas las evoluciones.
 *
 * Sin esto, la imagen de un nivel se pedía por red en el instante exacto en que
 * se producía la fusión que lo desbloquea, y el tirón caía justo encima de la
 * animación. Al precargarlas, en la fusión la imagen ya está en memoria.
 *
 * decode() es lo que importa: descargar no basta, porque descomprimir el JPEG
 * en el hilo principal es la parte que se nota.
 */
export function preloadEvolutionImages(): void {
  const nombres = new Set(
    EVOLUTION_LEVELS.map((evolucion) => cleanImageFilename(evolucion.image)).filter(Boolean),
  );

  for (const nombre of nombres) {
    const img = new Image();
    img.decoding = 'async';
    img.src = getVehicleImageUrl(nombre);
    // Si falla no hay nada que hacer: el <img> del tablero reintenta con su
    // propia ruta de reserva.
    void img.decode?.().catch(() => {});
  }
}
