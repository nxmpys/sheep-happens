# Auditoría de Sheep Happens

Fecha: 30 de octubre de 2026. Punto de partida: commit `72a7b4e`. Resultado: siete commits de corrección, de `fcfebbd` a `644098d`, más el de este informe, y ocho más con tus decisiones, de `80f122d` a `7cbcf77` (ver la sección 3). Todo está subido a GitHub.

## 1. Resumen

### Qué revisé

- **Estructura:** 56 MDX (28 páginas por idioma), 28 JSON de datos, unos 130 componentes, 5 hojas de estilo, las funciones de Cloudflare y la documentación. Salen 79 URL públicas en el sitemap, más la portada de idioma y dos 404.
- **Contenido:** leí entero el MDX en español. El inglés lo contrasté con cuatro comprobaciones sobre el texto ya publicado, página por página: cifras ES/EN, lista de palabras poco frecuentes, grafías y términos. Solo leí línea a línea seis páginas en inglés.
- **Datos:** comprobé filas, requisitos, niveles y fechas contra `talents.json`, `race-picks.json`, `facts.json` y `abilities.json`.
- **Aspecto visual:** medición automática de las 79 URL a 360, 768, 1280 y 1920 px, y unas 25 capturas de las plantillas principales en claro y oscuro.
- **Técnica:** `npm run check` completo, peticiones fallidas y recursos de todas las páginas, 246 enlaces externos, encabezados, nombres de controles, teclado del menú, sitemap, hreflang y código sin usar.

### Problemas encontrados y corregidos

| Categoría | Corregidos | Decididos después por ti |
| --- | --- | --- |
| Contradicciones y datos desactualizados | 8 | 5 |
| Terminología, voz y grafía | 11 | 2 |
| Enlaces rotos | 1 | 0 |
| Títulos, metadatos y texto interno visible | 4 | 1 |
| Visual (desbordes y contraste) | 4 | 0 |
| Accesibilidad | 1 (en 2 componentes) | 0 |
| Código y recursos sin usar | 3 | 0 |
| Documentación del repositorio | 4 documentos | 0 |
| **Total** | **36** | **8** |

### Estado final

`npm run check` termina con código 0, también tras aplicar tus decisiones: 0 errores, 0 advertencias y 0 sugerencias de tipos, 285 pruebas superadas, ningún enlace interno roto y paridad ES/EN correcta. Tras corregir, no queda ningún desborde horizontal en las 79 URL a los cuatro anchos.

### Lo que esta auditoría no cubre

- **No he jugado:** contrasté la web consigo misma y con sus fuentes, no con el juego.
- **Formularios:** el de comentarios y la publicación de builds de la comunidad dependen de funciones de Cloudflare que no corren en local. `/api/community-builds` da 404 en la vista previa, como es de esperar, y no pude probarlos.
- **Tu navegador:** no probé en Brave ni en un móvil real. Las capturas salen del navegador integrado con el tamaño emulado.
- **Enlaces externos:** 166 de los 246 responden 403 a las peticiones automáticas, así que no sé si funcionan. Son 151 de Wowhead, 6 de Icy Veins, 4 de ConquestCapped, 2 de Mobalytics, 1 de CurseForge, 1 de SeeMeta y 1 más sin desglosar. Otros 79 respondieron bien y 1 estaba roto de verdad (ver la sección 2).

## 2. Lo corregido

### Contradicciones y datos desactualizados (`fcfebbd`)

