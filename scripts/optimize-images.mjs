/**
 * Reduce las imágenes de vehículos al tamaño en que realmente se muestran.
 *
 * Los originales (1024x1024, ~600 KB) se dibujan en fichas de 100 px: unas 100
 * veces más píxeles de los necesarios, y 4 MB descomprimidos cada una. Eso
 * provocaba un tirón al fusionar, porque la imagen del nivel nuevo se
 * descargaba y decodificaba justo en ese instante.
 *
 * 512 px cubre el uso más grande (la celebración de hito, 420 px) con margen
 * para pantallas de alta densidad.
 *
 * Origen: assets-originales/   Destino: public/ y public/assets/
 * Uso: npm run optimize:images
 */

import { readFileSync, readdirSync, writeFileSync, statSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const origen = join(root, 'assets-originales');
const destinos = [join(root, 'public'), join(root, 'public', 'assets')];

const LADO = 512;
const CALIDAD = 82;

for (const d of destinos) mkdirSync(d, { recursive: true });

const archivos = readdirSync(origen)
  .filter((f) => /\.(png|jpe?g|webp)$/i.test(f))
  .sort((a, b) => parseInt(a, 10) - parseInt(b, 10));

let antes = 0;
let despues = 0;

for (const archivo of archivos) {
  const entrada = join(origen, archivo);
  antes += statSync(entrada).size;

  // Se recorta al cuadrado porque la interfaz usa object-cover en todos los casos.
  const salida = await sharp(readFileSync(entrada))
    .resize(LADO, LADO, { fit: 'cover', position: 'centre' })
    .jpeg({ quality: CALIDAD, mozjpeg: true, progressive: true })
    .toBuffer();

  despues += salida.length;
  for (const d of destinos) writeFileSync(join(d, archivo), salida);

  console.log(
    `${archivo.padEnd(8)} ${(statSync(entrada).size / 1024).toFixed(0).padStart(4)} KB -> ${(
      salida.length / 1024
    ).toFixed(0).padStart(3)} KB`,
  );
}

const mb = (n) => (n / 1024 / 1024).toFixed(2);
console.log(
  `\n${archivos.length} imágenes: ${mb(antes)} MB -> ${mb(despues)} MB ` +
    `(${(antes / despues).toFixed(1)}x más ligero)`,
);
