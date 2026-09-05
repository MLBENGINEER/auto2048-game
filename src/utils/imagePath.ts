import { getCustomImageSync } from './customImages';

/**
 * Mapeo de imágenes locales de vehículos para producción.
 * Resuelve rutas relativas directas al mismo nivel del directorio (./1.png)
 * o de la carpeta assets configurada por Vite (./assets/1.png).
 *
 * En la compilación de archivo único (npm run build:standalone) las imágenes
 * viajan incrustadas en window.__VEHICLE_IMAGES__ y se resuelven desde ahí,
 * porque no hay archivos sueltos que pedir por red.
 */

type EmbeddedImages = Record<string, string>;

function getEmbeddedImage(clean: string): string | undefined {
  const embedded = (globalThis as { __VEHICLE_IMAGES__?: EmbeddedImages }).__VEHICLE_IMAGES__;
  return embedded?.[clean];
}

export function cleanImageFilename(filename?: string): string {
  if (!filename) return '1.png';
  return filename.replace(/^(\.\/|\/)/, '').replace(/^assets\//, '');
}

function isExternalSource(filename: string): boolean {
  return (
    filename.startsWith('data:') ||
    filename.startsWith('blob:') ||
    filename.startsWith('http://') ||
    filename.startsWith('https://')
  );
}

export function getVehicleImageUrl(filename?: string): string {
  if (!filename) return getEmbeddedImage('1.png') ?? './1.png';
  if (isExternalSource(filename)) return filename;
  const clean = cleanImageFilename(filename);
  return getEmbeddedImage(clean) ?? `./${clean}`;
}

export function getVehicleImageFallbackUrl(filename?: string): string {
  if (!filename) return getEmbeddedImage('1.png') ?? './assets/1.png';
  if (isExternalSource(filename)) return filename;
  const clean = cleanImageFilename(filename);
  return getEmbeddedImage(clean) ?? `./assets/${clean}`;
}

/**
 * Obtiene la fuente activa para el vehículo:
 * 1. Imagen personalizada del usuario / caché (si existe)
 * 2. Imagen incrustada en el build de archivo único (si existe)
 * 3. Ruta relativa directa al mismo nivel (./X.png)
 */
export function getActiveVehicleSource(filename?: string): string {
  const clean = cleanImageFilename(filename);
  const custom = getCustomImageSync(clean);
  if (custom) return custom;
  return getEmbeddedImage(clean) ?? `./${clean}`;
}
