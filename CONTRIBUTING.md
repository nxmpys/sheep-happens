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
- Nombres en español: **solo** en `src/data/spell-names.json`, el diccionario único (inglés → español) que usan todas las páginas. `source: "official"` si lo ha publicado Blizzard (`blizzard-deep-dive-mage-es` u otra fuente oficial en español); `"client"` si sale del cliente de Forever en español (Wowhead Forever, `?locale=6`, el mismo dato que trae `npm run spells:text`). Sin nombre verificado no hay `es` y se usa el inglés. La validación falla si un hechizo o talento de los datos no está en el diccionario. La terminología oficial usa «talento decisivo» (milestone), «efectos de enfriamiento» (Chill) y «congelado» (Frozen).
- En la prosa en español: nombre en español y, la primera vez en cada página, el inglés entre paréntesis: **Lanza de hielo** (Ice Lance). Después, solo el español. En builds, tablas y listas compactas, el inglés va en el tooltip, no entre paréntesis.
- La raza: «Cielonato (Skyborne)» en la primera mención de cada página y «Cielonato» después (en inglés, «Skyborne»).

## Tareas habituales

### Añadir o corregir un cambio de Forever

1. Edita `src/data/changes.json`. Campos clave: `id` (kebab-case), `name` (nombre oficial en inglés), `tree`, `category`, `kinds`, `summary.es`/`summary.en`, `status`, `sources`.
2. Si el cambio mueve un talento, rellena `row` y `previousRow`. Si se renombra, `formerly`.
3. Si es un talento de hito, actualiza también `src/data/milestones.json` (el validador comprueba que coincidan).
4. Las interpretaciones van en `notes` con su propio `status` (normalmente `analysis`), nunca mezcladas con el `summary`.

### Añadir una fuente

1. Añádela a `src/data/sources.json` con `kind` y `accessed` (fecha en que la leíste).
2. Refiérete a ella por su `id` desde los datos o desde el `sources:` de una página.

### Añadir o actualizar una build

1. Añádela a `src/data/builds.json`: `id`, `name`, `uses` (`leveling`, `aoe`, `dungeons`, `raid`, `pvp`; solo los usos en los que la build tiene sentido), `recommendedFor` (los usos en los que es la recomendada; en los demás sale como «Viable»; como mucho una recomendada por uso y nivel), `spec`, `level`, `points` (id del talento → rango), `keyTalents`, `summary`, `playstyle` y, si hacen falta, `strengths`, `weaknesses` e `items`.
2. Los ids de talento son los de `src/data/talents.json` (árbol de Forever según la calculadora de Wowhead). `npm run validate` comprueba que la build se pueda hacer en el juego: rangos, puntos por fila, requisitos y puntos del nivel.
3. El enlace a la calculadora de Wowhead y la vista de calculadora se generan solos. No hace falta copiar ninguna URL.
4. `status: "analysis"` mientras no se haya probado en el juego; `"tested"` cuando sí. Pon `gameVersion`, `sources` y `updated`, y añade una entrada al historial con `refs: ["build:<id>"]`.
5. Si la build merece una guía en profundidad, crea la página (ver «Añadir una página nueva») y enlázala con `page`. Dentro de una página, `<BuildCard id="…" />` muestra la tarjeta.
6. **Builds de leveo:** añade `order`, un id de talento por punto en el orden en que se gastan (el punto 1 llega a nivel 10, o a nivel 5 con Talented 5/5). Los primeros puntos hasta el `level` de la build deben sumar exactamente `points`; los siguientes, hasta cinco, son los puntos extra de quien tiene el perk de Legado Talented. `npm run validate` comprueba cada paso del orden (filas, rangos y requisitos en el momento de gastar el punto). Explica los puntos clave en `orderNotes` (`point` es el número de punto) y rellena `fromLevel`, `goal`, `profile`, `upside` y `downside` para el selector de la guía de leveo (`<BuildPicker ids={[…]} recommended="…" />`).
7. **Ampliar el leveo a un nivel más alto** (por ejemplo, del 30 al 60): en la misma build, sube `level`, añade los puntos nuevos a `order` y actualiza `points`. No crees builds ni páginas nuevas: la URL y los enlaces se mantienen. El aviso BETA y las etapas de la guía (`<LevelingStatus />`) cambian solos cuando todas las builds de leveo llegan al último nivel de cada etapa (`src/lib/leveling.ts`).

### Actualizar las raciales

Las raciales viven en `src/data/races.json`: efecto (`effect`), valor para el Mago (`value`, nuestro análisis) y por qué (`why`). Si cambia un efecto o un valor, actualiza `updated` y añade una entrada al historial con `refs: ["race:<id>"]`.

### Actualizar las profesiones

- El análisis de cada profesión vive en `src/data/professions.json`: valoraciones (`ratings`, solo las principales; las secundarias llevan `priority`), beneficio y limitación de la tabla, ventajas, inconvenientes, PvE y JcJ, mejor pareja (`pair`), veredicto y los objetos que lo respaldan (`items`, con su id de la base de datos de Forever de Wowhead).
- Las recomendaciones por objetivo («Mejor combinación general», «JcJ (PvP)»…) viven en `src/data/profession-picks.json`.
- En la página, cada `<ProfessionDetail id="…" />` va justo debajo de un `### <nombre>` con el nombre exacto de la profesión en ese idioma: las tarjetas y la tabla enlazan a ese encabezado, y `npm run validate` lo comprueba.
- Si cambia un dato, una valoración o una recomendación, actualiza `updated` y añade una entrada al historial con `refs: ["profession:<id>"]` o `refs: ["pick:<id>"]`. Las notas de la investigación están en [`docs/professions-research.md`](docs/professions-research.md).

### Editar una página

- Edita el MDX de **los dos idiomas**. Los componentes disponibles están en `src/components/mdx.ts`: `<Status status="verified" />`, `<Pending why="…" next="…" />`, `<Callout>`, `<Priority>`, `<PageLink to="changes" query="tree=frost">…</PageLink>`, `<FactList ids={['launch']} />`, etc.
- Para enlazar páginas internas usa siempre `<PageLink to="…">` (respeta el idioma, los slugs y la ruta base).
- Si no hay información fiable, usa `<Pending>`. **No rellenes con texto genérico.**
- Los nombres de hechizos y talentos en **negrita** muestran su ficha al pasar el ratón si están en `abilities.json`, `changes.json` o `talents.json`. Escribe el nombre exacto (oficial en español o en inglés) para que se reconozca.

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
- No se rellena automáticamente a propósito. La fecha «Revisado» que ve el lector es la más reciente entre `reviewed`, las entradas del historial que listan la página y la última actualización (`updated`) de cualquier dato que la página muestra con sus componentes (`src/lib/page-dates.ts`). Así una página nunca dice ser más antigua que las fichas que enseña.
- `reviewedBy` es quien hizo esa revisión.

## Avisos temporales

Los banners de eventos (como el torneo de duelos) van en `src/data/notices.json` con `start` y `end` con su zona horaria (`2026-10-19T00:00:00+02:00` es medianoche en Madrid). El build deja fuera los avisos caducados y el navegador oculta los que están fuera de su ventana, porque la web estática puede no recompilarse a tiempo. En la página, `<Notices />`.

## Menú y orden de lectura

El menú (`PRIMARY_NAV` en `src/i18n/routes.ts`) es también el orden de «Anterior / Siguiente»: no hay una segunda lista que mantener. Una página nueva entra en el menú una sola vez.

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
