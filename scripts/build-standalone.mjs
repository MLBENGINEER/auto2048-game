/**
 * Genera dist/standalone.html: el juego completo en un solo archivo HTML,
 * con el CSS, el JavaScript y todas las imágenes de vehículos incrustadas.
 *
 * Pensado para el envío a YouTube Playables, donde conviene no depender de
 * peticiones de red a archivos sueltos.
 *
 * Uso: npm run build:standalone  (compila primero y luego empaqueta)
 */

import { readFileSync, readdirSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');

if (!existsSync(join(dist, 'index.html'))) {
  console.error('No existe dist/index.html. Ejecuta "npm run build" primero.');
  process.exit(1);
}

// Un "</script>" dentro del código cerraría la etiqueta antes de tiempo.
const escapeForInlineScript = (code) => code.replace(/<\/(script)/gi, (_, tag) => `<\/${tag}`);

const html = readFileSync(join(dist, 'index.html'), 'utf8');

const scriptMatch = html.match(/<script[^>]*src="\.\/([^"]+)"[^>]*><\/script>/);
const styleMatch = html.match(/<link[^>]*rel="stylesheet"[^>]*href="\.\/([^"]+)"[^>]*>/);

if (!scriptMatch || !styleMatch) {
  console.error('No pude localizar el script o la hoja de estilos en dist/index.html.');
  process.exit(1);
}

const js = readFileSync(join(dist, scriptMatch[1]), 'utf8');
const css = readFileSync(join(dist, styleMatch[1]), 'utf8');

/**
 * El tipo real se deduce de los bytes de cabecera, no de la extensión: varios
 * de los archivos .png del proyecto son en realidad JPEG.
 */
function detectMime(buffer) {
  if (buffer[0] === 0x89 && buffer[1] === 0x50) return 'image/png';
  if (buffer[0] === 0xff && buffer[1] === 0xd8) return 'image/jpeg';
  if (buffer.subarray(8, 12).toString('ascii') === 'WEBP') return 'image/webp';
  return 'application/octet-stream';
}

// Imágenes de vehículos: los archivos sueltos en la raíz de dist.
const images = {};
for (const file of readdirSync(dist).filter((f) => /\.(png|jpe?g|webp)$/i.test(f)).sort()) {
  const buffer = readFileSync(join(dist, file));
  images[file] = `data:${detectMime(buffer)};base64,${buffer.toString('base64')}`;
}

// Aviso si el código pide imágenes que no existen.
const referenced = new Set(js.match(/\b\d+\.png\b/g) ?? []);
const missing = [...referenced].filter((name) => !images[name]);

// Importante: los reemplazos se pasan como FUNCIÓN. Si fueran cadenas,
// JavaScript interpretaría los "$" del código minificado (React usa $$typeof)
// como patrones especiales de replace y corrompería el bundle al insertarlo.
const styleBlock = () =>
  `<style>\n${css}\n</style>\n    <script>window.__VEHICLE_IMAGES__ = ${escapeForInlineScript(
    JSON.stringify(images),
  )};</script>`;

const scriptBlock = () => `<script type="module">\n${escapeForInlineScript(js)}\n</script>`;

const inlined = html.replace(styleMatch[0], styleBlock).replace(scriptMatch[0], scriptBlock);

const out = join(dist, 'standalone.html');
writeFileSync(out, inlined);

const mb = (Buffer.byteLength(inlined) / 1024 / 1024).toFixed(1);
console.log(`dist/standalone.html generado — ${mb} MB, ${Object.keys(images).length} imágenes incrustadas.`);
if (missing.length) {
  console.warn(`AVISO: el código referencia imágenes que no existen: ${missing.join(', ')}`);
}