| Archivo | Qué estaba mal | Qué hice |
| --- | --- | --- |
| `content/pages/{es,en}/home.mdx` | La FAQ decía en presente que la beta «cierra el 23 de octubre» y «no pasa del nivel 30» | Lo pasé a pasado |
| `content/pages/{es,en}/home.mdx` | La FAQ de razas daba «Trol, Gnomo y Humano» para mazmorras; `race-picks.json` y Razas dan Gnomo y Cielonato en Alianza, Trol y Orco en Horda | Ahora dice «Gnomo y Trol», las primeras opciones de cada facción |
| `i18n/ui.ts` | El aviso de cada página decía «Forever está en beta» | «Datos de la beta de Forever: pueden cambiar antes del lanzamiento» |
| `content/pages/{es,en}/leveling.mdx` | Decía que se farmea «desde el 22» y que antes del 22 es un error; la misma página y la guía de AoE dicen 14 | Desde el 14, grupos pequeños; desde el 22, con Ventisca mejorada 3/3, la rotación de Ventisca. Es lo que dice la guía de AoE |
| `content/pages/{es,en}/professions.mdx` | Daba por desconocido cuándo llegan las bandas; `facts.json` dice 9 de diciembre (fuente oficial) | Lo pendiente ahora es su equipo, no la fecha |
| `content/pages/{es,en}/gear.mdx` | «No se han publicado las bandas de nivel 60» | Abren el 9 de diciembre y aún no he podido comprobar su equipo |
| `content/pages/{es,en}/talents.mdx` | «Talentos de fila 1» junto a Calentamiento (fila 4) y Tromba de misiles (fila 2) | «Algunos de estos talentos están en las primeras filas» |
| `data/addons.json` | Tromba de misiles, «talento de la fila 1»; desde el 28 de octubre es fila 2 | Fila 2, con los 5 puntos en Arcano que pide |

### Terminología, voz y grafía (`6cf6943`)

| Archivos | Qué estaba mal | Qué hice |
| --- | --- | --- |
| `i18n/builds.ts`, `TalentCalculator.astro`, 5 MDX en español, `facts`, `mage-water`, `builds` | «Talented» en toda la web y «Talentoso» solo en Legado | «Talentoso», el nombre del cliente en español, con el inglés como pista |
| Los mismos y `professions` | «perk» en unas páginas y «ventaja» en Legado | «ventaja» |
| `data/facts.json` | «Talentos de hito» frente a «talentos decisivos» | «talentos decisivos» |
| `data/facts.json` | Árbol «Recursos» frente a «Ingenio» | «Ingenio» |
| `i18n/professions.ts`, `professions.mdx`, `QuestionCards.astro`, 3 JSON | «PvE» al lado de «JcJ» en tablas y texto | «JcE». Los títulos de búsqueda siguen con PvE y PvP (ver la sección 4) |
| `aoe-farming.mdx`, `tools.mdx`, `WaterCalculator.astro`, 3 JSON, `CHANGELOG.md` | «Libre lanzamiento» frente a «Lanzamiento libre» | «Lanzamiento libre», como el cliente |
| `data/builds.json` | «el ralentizamiento» | «la ralentización» |
| `data/glossary.json` | «Blink» en la definición en español | «Traslación» |
| `data/glossary.json` | «tirón» y «efectos de enfriamiento» se usan sin definición | Añadidos como términos del glosario |
| `story-copy.ts` y 5 MDX en inglés | Grafía británica en una web en inglés americano | leveled, leveling, realized, optimize, optimized, armors, gray, defenses |
| `i18n/ui.ts` | «por quien revisa la guía» rompía la primera persona | «Comprobado por mí en el juego» |

Aplicar «Talentoso» y «ventaja» fue decisión mía, siguiendo la regla de `CONTRIBUTING.md` de usar el nombre oficial en español. Si prefieres Talented, se revierte fácilmente.

### Enlaces (`6cf6943`)

| Archivo | Qué estaba mal | Qué hice |
| --- | --- | --- |
| `data/sources.json` | `warcraft.wiki.gg/wiki/Ice_Shards_(Classic)` no existe | Apunta a `/wiki/Ice_Shards`, que confirma los valores citados |

### Visual (`e9fb653`)

| Archivo | Qué estaba mal | Qué hice |
| --- | --- | --- |
| `BuildVariants.astro` | A 768 px, una variante larga dejaba la explicación en una columna de 0 px, con una letra por línea, y desbordaba la página. Afectaba a Arcano hacia mazmorras en ES y EN | La columna de cambios ocupa como mucho el 60 % y sus iconos pasan a otra línea |
| `ChangelogList.astro` | A 360 px, una etiqueta larga desbordaba Novedades (380 px de ancho) | La etiqueta parte en dos líneas |
| `CampBuffs.astro` | Tarjetas atenuadas con contraste 4,37:1 | Opacidad de 0,75 a 0,8 |
| `StoryTimeline.astro` | Etiquetas de Sobre mí con contraste 4,35:1 | Color un poco más claro |

