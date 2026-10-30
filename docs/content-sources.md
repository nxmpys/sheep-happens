# Fuentes de contenido y niveles de fiabilidad

> El registro canónico de **fuentes citadas** está en `src/data/sources.json`; el de **fuentes vigiladas cada semana**, en `src/data/watchlist.json` (ver [maintenance.md](maintenance.md)). Este documento explica los criterios. Si añades una fuente, añádela allí. Si cambias un criterio, cámbialo aquí.

## 1. Tipos de fuente (`kind`)

| `kind` | Qué es | Ejemplos | Uso permitido |
|---|---|---|---|
| `official` | Publicado por Blizzard: noticias, foros oficiales, notas del parche, cuentas oficiales | Deep dive de clases de Forever | Base de todo lo **verificado** |
| `press` | Medios que informan de declaraciones oficiales | Massively OP, Mein-MMO | Fechas y contexto. Si citan a Blizzard, se busca el original |
| `community` | Guías y bases de datos de la comunidad específicas de Forever | Warcraft Tavern, Icy Veins, Zockify | Datos **reportados**; se contrastan con al menos 2 fuentes |
| `tool` | Calculadoras de talentos con datos extraídos de la beta | Seemeta, Guildorder | Indicios (nº de puntos, estructura). No se usan como verdad final |
| `classic-reference` | Datos de WoW Classic Era | Base de datos de Classic | Solo para lo que Forever **no ha cambiado oficialmente**. Siempre con la etiqueta "Referencia Classic" |

## 2. Estado de cada afirmación (`status`)

| `status` | Etiqueta en la web | Criterio |
|---|---|---|
| `verified` | **Oficial** | Aparece en una fuente `official` que hemos leído. |
| `reported` | **Comunidad** | Aparece en fuentes `community` o `press`, pero no hemos leído el original oficial. |
| `classic` | **Referencia Classic** | Comportamiento de Classic Era; Forever no ha anunciado cambios. Pendiente de comprobar en el juego. |
| `analysis` | **Análisis** | Deducción nuestra a partir de mecánicas verificadas. No se ha probado en el juego. |
| `tested` | **Probado en juego** | Comprobado en el juego por quien revisa la guía, con fecha y versión. |
| `pending` | **Pendiente** | No se sabe. Se muestra como estado vacío y nunca se rellena con suposiciones. |

**Reglas:**
1. Nunca se usan datos de Retail, de TBC/WotLK o de Season of Discovery como fuente de Forever, aunque una habilidad tenga el mismo nombre (p. ej., Ice Lance o Arcane Blast existen en otras versiones con otros valores).
2. Si dos fuentes discrepan, la afirmación pasa a `reported` y la discrepancia se anota en [content-validation.md](content-validation.md).
3. Las fuentes `tool` no bastan por sí solas para marcar nada como `reported`.

## 3. Fuentes consultadas (2026-10-11)

