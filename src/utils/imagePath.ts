import { getCustomImageSync } from './customImages';

/**
 * Mapeo de imágenes locales de vehículos para producción.
 * Resuelve rutas relativas directas al mismo nivel del directorio (./1.png)
 * o de la carpeta assets configurada por Vite (./assets/1.png).
 */

export function cleanImageFilename(filename?: string): string {
  if (!filename) return '1.png';
  return filename.replace(/^(\.\/|\/)/, '').replace(/^assets\//, '');
}

export function getVehicleImageUrl(filename?: string): string {
  if (!filename) return './1.png';
  if (filename.startsWith('data:') || filename.startsWith('blob:') || filename.startsWith('http://') || filename.startsWith('https://')) {
    return filename;
  }
  const clean = cleanImageFilename(filename);
  return `./${clean}`;
}

export function getVehicleImageFallbackUrl(filename?: string): string {
  if (!filename) return './assets/1.png';
  if (filename.startsWith('data:') || filename.startsWith('blob:') || filename.startsWith('http://') || filename.startsWith('https://')) {
    return filename;
  }
  const clean = cleanImageFilename(filename);
  return `./assets/${clean}`;
}

/**
 * Obtiene la fuente activa para el vehículo:
 * 1. Imagen personalizada del usuario / caché (si existe)
 * 2. Ruta relativa directa al mismo nivel (./X.png)
 */
export function getActiveVehicleSource(filename?: string): string {
  const clean = cleanImageFilename(filename);
  const custom = getCustomImageSync(clean);
  if (custom) return custom;
  return `./${clean}`;
}
