# Cómo editar y publicar contenido

La información de juego **no** vive en los componentes. Hay dos tipos de contenido:

| Qué | Dónde | Formato |
| --- | --- | --- |
| Datos estructurados (cambios, talentos decisivos, habilidades, datos clave, fuentes, fuentes vigiladas, versiones, historial) | `src/data/*.json` | JSON bilingüe `{ "es": …, "en": … }`, validado con Zod |
| Prosa de cada página | `src/content/pages/{es,en}/<pageId>.mdx` | Markdown + componentes |

Una corrección en un JSON se refleja en todas las páginas y en ambos idiomas.

## Estados de verificación

Todo dato lleva un `status`. Elige con honestidad (criterios completos en [`docs/content-sources.md`](docs/content-sources.md)):

| `status` | Úsalo cuando… |
| --- | --- |
| `verified` | Lo has leído en una fuente **oficial** de Blizzard (obligatorio citarla) |
| `reported` | Lo dicen la comunidad o la prensa y no has leído el original |
| `classic` | Es el comportamiento de Classic y Forever no lo ha cambiado (cita una fuente `classic-reference`) |
| `analysis` | Es una deducción tuya a partir de mecánicas verificadas |
| `tested` | Lo has comprobado en el juego (anota versión y fecha en el historial) |
| `pending` | No se sabe |

El validador rechaza, por ejemplo, un `verified` sin fuente oficial o un `reported` que solo cita calculadoras.

## Cada cambio de datos queda en el historial

1. En el registro que cambias (`changes.json`, `milestones.json`, `abilities.json`, `facts.json`), pon `"updated": "AAAA-MM-DD"` (hoy).
2. Añade (o amplía) una entrada de `src/data/changelog.json` **con esa misma fecha** cuyo `refs` incluya el registro: `"change:ice-lance"`, `"fact:dual-spec"`, `"milestone:fire-16"`…
3. Ejecuta `npm run changelog` para regenerar `CHANGELOG.md`.

`npm run validate` comprueba el punto 2 y `npm run data:diff` comprueba que no olvides el punto 1. Solo cuentan los cambios de **datos** (texto en inglés, estado, fuentes, fila, nivel…); corregir una errata en español no los requiere.

## Nombres de hechizos y talentos

- `name`: nombre oficial en inglés (siempre).
- `nameEs` (y `formerlyEs`): nombre oficial en español, **solo** si lo ha publicado Blizzard (fuente `blizzard-deep-dive-mage-es` u otra oficial en español). La terminología oficial usa «talento decisivo» (milestone), «efectos de enfriamiento» (Chill) y «congelado» (Frozen).
- En la prosa en español: nombre en español y, la primera vez en cada página, el inglés entre paréntesis: **Lanza de hielo** (Ice Lance).

## Tareas habituales

### Añadir o corregir un cambio de Forever

1. Edita `src/data/changes.json`. Campos clave: `id` (kebab-case), `name` (nombre oficial en inglés), `tree`, `category`, `kinds`, `summary.es`/`summary.en`, `status`, `sources`.
2. Si el cambio mueve un talento, rellena `row` y `previousRow`. Si se renombra, `formerly`.
3. Si es un talento de hito, actualiza también `src/data/milestones.json` (el validador comprueba que coincidan).
4. Las interpretaciones van en `notes` con su propio `status` (normalmente `analysis`), nunca mezcladas con el `summary`.

### Añadir una fuente

1. Añádela a `src/data/sources.json` con `kind` y `accessed` (fecha en que la leíste).
2. Refiérete a ella por su `id` desde los datos o desde el `sources:` de una página.

### Editar una página

- Edita el MDX de **los dos idiomas**. Los componentes disponibles están en `src/components/mdx.ts`: `<Status status="verified" />`, `<Pending why="…" next="…" />`, `<Callout>`, `<Priority>`, `<PageLink to="changes" query="tree=frost">…</PageLink>`, `<FactList ids={['launch']} />`, etc.
- Para enlazar páginas internas usa siempre `<PageLink to="…">` (respeta el idioma, los slugs y la ruta base).
- Si no hay información fiable, usa `<Pending>`. **No rellenes con texto genérico.**

### Añadir una página nueva

1. Añade el id y sus slugs en `src/i18n/routes.ts` (`PAGE_IDS`, `ROUTES` y, si procede, `PRIMARY_NAV` o `LEARNING_PATH`).
2. Añade su etiqueta en `NAV_LABELS` (`src/i18n/ui.ts`).
3. Crea `src/content/pages/es/<id>.mdx` y `src/content/pages/en/<id>.mdx`, con `seoTitle` (≤ 60 caracteres, palabra clave al principio) y `description` (50-170).
4. Genera su imagen social con `npm run og` (en Windows; en otros sistemas, `OG_FONT_DIR`).
5. `npm run validate` avisa si falta algún idioma o la imagen.

### Borradores

`status: draft` en el frontmatter: la página no se publica ni aparece en el sitemap. El validador avisa de que falta la versión publicada.

## La fecha de revisión (`reviewed`)

- Cámbiala **solo** cuando hayas revisado el contenido de la página contra sus fuentes. Editar una errata no es una revisión.
- No se rellena automáticamente a propósito: la cabecera de la página le dice al lector cuándo se comprobó por última vez.
- `reviewedBy` es quien hizo esa revisión.

## Versión del juego

Cuando cambie la versión de referencia (por ejemplo, el lanzamiento del 4 de noviembre de 2026):

1. Añade una entrada en `src/data/game-versions.json` (`stage: "launch"`).
2. Revisa cada página y, al terminar, cambia su `gameVersion` y su `reviewed`.
3. Registra la revisión en `src/data/changelog.json`.

## Historial

Añade una entrada en `src/data/changelog.json` cuando un cambio sea relevante para el lector (contenido nuevo, una corrección importante o un anuncio de Blizzard). `type`: `site`, `guide` o `game`.

## Revisión de fuentes

Ver [`docs/maintenance.md`](docs/maintenance.md): fuentes fijas, informe automático de los miércoles y viernes, pasos para actualizar y reglas del agente que propone los cambios.

## Hoja de ruta del contenido

[`docs/content-roadmap.md`](docs/content-roadmap.md) recoge lo que aún no existe, lo que es de la beta y hay que quitar al lanzar, lo que hay que vigilar con el tiempo y el plan de builds. Revísala **cada vez que cambies datos o páginas**: marca lo resuelto, añade lo nuevo y actualiza su fecha de revisión.

## Antes de publicar

```bash
npm run check
```

Valida los datos y las páginas, comprueba los tipos, ejecuta las pruebas, compila, genera el índice de búsqueda y comprueba los enlaces internos. La CI ejecuta lo mismo en cada push y en cada pull request.

De vez en cuando, comprueba también las fuentes externas:

```bash
npm run links -- --external
```

(Algunas webs, como Icy Veins o Massively OP, responden 403 a las peticiones automáticas; compruébalas a mano.)