### Accesibilidad (`bf401a6`)

| Archivo | Qué estaba mal | Qué hice |
| --- | --- | --- |
| `AoeKit.astro`, `SpotFinder.astro` | Los deslizadores de nivel no tenían nombre: la etiqueta nombraba al `<output>` que va antes del `<input>` | Etiqueta unida al deslizador con `for` e `id`. Comprobado: «Tu nivel: 26» |

### Títulos y metadatos (`63956cc` y `6cf6943`)

| Archivo | Qué estaba mal | Qué hice |
| --- | --- | --- |
| `content/pages/{es,en}/builds.mdx` | El título prometía builds de JcJ y banda, que no existen | «para leveo y mazmorras» |
| `content/pages/{es,en}/builds.mdx` | Etiqueta «farmeo», un uso retirado | Quitada |
| `pages/[lang]/builds/[use]/[build].astro` | «Arcano hacia mazmorras» perdía el título de búsqueda por ser largo | Conserva «Build de…: Mago en WoW Forever» |
| `SourcesTable.astro` | Fuentes mostraba el id interno de cada fuente | Quitado. Los anclajes siguen funcionando |
| `content/pages/es/gear.mdx` | La etiqueta de búsqueda decía «anillo del filántropo» | «anillo de filántropo» |

Son 4 problemas en la tabla del resumen porque los dos de `builds.mdx` cuentan como uno.

### Código sin usar (`cac06bb`)

- 22 claves de interfaz por idioma, de filtros y páginas ya retirados, en `i18n/ui.ts` e `i18n/builds.ts`.
- `useTranslations` y `displayNameText`, sin ninguna llamada.
- 6 iconos de `public/icons` que no referencia ninguna página ni dato.

### Documentación (`644098d`)

- `README.md`: qué hace la web hoy, el comando `output` y el aviso legal, que aún decía que todos los iconos eran originales.
- `CONTRIBUTING.md`: sin el uso `aoe`, con el menú actual y «talento decisivo».
- `docs/game-version.md`: beta cerrada, build actual, árbol Ingenio y talentos decisivos tras las builds del 15 y el 28 de octubre.
- `docs/content-roadmap.md`: builds de leveo hechas, tramo 31-60 pendiente y enlace a este informe.

## 3. Decisiones

Dejé 8 puntos abiertos y los decidiste el mismo 30 de octubre. Están todos aplicados.

| Punto | Tu decisión | Qué hice | Commit |
| --- | --- | --- | --- |
| 1. Textos trazados desfasados | Opción A: una sola entrada en el historial | Corregidos los 5 casos en `milestones.json` y `changes.json`, con `updated` y la entrada «Fichas de talentos al día con el árbol del 28 de octubre» | `80f122d` |
| 2. Datos sin usar en `facts.json` | Opción A: borrarlos | Borrados `beta` y `client-version`, y lo que apuntaba a ellos en el historial y en `seo.ts` | `bb0285d` |
| 3. Nombre de los datos tras la beta | Opción A: seguir diciendo «beta» hasta el 4 de noviembre | Nada que cambiar | No aplica |
| 4. Leveo 1-60 o 10-60 | Opción A: 1-60 como tramo, 10-60 solo para el orden de puntos | Corregidos la descripción de Builds, un título del historial y la tarjeta de builds de Inicio. Las builds siguen diciendo «en orden del 10 al 60» | `a706645`, `7cbcf77` |
| 5. Cuatro nombres para el mismo concepto | Opción A: «daño de hechizos» | Unificado en español y en inglés, también en las columnas de Agua del Mago, donde «SP» desaparece. «spell power» sigue como etiqueta de búsqueda | `b0aeb84` |
| 6. Escalofrío o enfriamiento | Opción B: «enfriamiento», si es lo que publica Blizzard | Comprobado: su página en español dice «efectos de enfriamiento» y nunca «efectos de escalofrío». Aplicado en builds, habilidades y glosario | `c59c92c` |
| 7. Prioridad de estadísticas | Opción A: enlazar a las builds | Equipo enlaza a las builds de leveo y mazmorras. Queda pendiente la prioridad de banda y comprobar las de nivel 60 | `d83ef76` |
| 8. Requisito de Dedos de Escarcha | Cerrarlo, ya está comprobado | Fuera de las discrepancias de Fuentes y Cambios. La ficha dice que requiere Lanza de hielo | `80f122d` |
| 8. Recomendación de leveo | Quitar la frase «para subir de nivel, Escarcha» | Fuera de Aprende. En Inicio esa frase era la respuesta a «¿Cuál es la mejor rama para subir de nivel?», así que quité la pregunta entera | `ff1146f` |

