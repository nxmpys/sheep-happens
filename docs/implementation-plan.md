# Plan de implementación

## 1. Decisiones de arquitectura

| Decisión | Elección | Por qué | Implicación de mantenimiento |
|---|---|---|---|
| Tipo de sitio | **Estático con interactividad selectiva** | Contenido de guía: rápido, barato y con buen SEO. No hay necesidad de cuentas ni base de datos | Se despliega en cualquier hosting estático |
| Framework | **Astro 7** + TypeScript estricto | Genera HTML por defecto y JS solo donde se pide. Colecciones de contenido validadas con Zod | Una dependencia principal bien mantenida |
| Interactividad | **TypeScript nativo + Custom Elements**, sin framework de UI | Los componentes son pequeños (filtros, pestañas, índice). Un framework solo añadiría peso | Cada componente es un `.astro` con su `<script>` |
| Contenido en prosa | **MDX** por idioma (`src/content/pages/{es,en}/*.mdx`) | Quien edita escribe Markdown y coloca componentes (`<ChangeExplorer />`) donde los necesita | El frontmatter se valida al compilar |
| Datos de juego | **JSON** validado (`src/data/*.json`) | Cambios, talentos, habilidades, fuentes y versiones son datos estructurados y bilingües en un único sitio | Una corrección se hace en un solo lugar y se refleja en ambos idiomas |
| Rutas | Registro central (`src/i18n/routes.ts`) + ruta dinámica `[lang]/[...slug]` | Slugs localizados, estables y sin versión; el selector de idioma sabe cuál es la página equivalente | Añadir una página = una entrada en el registro + dos MDX |
| Buscador | **Pagefind** (índice estático generado tras compilar) | Devuelve subresultados por encabezado; un índice por idioma; sin servidor | Paso extra en `build`; no funciona en `astro dev` |
| Estilos | CSS propio con *tokens* (variables) y modo claro/oscuro | Sin dependencias; tema arcano propio | `src/styles/tokens.css` centraliza la identidad |
| Fuentes tipográficas | Autoalojadas con `@fontsource` | Sin peticiones a Google; rendimiento y privacidad | — |
| Iconos | **SVG propios** (escuelas, logo, interfaz) | Los iconos de hechizos de Blizzard tienen licencia incierta para este uso | Si en el futuro se aclaran los derechos, se puede añadir un campo `icon` |
| Pruebas | **Vitest** (lógica pura) + validador de contenido + comprobador de enlaces sobre `dist/` | La lógica de filtros, rutas y la calculadora debe ser fiable; los enlaces rotos se detectan al compilar | `npm run check` lo ejecuta todo |
| CI | GitHub Actions: instalar → validar → probar → compilar → enlaces | Proporcionado al tamaño del proyecto | Flujo opcional de despliegue en GitHub Pages |

## 2. Estructura

```
src/
  content.config.ts        Esquemas Zod (páginas MDX + datos JSON)
  content/pages/{es,en}/   Prosa de cada página (MDX con frontmatter)
  data/                    changes.json, abilities.json, milestones.json, sources.json,
                           game-versions.json, changelog.json
  i18n/                    routes.ts (registro de rutas), ui.ts (textos de interfaz), utils.ts
  lib/                     Lógica pura con pruebas (filtros, calculadora, rutas, fechas)
  components/
    layout/                Header, Footer, Breadcrumbs, Toc, PageMeta, PrevNext, SearchDialog…
    guide/                 StatusBadge, Callout, Pending, ChangeExplorer, TalentExplorer,
                           MilestoneMap, AbilityGrid, PriorityList, CritCalculator…
  layouts/                 BaseLayout, GuideLayout
  pages/                   index.astro (redirección por idioma), [lang]/[...slug].astro, 404.astro
  scripts/                 Comportamiento del cliente (TS) por componente
  styles/                  tokens.css, base.css, prose.css
scripts/                   validate-content.ts, check-links.ts
tests/                     Pruebas unitarias (Vitest)
docs/                      Este y los demás documentos
```

## 3. Modelo de contenido

**Página (MDX):** `pageId`, `locale`, `title`, `description`, `category`, `spec?`, `gameVersion`, `published`, `reviewed`, `reviewedBy`, `status` (`draft` | `published`), `verification` (estado global de la página), `sources[]`, `tags[]`.

**Cambio (JSON):** `id`, `name` (inglés oficial, más `nameEs?` cuando se confirme), `tree` (`baseline` | `arcane` | `fire` | `frost`), `category`, `kinds[]` (`new` | `redesigned` | `renamed` | `moved` | `adjusted` | `prerequisite` | `baseline`), `row?`, `previousRow?`, `milestone?`, `learnLevel?`, `formerly?`, `summary{es,en}`, `details[]`, `notes[]{status,text}`, `status`, `sources[]`.

**Otros datos:** `milestones.json` (hitos 11/16/21/31 por rama), `abilities.json` (kit por función), `facts.json` (datos clave reutilizables), `game-versions.json`, `changelog.json`.

**Fuente (JSON):** `id`, `title`, `publisher`, `url`, `kind`, `published?`, `accessed`, `notes?`.

**Integridad (validador):** cada `sources[]` existe; cada `gameVersion` existe; las dos traducciones existen; `reviewed` ≤ hoy; `published` ≤ `reviewed`; cada id de página del registro tiene un MDX por idioma; ningún dato `verified` se apoya solo en fuentes `tool`.

## 4. Entregas

| Entrega | Contenido | Estado |
|---|---|---|
| 1. Investigación | Documentos de `docs/` | ✅ |
| 2. Fundamentos | Proyecto, tokens, layout, navegación, registro de rutas, esquemas, componentes base | ✅ |
| 3. Primera versión útil | Inicio, guía, cambios (explorador), 3 ramas, nivelación, combate, equipo (pendiente), fuentes, novedades, buscador | ✅ |
| 4. Interactividad avanzada | Calculadora de crítico, tema claro/oscuro, atajos, filtros en la URL | ✅ (favoritos y planificador de talentos: aplazados, ver `audit.md`) |
| 5. Publicación | SEO (canonical, hreflang, sitemap, OG), CI, despliegue, guía de edición | ✅ (falta elegir hosting y dominio) |
| 6. Mantenimiento y publicación | Fuentes vigiladas, informe semanal automático, historial ligado a los datos (`updated` + `refs`), CHANGELOG.md, RSS, nombres oficiales en español, SEO (JSON-LD, sitemap con hreflang y fechas, imágenes sociales), Cloudflare Pages | ✅ (falta conectar las cuentas: ver `deployment.md`) |
| Post-lanzamiento | Revisión completa tras el 4 nov 2026 (ver `content-validation.md`) | Pendiente |

## 5. Flujo de edición (resumen)

1. Editar el MDX o el JSON.
2. Si se revisa el contenido de verdad, actualizar `reviewed` (nunca de forma automática).
3. Añadir una entrada en `changelog.json` si el cambio es relevante para el lector.
4. `npm run check` (validación + pruebas + compilación + enlaces).
5. Publicar (push → CI → despliegue).

Detalle completo en [`CONTRIBUTING.md`](../CONTRIBUTING.md).