| ID | Fuente | Tipo | Qué respalda | Limitaciones |
|---|---|---|---|---|
| `blizzard-deep-dive-mage` | [Blizzard — WoW: Forever Class Deep Dives: Mage & Shaman](https://news.blizzard.com/en-us/article/24302097/) (7 oct 2026) | official | Todos los cambios de habilidades y talentos del Mago; talentos desde el nivel 10; talentos decisivos de 11/16/21/31 puntos; cambio de talentos en el instructor; doble especialización a nivel 40 | Beta: "puede seguir evolucionando". Casi sin valores numéricos |
| `blizzard-deep-dive-mage-es` | [Blizzard — Repaso a fondo de las clases mago y chamán](https://worldofwarcraft.blizzard.com/es-es/news/24302097) | official | **Nombres oficiales en español** de hechizos y talentos; terminología («talento decisivo», «enfriamiento») | Misma información que la versión inglesa |
| `blizzard-dev-notes` | [Blizzard — WoW Forever Beta Development Notes](https://us.forums.blizzard.com/en/wow/t/2360696) | official | Cambios de cada build de la beta (24 sep, 1 oct, 8 oct de 2026) | Hilo de la beta; tras el lanzamiento habrá notas de parche |
| `wowhead-dual-spec-podcast` | [Wowhead — Possible change to Dual Spec unlock level](https://www.wowhead.com/news=383320/blizzard-teases-possible-change-to-unlock-level-of-dual-spec-in-wow-forever) | press | Transcripción del pódcast oficial: doble especialización «actualmente» a nivel 40, posible adelanto | Declaración, no un cambio confirmado |
| `wago-tools-builds` | [wago.tools — builds](https://wago.tools/builds) | tool | Builds del cliente de Forever (1.60.1.70338 el 10 oct) | Datos extraídos |
| `warcraft-wiki-forever` | [Warcraft Wiki — World of Warcraft: Forever](https://warcraft.wiki.gg/wiki/World_of_Warcraft:_Forever) | community | Parche 1.60 / 1.60.1 = Forever | Wiki comunitaria |
| `warcrafttavern-mage-deep-dive` | [Warcraft Tavern — Scrolls & Totems: Mage & Shaman Deep Dive](https://www.warcrafttavern.com/forever/news/scrolls-totems-mage-shaman-deep-dive-for-wow-forever/) | community | Resumen del deep dive (7 oct 2026); coincide con el original | Fuente secundaria |
| `icyveins-mage-deep-dive` | [Icy Veins — Stronger Identity, Mixed Schools for Mage](https://www.icy-veins.com/wow-forever/news/stronger-identity-mixed-schools-for-mage-better-totems-for-shamans-wow-forever-class-deep-dives/) | community | Ice Lance y Frostfire Bolt como herramientas nuevas | Bloquea las peticiones automáticas (403); solo se ha leído el extracto del buscador |
| `massivelyop-class-series` | [Massively OP — Forever class series: Hunter, Mage, Paladin](https://massivelyop.com/2026/10/05/world-of-warcraft-forevers-class-series-continues-with-the-hunter-mage-and-paladin/) | press | Fecha de publicación de la serie (≈5 oct 2026) | Resumen periodístico |
| `warcrafttavern-classes` | [Warcraft Tavern — Classes, Specializations & Roles](https://www.warcrafttavern.com/forever/guides/classes/) | community | Razas que pueden ser Mago; roles | Sin fecha explícita |
| `zockify-mage` | [Zockify — WoW Forever Mage](https://www.zockify.com/forever/mage/) | community | Orco y Skyborne como Magos; lista de talentos nuevos y eliminados | Algunos datos proceden de la demo de la BlizzCon; actualizado el 15 sep 2026 |
| `lfcarry-beta` | [LFCarry — WoW Forever Beta](https://lfcarry.com/guides/wow-forever-beta) | press | Fechas de la beta, nivel 20 → 30 (1 oct), lanzamiento el 4 nov a las 23:00 UTC | Web comercial; cita posts oficiales que no hemos abierto |
| `icyveins-beta-cap` | [Icy Veins — Beta starts at level 20, level 30 later](https://www.icy-veins.com/wow/news/the-wow-forever-beta-starts-at-level-20-level-30-after-couple-of-weeks/) | community | Límites de nivel de la beta | Solo extracto |
| `wowforever-level-cap` | [wowforever.co — Level Cap](https://wowforever.co/level-cap/) | community | Nivel 60 "en el futuro previsible" | Web no oficial |
| `warcrafttavern-legacy` | [Warcraft Tavern — Legacy System Overview](https://www.warcrafttavern.com/forever/guides/legacy/) | community | Sistema de Legado (16 puntos en el lanzamiento, árboles) | Detalles de beta |
| `seemeta-talents` | [Seemeta — WoW Forever Talent Calculator](https://seemeta.com/en/wow-forever/talent-calculator) | tool | 51 puntos (1 por nivel desde el 10); cita "1.60.1 beta" | Datos extraídos de la beta, no oficiales |

### Builds de mazmorras (consultadas el 2026-10-30)

| ID | Fuente | Tipo | Qué respalda | Limitaciones |
|---|---|---|---|---|
| `wowhead-mage-arcane-guide` | [Wowhead — Arcane Mage Rotation](https://www.wowhead.com/forever/guide/classes/mage/arcane/rotation-cooldowns-pve-dps) | community | Rotación de Arcano y de Arcano con Fuego | Guía de nivel 30; su rotación ya cuenta con los hechizos hasta el 60, sin probar a ese nivel |
| `wowhead-mage-fire-guide` | [Wowhead — Fire Mage Rotation](https://www.wowhead.com/forever/guide/classes/mage/fire/rotation-cooldowns-pve-dps) | community | Rotación de Fuego y de Pirofrío | Igual que la anterior |
| `wowhead-mage-frost-guide` | [Wowhead — Frost Mage Rotation](https://www.wowhead.com/forever/guide/classes/mage/frost/rotation-cooldowns-pve-dps) | community | Rotación de Escarcha | Lanza dos Lanzas de hielo por proc, algo que no cabe con la reutilización de 8 s del 28 oct; en la build está ajustado |

### Guía de leveo (consultadas el 2026-10-14)

| ID | Fuente | Tipo | Qué respalda | Limitaciones |
|---|---|---|---|---|
| `wowhead-forever-talent-calc` | [Wowhead — Mage Forever Talent Calculator](https://www.wowhead.com/forever/talent-calc/mage) | tool | Descripción de cada rango de talento y lista del instructor (niveles de los hechizos y rangos) | Datos del cliente de la beta, no oficiales; su aviso de «datos de la BlizzCon» está desfasado |
| `icyveins-forever-frost` | [Icy Veins — Forever Frost Mage Guide](https://www.icy-veins.com/wow-forever/frost-mage-ranged-dps-pve-guide) | community | Build de nivel 30, extras con Talented, prioridades, consejos de leveo | Teoría para la beta (1 oct) |
| `mobalytics-mage-leveling` | [Mobalytics — Mage Leveling Guide (1-30)](https://mobalytics.gg/wow-forever/classes/mage-leveling-guide) | community | Escarcha como rama de leveo; build 0/0/21 | Guía en curso |
| `mobalytics-frost` | [Mobalytics — Frost Mage Guide](https://mobalytics.gg/wow-forever/classes/frost-mage-guide) | community | Build con Bloqueo de hielo; mazmorras; área «viable con práctica» | Sin datos que respalden lo del área |
| `method-mage-leveling` | [Method — Mage Leveling Guide](https://www.method.gg/wow-forever/wow-forever-mage-leveling-guide-and-talents) | community | Escarcha para subir; hechizos por nivel | No se cargó su orden de talentos |
| `wowforeverbuilds-mage-leveling` | [WoW Forever Builds — Frost 1-30](https://wowforeverbuilds.com/guide/beta-20-frost-mage-leveling) | community | Orden de puntos alternativo | Teoría sin probar; su guía de área usa valores de Classic (descartada) |
| `icyveins-dungeon-xp` | [Icy Veins — Dungeon kill XP cut, quests more rewarding](https://www.icy-veins.com/wow/news/wow-forever-cuts-dungeon-kill-xp-but-makes-dungeon-quests-more-rewarding/) | community | Intención de diseño de la experiencia de mazmorras (entrevista a Kris Zierhut) | Cita una entrevista que no hemos leído |
| `icyveins-classic-frost-leveling` | [Icy Veins — Classic Single-Target Frost Leveling](https://www.icy-veins.com/wow-classic/single-target-frost-mage-leveling-talent-build-from-1-to-60) | classic-reference | Comparación con el orden de Classic | No describe Forever |
| `icyveins-classic-aoe-leveling` | [Icy Veins — Classic AoE Grinding Frost](https://icy-veins.com/wow-classic/aoe-grinding-frost-mage-leveling-talent-build-from-1-to-60) | classic-reference | Desde cuándo y cómo se farmeaba en área en Classic | Se basa en ralentizaciones que Forever ha reducido |

### Guía de profesiones (consultadas el 2026-10-14)

Las doce fuentes de la página de Profesiones (una oficial de Blizzard, la base de datos de Forever de Wowhead y guías de la comunidad), qué respalda cada una y lo que queda por verificar están en [professions-research.md](professions-research.md). Ninguna es una fuente de Classic.

### Guía de pergaminos (consultadas el 2026-10-15)

| ID | Fuente | Tipo | Qué respalda | Limitaciones |
|---|---|---|---|---|
| `wowhead-forever-comprehension` | [Wowhead — Comprehension (skill)](https://www.wowhead.com/forever/skill=3012/comprehension) | tool | Hechizos de Comprender pergamino (5 s, sin coste, nivel 6), habilidad que pide cada pergamino, criaturas que los sueltan, contenido del Montón de pergaminos, fichas de los pergaminos | Datos del cliente de la beta; no dice qué da cada pergamino al descifrarlo |
| `wowhead-library-books` | [Wowhead — Library Book Locations and Rewards](https://www.wowhead.com/forever/guide/library-book-locations-and-rewards) | community | Libros para el bibliotecario; Estudiar da un Montón de pergaminos en una biblioteca | Dice «un día» de reutilización; los datos del cliente dicen 1 hora |

También se releyeron `blizzard-deep-dive-mage` (y su versión en español), `blizzard-dev-notes` y `warcrafttavern-mage-guide`, que explica el fallo (te conviertes en oveja) y da ejemplos de recompensas.

### Guía de farmeo AoE (consultadas el 2026-10-15)

| ID | Fuente | Tipo | Qué respalda | Limitaciones |
|---|---|---|---|---|
| `conquestcapped-mage-leveling` | [Conquest Capped — WoW Forever Mage Leveling](https://conquestcapped.com/guides/wow-forever/wow-forever-mage-leveling/) | community | Rotación corta desde el nivel 14, rotación con Ventisca desde el 20, una Ventisca por grupo, zonas por nivel y consejos (Frostbite fuera, reiniciar si resisten la Nova, Toque de la tumba) | Dice que probó del 1 al 30 en la beta; las zonas del 30 al 60 son de Classic |
| `forg-mage-aoe-spiders` | [forg.gg — Skywatcher Plateau Spider Farm](https://forg.gg/en/forever/tips/mage-aoe-leveling) | community | Zona nueva de arañas Gloomrise (27-29) al noroeste de Cima del Trueno, coordenadas, cinco misiones desde el 23, ~1600 de experiencia por tirón | Sin autor ni fecha; se basa en un vídeo de la beta del 4 de octubre |
| `wiki-arcane-concentration` | [Warcraft Wiki — Arcane Concentration](https://warcraft.wiki.gg/wiki/Arcane_Concentration) | classic-reference | Texto de Classic: «después de que cualquier hechizo de daño alcance a un objetivo» | No dice expresamente que un hechizo de área tire una vez por objetivo |

Un vídeo de un creador de contenido sobre el Mago en la beta (transcripción en [video-guia-mago-notas.md](video-guia-mago-notas.md)) coincide con la rotación corta y con la zona de las arañas. No se cita porque no tenemos su enlace.

## 4. Fuentes descartadas

- **Wowhead Classic, Icy Veins Classic y guías de Classic Era o SoD:** son útiles como referencia de Classic, pero no describen Forever. Solo se usarían con `kind: classic-reference`.
- **Webs de "servidores privados" que aparecen en los buscadores:** son páginas SEO de baja calidad sin relación con Forever.
- **Wings Is Up:** referencia de UX, no de contenido (es Retail y Paladín).

## 5. Mantenimiento

- Cuando Blizzard publique las notas del parche de lanzamiento, se añadirán como nueva fuente `official` y se revisará cada `reported`.
- La fecha `accessed` de cada fuente en `sources.json` indica cuándo se leyó por última vez. Si una fuente cambia, se actualiza esa fecha y se revisan las afirmaciones que dependen de ella.
