# Auto2048: Evolución Automotriz

Clon avanzado, infinito y dinámico de 2048 con temática de evolución automotriz
y tablero autoexpansible, pensado para **YouTube Playables**.

Juego 100% estático (React + TypeScript + Vite + Tailwind). No requiere servidor
ni claves de API en tiempo de ejecución.

## Ejecutar en local

Requisito: Node.js 20 o superior.

```bash
npm install
npm run dev
```

Abre http://localhost:3000

## Compilar para producción

```bash
npm run build
```

El resultado queda en `dist/`. Esa carpeta es lo que se publica o se empaqueta
para enviar a YouTube Playables.

Para revisar la compilación antes de publicar:

```bash
npm run preview
```

## Publicación

Cada `push` a la rama `main` dispara el workflow
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml), que compila el
proyecto y lo publica en GitHub Pages.

## Estructura

| Ruta | Contenido |
| --- | --- |
| `src/` | Código fuente (componentes, motor de juego, utilidades) |
| `public/` | Imágenes de los vehículos, copiadas tal cual al build |
| `scripts/` | Utilidades de generación de niveles |
| `metadata.json` | Metadatos del applet |
