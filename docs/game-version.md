# Versión de juego: World of Warcraft: Forever

> Última revisión: **2026-10-11** · Estado del juego en esa fecha: **beta cerrada** (lanzamiento previsto el 4 de noviembre de 2026).
> Cada afirmación indica su nivel de fiabilidad (ver [content-sources.md](content-sources.md)).

## Identificación

| Dato | Valor | Fiabilidad |
|---|---|---|
| Qué es | Producto **oficial de Blizzard**, no un servidor privado. Es una tercera forma de jugar a WoW, junto a Retail y Classic. | Oficial (anuncio en la BlizzCon 2026 y noticias de Blizzard) |
| Base | Azeroth de la **época vanilla** (primer año de WoW, 2004), construida sobre WoW Classic. | Comunidad (varias fuentes coinciden) |
| Nivel máximo | **60**, "en el futuro previsible"; el contenido nuevo se añade de forma horizontal en todos los rangos de nivel. | Oficial (aviso de Blizzard del 29 oct) |
| Versión de cliente | **Parche 1.60.1** (build 70338 de la beta el 10 oct de 2026). Blizzard no publica el número. | Comunidad (wago.tools + Warcraft Wiki) |
| Beta | Del 17 de septiembre al 23 de octubre de 2026 (cierre a las 10:00 PDT; el 21 hay una prueba de estrés). Nivel máximo 20 al inicio y **30 desde la build del 1 de octubre**. | Oficial, citado por terceros (cuenta @Warcraft_Official y foros de Blizzard) |
| Lanzamiento | **4 de noviembre de 2026**, 15:00 PST (23:00 UTC). Reserva de nombres del 27 de octubre al 3 de noviembre. | Oficial (aviso de Blizzard del 29 oct) |
| Modos de juego | Se elige un conjunto de reglas (PvE, PvP, rol) en lugar de un reino; el modo Hardcore llegará más adelante. | Comunidad |

## Sistemas que afectan a la guía del Mago

| Sistema | Qué se sabe | Fiabilidad |
|---|---|---|
| Talentos | Disponibles **desde el nivel 10**, 1 punto por nivel → **51 puntos** a nivel 60. Tres árboles: **Arcano, Fuego y Escarcha**. | Oficial (nivel 10) / comunidad (51 puntos) |
| Talentos de hito ("gold medal") | Talentos de 1 punto con **11, 21 y 31 puntos** invertidos, más un **nuevo hito de 16 puntos**. | Oficial |
| Cambio de talentos | En el instructor de clase de una capital (incluidos los talentos de Legado). | Oficial |
| Doble especialización | Disponible **a nivel 40** por ahora; en el pódcast oficial (ep. 3) dicen que estudian adelantarla (se mencionó el 30). Coste no publicado. | Oficial (deep dive) + declaración en pódcast |
| Rangos de hechizos | Los rangos muy inferiores a tu nivel reciben menos daño de hechizos y activan menos los talentos (build del 1 oct). | Oficial (notas de desarrollo) |
| Sistema de Legado | Puntos a nivel de cuenta que se gastan por personaje en tres árboles (Profesiones, Aventura, Recursos). Límite de 16 puntos en el lanzamiento. No modifica el árbol de clase. | Comunidad (detalles de beta) |
| Comprensión (Mago) | Nueva habilidad menor exclusiva del Mago para descifrar pergaminos que sueltan las criaturas (*Comprehend Scroll*). Recompensas sin detallar. | Oficial |
| Razas de Mago | Humano, Gnomo, Skyborne (nueva), **Orco (nuevo)**, No-muerto, Trol. | Comunidad (varias fuentes) |
| Roles | Las tres ramas son de daño a distancia. | Comunidad |

## Cambios oficiales del Mago

La lista completa y estructurada está en `src/data/changes.json` (fuente: deep dive oficial de Mago y Chamán, octubre de 2026). Resumen:

- **Base:** Frostfire Bolt (nivel 40, Fuego + Escarcha), Comprensión, Cone of Cold con menor duración (medida contra el *farmeo*), Mage Armor regenera más maná.
- **Arcano:** nuevo Arcane Blast (hito de 11), nuevo Missile Barrage (hito de 16), nuevo Arcane Geometry, Arcane Impact y Arcane Mind rediseñados, Magic Attunement pasa a ser habilidad base.
- **Fuego:** nuevo Heating Up (Pyroblast más rápido), Wake of Fire, Incineration, Ignite individual por Mago, Blast Wave ya no requiere Pyroblast.
- **Escarcha:** nuevo Ice Lance (hito de 11), nuevo Fingers of Frost, Ice Block (hito de 16), Cold Snap (hito de 21, 10 min de enfriamiento), Improved Blizzard ralentiza menos.

## Cambios posteriores (notas de desarrollo de la beta)

Las builds del 24 sep, 1 oct y 8 oct ajustaron Misiles Arcanos, Estela de Fuego, Calentamiento (antes Hot Streak), Ignición, Comprensión, Chamuscar mejorado, Escalofrío del invierno, Combustion y los rangos bajos. Detalle en el historial (`CHANGELOG.md`) y en `src/data/changes.json`.

## Qué **no** se puede afirmar todavía

- Valores numéricos de casi todos los talentos y hechizos nuevos (daño, coste de maná, probabilidades).
- Contenido de los niveles 31 a 60: no se puede probar en la beta.
- Prioridades de estadísticas, equipo recomendado, raids, mazmorras de nivel máximo o builds óptimas.
- Si existe un formato de importación o exportación de talentos.
- Los nombres oficiales en español de los hechizos que el deep dive no menciona.

## Consecuencias para el producto

1. Todo el contenido lleva la versión `forever-beta-2026-10` y el aviso "beta, sujeto a cambios".
2. Solo se publica como **verificado** lo que procede de Blizzard. Las interpretaciones de mecánicas se marcan como **análisis** y los datos de Classic como **referencia Classic**.
3. Las secciones de equipo, builds de nivel máximo, PvE y PvP quedan como **pendientes** hasta el lanzamiento.
4. Tras el 4 de noviembre hay que hacer una **revisión completa** (ver la lista de tareas en [content-validation.md](content-validation.md)).
