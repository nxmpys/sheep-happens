# Inventario: referencias a la beta en builds y guías

> 2026-10-26 · **Aplicado** con las propuestas por defecto: regla 1 (a), `gameVersion` sin cambiar hasta el lanzamiento, solo los menús Builds y Guías, y quitado el dato del vídeo de 1600 de experiencia. El callout de `builds.mdx` desapareció al rehacer el índice. Pendiente: `professions.json:647,760` siguen diciendo «datos de la beta» porque cambiarlo obliga a subir su `updated` y añadir una entrada al historial; las páginas de Aprende y Herramientas no se han tocado.
>
> Líneas del archivo `es`; el `en` tiene la misma frase en la misma línea (salvo `races`, una línea antes).

Leyenda de la propuesta:

- **Quitar**: la parte de beta desaparece y no hace falta nada a cambio.
- **Reescribir**: se quita la parte de beta y se conserva lo vigente (texto propuesto entre comillas).
- **Regla N**: depende de una decisión general (abajo).
- **DECIDIR**: no está claro qué es vigente o es contenido solo de beta; lo decides tú.

## Decisiones generales

1. **Números que solo vienen del cliente de la beta** (Cono de frío 40 % 6 s, Ventisca 320 de maná, +175 % de Explosión Arcana, +5 % de experiencia de la comida…). Opciones: (a) dejar la cifra, quitar «en la beta» y conservar su insignia «Comunidad»; (b) quitar la cifra hasta que el lanzamiento la confirme. Propongo **(a)**.
2. **`gameVersion: forever-beta-2026-10`** en el frontmatter de todas las páginas (y en `builds.json`, línea 296): pinta «Puede cambiar» en la cabecera (`PageMeta.astro`) y «Hecha para: Beta oct 2026» en la ficha. Quitarlo exige crear la versión `forever-launch` (plan del roadmap, sección 2). Antes del 4 de noviembre esa versión no existe. **DECIDIR**: crearla ya o esperar al lanzamiento.
3. **Alcance**: entiendo por «builds y guías» el menú Builds (builds, leveo, por nivel, farmeo AoE) y el menú Guías (guías, razas, profesiones, misiones de clase, biblioteca, pergaminos, JcJ). Las páginas de Aprende y Herramientas están en una lista aparte al final. **DECIDIR** si entran.

## Builds

