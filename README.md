# Sheep Happens

Guía en profundidad y bilingüe (ES/EN) del **Mago** para **World of Warcraft: Forever**.
Sitio estático con interactividad selectiva: builds filtrables por uso y rama (con vista de calculadora y enlace a Wowhead), razas con sus raciales, fichas de hechizos al pasar el ratón, explorador de cambios filtrable, explorador de talentos por rama, buscador por secciones y calculadora de crítico. Cada dato muestra su fuente y su estado de verificación.

> Estado del juego en la última revisión (2026-10-11): **beta** (cliente 1.60.1). El lanzamiento está previsto para el 4 de noviembre de 2026. Ver [`docs/game-version.md`](docs/game-version.md).
>
> Producción: **https://sheephappens.app** (Cloudflare Pages; `sheep-happens.pages.dev` redirige aquí). Ver [`docs/deployment.md`](docs/deployment.md).

## Requisitos

- Node.js ≥ 22.12 (probado con 24 LTS)
- npm 10+

## Comandos

| Comando | Qué hace |
| --- | --- |
| `npm install` | Instala las dependencias |
| `npm run dev` | Servidor de desarrollo en `http://localhost:4321` (el buscador no funciona en este modo) |
| `npm run build` | Compila en `dist/` y genera el índice de búsqueda (Pagefind) |
| `npm run preview` | Sirve `dist/` tal como se publicará (con buscador) |
| `npm run validate` | Valida los datos JSON y las páginas MDX (referencias, cobertura, componentes, imágenes sociales) |
| `npm run data:diff` | Falla si cambiaste un dato sin poner su fecha `updated` (compara con el último commit) |
| `npm run changelog` | Regenera `CHANGELOG.md` a partir de `src/data/changelog.json` |
| `npm run watch` | Informe de novedades de las fuentes vigiladas (últimos 7 días) |
| `npm run og` | Regenera las imágenes sociales de `public/og/` (tras cambiar un título) |
| `npm run typecheck` | Comprobación de tipos (`astro check`) |
| `npm test` | Pruebas unitarias (filtros, rutas, calculadora, datos, contraste WCAG, enlaces) |
| `npm run links` | Comprueba los enlaces internos y las anclas de `dist/` (`-- --external` también comprueba las fuentes externas) |
| `npm run check` | Validación, historial, tipos, pruebas, compilación y enlaces, igual que la CI y Cloudflare |

## Estructura

```
src/
  content/pages/{es,en}/*.mdx   Prosa de cada página (una por idioma)
  data/*.json                   Datos de juego: cambios, talentos decisivos, habilidades, datos clave, fuentes,
                                fuentes vigiladas, versiones e historial
  i18n/                         Registro de rutas (slugs localizados) y textos de la interfaz
  lib/                          Esquemas Zod, carga de datos, reglas editoriales y lógica pura con pruebas
  components/guide/             Componentes de contenido usables en MDX sin importarlos
  components/layout/            Cabecera, buscador, índice, migas de pan, metadatos de página…
  layouts/                      BaseLayout, GuideLayout, HomeLayout
  styles/                       Tokens de diseño (claro/oscuro) y estilos base
scripts/                        Validación, enlaces, historial, vigilante de fuentes e imágenes sociales
tests/                          Vitest
docs/                           Análisis, requisitos, plan, versión del juego, fuentes y validación
```

## Editar contenido

- **Revisión de fuentes:** [`docs/maintenance.md`](docs/maintenance.md). Cada miércoles y viernes se abre una issue con las novedades de las fuentes vigiladas, y un agente automático propone los cambios en un PR.
- **Cómo editar:** [`CONTRIBUTING.md`](CONTRIBUTING.md). Explica cómo añadir un cambio, una fuente o una página, y cómo funcionan los borradores, las fechas y el historial.
- **Historial:** [`CHANGELOG.md`](CHANGELOG.md), generado a partir de los datos.

## Publicar

Ver [`docs/deployment.md`](docs/deployment.md) (Cloudflare Pages, paso a paso) y [`docs/seo.md`](docs/seo.md) (posicionamiento y tareas tras publicar).

## Documentación del proyecto

- [Análisis de la referencia](docs/reference-analysis.md) · [Mapa de navegación](docs/reference-navigation.md) · [Patrones UX](docs/ux-patterns.md)
- [Requisitos](docs/product-requirements.md) · [Plan de implementación](docs/implementation-plan.md) · [Auditoría final](docs/audit.md)
- [Versión del juego](docs/game-version.md) · [Fuentes](docs/content-sources.md) · [Validación del contenido](docs/content-validation.md)
- [Mantenimiento y revisión de fuentes](docs/maintenance.md) · [Hoja de ruta del contenido](docs/content-roadmap.md) · [Despliegue](docs/deployment.md) · [SEO](docs/seo.md)

## Aviso legal

Guía de fans sin relación con Blizzard Entertainment. World of Warcraft es una marca de Blizzard Entertainment, Inc. El logotipo y los iconos son originales de este proyecto.
