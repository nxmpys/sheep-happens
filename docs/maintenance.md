# Mantenimiento semanal

> Objetivo: que actualizar la guía sea una rutina de 20 a 40 minutos a la semana, siempre con las mismas fuentes, y que cada dato modificado quede registrado en el historial.

## 1. De dónde sale la información

No hay que buscar fuentes nuevas cada semana. La lista fija está en **`src/data/watchlist.json`** y se publica en la web (`/es/fuentes/`):

| Prioridad | Fuente | Qué aporta | Lectura |
|---|---|---|---|
| Alta | **Blizzard Tracker (US)** | Todo mensaje oficial: notas, errores conocidos, noticias, pódcast | Automática (RSS, filtro «Forever») |
| Alta | **WoW Forever Beta Development Notes** | Lista de cambios de cada build; el vigilante extrae la sección «Mage» | Automática (JSON del foro) |
| Alta | **Blizzard Tracker (EU, español)** | Traducciones oficiales → nombres en español | Automática (RSS) |
| Normal | **WoW Forever Beta Known Issues** | Errores conocidos: evita documentar un fallo como si fuera un cambio | Automática (líneas sobre el Mago) |
| Normal | **wago.tools builds** | Avisa de builds nuevas del cliente (p. ej., 1.60.1.70338) | Automática |
| Normal | **Wowhead News** | Noticias y cambios extraídos de cada build | Automática (RSS, filtro «Forever») |
| Normal | **Warcraft Tavern — Forever** | Resúmenes de la comunidad para contrastar | Automática (RSS) |
| Normal | **Icy Veins — Forever** | Noticias y guías | Manual (bloquea peticiones automáticas) |
| Baja | **Foro de la beta** | Opiniones y errores de jugadores | Automática (RSS) |
| Baja | **Wowhead — base de datos de Forever** | Cifras de hechizos (datos extraídos) | Manual |

**Tras el lanzamiento (4 nov 2026):** el hilo de notas de la beta dejará de actualizarse. Las notas de parche aparecerán en el Blizzard Tracker; cuando exista un hilo o una página estable de notas de parche, añádela a `watchlist.json` con `type: "discourse-topic"` o `"rss"`.

## 2. El informe semanal

Cada **lunes a las 07:00 UTC**, GitHub Actions (`.github/workflows/weekly-sources.yml`) ejecuta el vigilante y abre una *issue* con la etiqueta «revisión semanal». También se puede lanzar a mano:

```bash
npm run watch
```

```bash
npm run watch -- --since 2026-10-04 --out informe.md
```

El informe tiene una casilla por novedad. Las notas de desarrollo llegan ya filtradas: solo la sección del Mago de cada mensaje nuevo o editado.

## 3. Rutina (cada semana)

1. **Abre la issue de la semana** (o ejecuta `npm run watch`).
2. **Clasifica cada novedad:**
   - ¿Afecta al Mago? Si no, márcala y sigue.
   - ¿Es oficial (Blizzard), comunidad o datos extraídos? Eso decide el `status` (ver `docs/content-sources.md`).
   - ¿Es un **error conocido**? No es un cambio de diseño: como mucho, una nota.
3. **Actualiza los datos** en `src/data/`:
   - Cambio de un talento o hechizo → `changes.json` (y `milestones.json` si es un talento decisivo).
   - Dato general (fechas, niveles, razas…) → `facts.json`.
   - Fuente nueva → `sources.json` (con `accessed` = hoy).
   - En **cada registro modificado**, pon `"updated": "AAAA-MM-DD"` con la fecha de hoy.
4. **Registra el cambio** en `src/data/changelog.json`:
   - Una entrada `type: "game"` por cada build o anuncio, con la fecha del anuncio, `sources` y `refs` (p. ej., `"change:ice-lance"`).
   - Una entrada `type: "guide"` con la fecha de hoy que reúna todo lo actualizado en la revisión (`refs` de todos los registros con `updated` de hoy).
   - Si conoces la build, añade `"build": "1.60.1.70338"`.
5. **Revisa la prosa** de las páginas afectadas (`src/content/pages/{es,en}/*.mdx`). Si has revisado una página completa contra sus fuentes, actualiza su `reviewed`.
6. **Regenera** el historial del repositorio y comprueba:

   ```bash
   npm run changelog
   ```

   ```bash
   npm run check
   ```

7. **Publica:** commit (`content: revisión semanal AAAA-MM-DD`) y push a `main`. Cloudflare Pages despliega solo si `npm run check` pasa.
8. **Cierra la issue** enlazando el commit.

## 4. Qué garantiza que el historial no se quede atrás

| Regla | Dónde se comprueba |
|---|---|
| Cada registro con `updated` tiene una entrada del historial de **esa fecha** que lo referencia | `npm run validate` (integridad de datos) |
| Si cambias un **dato** (texto en inglés, estado, fuentes, fila, nivel…) sin cambiar `updated`, falla | `npm run data:diff` (compara con el último commit; en la CI, con el commit anterior o con la rama base) |
| `CHANGELOG.md` coincide con `changelog.json` | `npm run changelog -- --check` |
| Toda referencia (`refs`, `sources`) existe | `npm run validate` |

Corregir una errata en el texto en español **no** obliga a añadir una entrada al historial: solo cuentan los cambios de datos.

## 5. Qué ve el lector

- Cada ficha actualizada muestra **«Actualizado el …»** y enlaza a la entrada del historial.
- `/es/novedades/` y `/en/updates/` listan el historial, con enlaces a los datos afectados.
- RSS: `/es/novedades/rss.xml` y `/en/updates/rss.xml`.
- `CHANGELOG.md` en el repositorio.

## 6. Revisión del lanzamiento

Tras el 4 de noviembre de 2026, sigue la lista de `docs/content-validation.md` (sección «Lista de revisión tras el lanzamiento») y crea la versión `forever-launch` en `src/data/game-versions.json`.