| Archivo:línea | Fragmento | Propuesta |
|---|---|---|
| `builds.mdx:27-29` | Callout «Builds de la beta»: «…se han hecho con la beta, que no pasa del nivel 30… Las de mazmorras, banda y JcJ llegarán cuando se puedan probar a nivel 60» | Reescribir: «Ahora mismo me centro en el leveo. Las de mazmorras, banda y JcJ llegarán cuando se puedan probar a nivel 60, y solo en las ramas que tengan sentido.» (La parte 2 rehace esta página de todos modos.) |
| `builds.mdx:54` | «Sus descripciones y cifras vienen del cliente de la beta: son una pista…» | Reescribir: «…vienen del cliente de Forever: son una pista, no un dato confirmado.» |
| `builds.json:296` | `"gameVersion": "forever-beta-2026-10"` | Regla 2 |
| `i18n/builds.ts:72,146` | Chip «BETA» de `BuildPicker` y `LevelingStatus` | Ya desaparece solo cuando las builds llegan al 60 (`levelingStatus().complete`). Con el cambio sin confirmar de `builds.json` (nivel 60) ya no se pinta. Quitar la clave si sobra. |
| `i18n/builds.ts:80,154` | `leveling.note`: «razonadas a partir de los datos de la beta… no probadas en el servidor» | Reescribir: «Las builds están razonadas a partir de las mecánicas oficiales y las guías de la comunidad, pero aún no las he probado en el servidor.» |
| `leveling.mdx:4,6` | Título y descripción «1 a 30 (BETA)» | Quitar «(BETA)». **DECIDIR** el rango: el cambio sin confirmar lleva la build al 60, pero el texto sigue hablando del 1 al 30 (ver línea 257). |
| `leveling.mdx:17` | Resumen «Guía BETA: cubre del 1 al 30, lo que permite la beta. Las builds están razonadas con datos de la beta, no probadas» | Reescribir: «Las builds están razonadas, no probadas en el servidor.» + el rango que decidas. |
| `leveling.mdx:58` | «Un hotfix de la beta visto el 20 de octubre lo quitó» | Reescribir: «**Hielo penetrante ya no existe.** Enfoque elemental da ahora un 2 % de golpe por rango…» (la historia queda en el historial). |
| `leveling.mdx:83` | «Los números siguen moviéndose en la beta: el 1 de octubre las misiones de mazmorra perdieron la mitad…» | Quitar esa frase; se queda lo vigente (la experiencia está en las misiones de mazmorra). |
| `leveling.mdx:95` | «en los datos de la beta, ralentiza un 40 % durante 6 s» | Regla 1 |
| `leveling.mdx:101` | «la Ventisca de rango 1 cuesta 320 de maná en la beta» | Regla 1 |
| `leveling.mdx:124`, `:201` | «niveles… de la lista del instructor de la beta» | Reescribir: «de la lista del instructor de Forever (calculadora de Wowhead)». |
| `leveling.mdx:226` | «en la beta, Blizzard ha dado los puntos a todos los jugadores» | Quitar (solo de la beta). |
| `leveling.mdx:251` | «encarece la siguiente un 175 % en los datos de la beta» | Regla 1 |
| `leveling.mdx:257` | «La beta no pasa del nivel 30, así que esta guía tampoco. La ampliaré al 60…» | **DECIDIR**: depende de si el tramo 31-60 ya está escrito (el cambio sin confirmar de `builds.json` sugiere que sí). |
| `leveling.mdx:262` | Pending `why`: «La beta no pasa del nivel 30… valores… de los datos de la beta» | Reescribir: «Aún no he probado las builds en el servidor. Los valores de los talentos y los niveles de los hechizos vienen del cliente, no de una fuente oficial.» |
| `aoe-farming.mdx:24-26` | Callout «Información de beta»: «…guías de la comunidad que han jugado la beta (niveles 1 a 30)…» | Reescribir: título «Sin medir todavía»; «Las rotaciones y las zonas salen de guías de la comunidad y de mi análisis. Nadie ha medido todavía si es más rápido que hacer misiones; lo probaré yo mismo.» |
| `aoe-farming.mdx:34` | «En los datos de la beta, ralentiza un 40 %…» | Regla 1 |
| `aoe-farming.mdx:44` | «según las guías que han jugado la beta» | Reescribir: «según las guías de la comunidad». |
| `aoe-farming.mdx:101` | «…nadie las ha probado en Forever: la beta llega al nivel 30» | Quitar «: la beta llega al nivel 30». |
| `aoe-farming.mdx:105` | «Es la zona de área que más se ha visto en la beta» | Reescribir: «Es la zona de área más citada por las guías de la comunidad». |
| `aoe-farming.mdx:107` | «Según un vídeo de la beta, cada tirón daba unos 1600 de experiencia a nivel 29» | **DECIDIR**: dato solo de beta. Propongo quitarlo. |
| `aoe-farming.mdx:143` | FAQ «En la beta, la más popular es la de las arañas…» | Reescribir: «La más popular es la de las arañas…». |
| `QuestionCards.astro:46` (inicio) | «Guía de leveo del 1 al 30 (BETA)» | Quitar «(BETA)»; rango como en `leveling:4`. |
| `talents.mdx:17` (Aprende) | «ya hay de leveo del 1 al 30 (BETA)» | Igual. |

## Guías