La build de Escarcha sigue presentándose como «la más segura para subir en solitario» (`builds.json`). Es una ventaja de esa build, no una recomendación general de rama, y no la he tocado.

## 4. Lo que detecté y decidí no tocar

| Qué | Por qué |
| --- | --- |
| 3 comentarios TODO en `mage-water.mdx` (ES y EN) | No se ven, coinciden con los avisos «Pendiente» y `validate` los recuerda. Son tareas reales para cuando juegues esos niveles |
| `BuildPicker`, `LevelingStatus`, `ProfessionPairs` y `Priority` | Ninguna página los usa, pero los validadores y las pruebas sí los citan. Borrarlos es una limpieza aparte, con sus pruebas |
| Descripciones de 18 páginas de builds (de 179 a 243 caracteres, el límite es 170) | Son también el texto visible bajo el título y salen de `summary`, un campo trazado. Google las recorta sin más daño |
| Títulos de 70 a 76 caracteres en el navegador | `seoTitle` cumple los 60; el resto es « \| Sheep Happens» |
| PvP y PvE en los títulos de búsqueda en español | Son las palabras que se buscan. El texto de la página usa JcJ y JcE |
| «pull» y «tirón» | Se entienden los dos y ahora ambos tienen definición. Unificarlos reescribiría texto correcto |
| «perk» y «Talented» en notas de `sources.json` y entradas antiguas del historial | Describen esas fuentes o aquel momento |
| «PvE» en tu historia de Sobre mí | Es tu voz, no un texto de guía |
| «poder con hechizos» en Blood Fury (`races.json` y `race-picks.json`) | Es el texto del cliente, y «un 10 % más de daño de hechizos» significaría otra cosa: la racial aumenta la bonificación, no el daño que haces |
| «Frost spell power» en la ficha inglesa de Barrera de hielo (`changes.json`) | Es un campo trazado y cambiarlo pediría otra entrada en el historial solo por una palabra. En español ya dice «daño de hechizos» |
| «efectos de escalofrío» en los tooltips de Mordiescarcha, Escarcha permanente y Ventisca mejorada | Es el texto del cliente, que `npm run talents:text` vuelve a traer. El propio cliente usa «enfriamiento» en Dedos de Escarcha. El glosario define las dos formas |
| Unos 330 colores fijos en Inicio, Sobre mí y los árboles de talentos | Son escenas con tema oscuro fijo: forman parte de la identidad visual |
| CSS único de 182 KB, Cambios con 390 KB de HTML y un vídeo de 3,3 MB en Sobre mí | No rompen nada y reducirlos exige cambiar cómo se empaqueta el sitio |
| Enlaces de 23 px de alto, anclas de encabezado de 21×22 y casillas de 20×20 | Rozan el mínimo de 24 px en sitios donde hay margen alrededor. Agrandarlos cambia la densidad de la página |
| Controles atenuados con poco contraste (hechizos sin aprender, escena de Sobre mí) | Son estados desactivados o de transición, que WCAG no exige |
| `.welcome` a 100vw con `overflow-x: clip` en Inicio y Sobre mí | Es deliberado y no genera barra lateral. El libro sobresale 34 px a 1280, pero no se ve cortado |
| `AbortError: Transition was skipped` en consola | Es ruido de `@view-transition` cuando la pestaña está oculta, no un fallo de la web |
| Carpeta `img/` sin seguimiento (más de 100 MB) | Es material en bruto tuyo. No la he añadido a ningún commit |
| 3 worktrees antiguos en `.claude/worktrees` y un `astro preview` de otra sesión | No son míos y no los necesitaba |
| `docs/audit.md` y otros documentos fechados | Son un registro histórico de su momento |