| Archivo:línea | Fragmento | Propuesta |
|---|---|---|
| `guides.mdx:16` | «con objetos y cifras de la beta» | Reescribir: «con objetos y cifras de Forever». |
| `pvp.mdx:36` | «Cambios de la beta que ya están en el juego: el tope de Honor pasó de 15.000 a 25.000… (8 de octubre)… (15 de octubre)» | Reescribir sin comparación ni fechas: «Tope de Honor de 25.000, equipo JcJ y lacres más caros, los críticos no se reducen en JcJ y las marcas se apilan hasta 30.» |
| `pvp.mdx:100` | «Los precios en Honor han cambiado varias veces en la beta (la última, un 50 % más caros)» | Reescribir: «Los precios en Honor pueden cambiar: mira el del intendente…» (se queda la cifra de ConquestCapped). |
| `pvp.mdx:120` | «No hay builds de JcJ todavía: la beta no pasa del nivel 30…» | Reescribir: «No hay builds de JcJ todavía: las publicaré cuando pueda probarlas a nivel 60.» |
| `races.mdx:19` | «con las raciales de la beta» | Quitar. |
| `races.mdx:37` | «según los datos de la beta… notas oficiales de la beta» | Reescribir: «según los datos del cliente de Forever… notas oficiales de Blizzard». |
| `races.mdx:55-56` | Pending: «siguen en revisión durante la beta… con cada build de la beta y tras el lanzamiento» | Reescribir: «Las raciales pueden cambiar y no hay nombres oficiales en español» / «Las revisaré con cada parche…». |
| `professions.mdx:36` | «mi lectura de los datos de la beta (nivel máximo 30)» | Reescribir: «mi lectura de los datos del cliente». |
| `professions.mdx:55` | «En los datos de la beta, +5 % de experiencia por muerte durante 15 minutos» | Regla 1 |
| `professions.mdx:126` | «Las cifras salen de la beta (cliente 1.60.1, nivel máximo 30): las recetas de nivel alto no se pueden probar…» | **DECIDIR**: toda la frase es una limitación de la beta. Propongo «Las recetas de nivel alto aún no las he probado y pueden cambiar.» |
| `professions.mdx:127` | «no tienen fuente en la base de datos de la beta» | Reescribir: «…en la base de datos de Forever». |
| `professions.mdx:133` | Pending `why`: «no se pueden probar en la beta» | Reescribir: «Aún no he probado las profesiones de nivel alto, y el equipo de bandas de Forever no se conoce.» |
| `professions.json:647,760` | «…en los datos de la beta» | Reescribir: «…en los datos del cliente». |
| `i18n/professions.ts:48,80` | «Objetos que lo respaldan (datos de la beta)» | Reescribir: «(datos del cliente)». |
| `class-quests.mdx:17` | Resumen «Datos de la beta: recompensas y pasos sacados del cliente de Forever; los revisaré tras el lanzamiento» | Reescribir: «Recompensas y pasos sacados del cliente de Forever.» |
| `scrolls.mdx:31` | «(datos de la beta)» | Quitar. |
| `scrolls.mdx:50`, `i18n/scrolls.ts:19`, `ScrollGuide.astro:38` (comentario) | «En el cliente en español de la beta aparece como «Entender pergamino»» | **DECIDIR**: el nombre en el cliente final no se conoce. Propongo «En el cliente en español aparece como…». |
| `scrolls.mdx:56` | «En los datos de la beta, los pergaminos sin descifrar no van ligados…» | Reescribir: «En los datos del cliente…». |
| `scrolls.json:167,183` | «Los datos de la beta llegan a 300…», «En los datos de la beta no van ligados» | Reescribir: «del cliente». |
| `library.mdx` | Solo `gameVersion` | Regla 2 |

## Aprende y Herramientas (fuera de alcance salvo que digas lo contrario)

- `guide.mdx:17` «Forever sigue en beta» · `:67` «las notas de la beta añaden más cada semana».
- `gear.mdx:90,97` Pending que cita el nivel 60 de la beta.
- `talents-arcane.mdx:48`, `talents-fire.mdx:47` «cliente / árbol de la beta».
- `legacy.mdx:30` «10 de oro en la beta» · `:50` «textos del cliente de la beta».
- `talent-calc.mdx:22-23` Callout «Valores de la beta».
- `tools.mdx:16,31,32,44,46,63` «cliente de la beta», «jugadores de la beta llegan al 100 %».
- `SpellTooltip.astro:33-34` «Puede cambiar durante la beta» (aparece en todas las páginas).

## Lo que no se toca

`changes.mdx` (explorador de cambios), `updates.mdx` (historial), `sources.mdx`, `changelog.json`, `changes.json`, `sources.json`, `watchlist.json`, `facts.json`, RSS, sitemap, menú, inicio y «Sobre mí».

## Aviso: cambios sin confirmar en el árbol

`git status` muestra trabajo sin confirmar sobre las builds: `builds.json` deja una sola build (`frost-leveling-solo`, ahora Pirofrío, `spec: "hybrid"`, nivel 60), se borran las de mazmorras y área, y se tocan `leveling.mdx`, `aoe-farming.mdx`, `changelog.json`, `glossary.json` y cinco tests. Este inventario y la parte 2 parten de ese estado; no lo he revertido.
