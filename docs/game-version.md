# Versión de juego: World of Warcraft: Forever

> Última revisión: **2026-11-06** · Estado del juego en esa fecha: **WoW Forever salió el 4 de noviembre de 2026** con el cliente 1.60.1.70790.
> Cada afirmación indica su nivel de fiabilidad (ver [content-sources.md](content-sources.md)).

## Identificación

| Dato | Valor | Fiabilidad |
|---|---|---|
| Qué es | Producto **oficial de Blizzard**, no un servidor privado. Es una tercera forma de jugar a WoW, junto a Retail y Classic. | Oficial (anuncio en la BlizzCon 2026 y noticias de Blizzard) |
| Base | Azeroth de la **época vanilla** (primer año de WoW, 2004), construida sobre WoW Classic. | Comunidad (varias fuentes coinciden) |
| Nivel máximo | **60**, "en el futuro previsible"; el contenido nuevo se añade de forma horizontal en todos los rangos de nivel. | Oficial, citado por terceros |
| Versión de cliente | **Parche 1.60.1**, build 70790 en el lanzamiento (4 nov de 2026). Blizzard no publica el número. | Comunidad (wago.tools + ForeverChanges) |
| Beta | Del 17 de septiembre al 23 de octubre de 2026 (cierre a las 10:00 PDT; el 21 hubo una prueba de estrés). Nivel máximo 20 al inicio y **30 desde la build del 1 de octubre**. | Oficial, citado por terceros (cuenta @Warcraft_Official y foros de Blizzard) |
| Lanzamiento | **4 de noviembre de 2026**, 15:00 PST (23:00 UTC). Notas de Blizzard para el lanzamiento: 2 de noviembre, ampliadas el 4. Primeros hotfixes: 5 de noviembre. Bandas: 9 de diciembre. | Oficial |
| Modos de juego | Se elige un conjunto de reglas (PvE, PvP, rol) en lugar de un reino; el modo Hardcore llegará más adelante. | Comunidad |

## Sistemas que afectan a la guía del Mago

| Sistema | Qué se sabe | Fiabilidad |
|---|---|---|
| Talentos | Disponibles **desde el nivel 10**, 1 punto por nivel → **51 puntos** a nivel 60. Tres árboles: **Arcano, Fuego y Escarcha**. | Oficial (nivel 10) / comunidad (51 puntos) |
| Talentos decisivos ("gold medal") | Talentos de 1 punto con **11, 21 y 31 puntos** invertidos, más uno **nuevo de 16 puntos**. | Oficial |
| Cambio de talentos | En el instructor de clase de una capital (incluidos los talentos de Legado). | Oficial |
| Doble especialización | Disponible **a nivel 40** por ahora; en el pódcast oficial (ep. 3) dicen que estudian adelantarla (se mencionó el 30). Coste no publicado. | Oficial (deep dive) + declaración en pódcast |
| Rangos de hechizos | Los rangos muy inferiores a tu nivel reciben menos daño de hechizos y activan menos los talentos (build del 1 oct). | Oficial (notas de desarrollo) |
| Sistema de Legado | Puntos a nivel de cuenta que se gastan por personaje en tres árboles (Profesiones, Aventura, Ingenio). Límite de 16 puntos en el lanzamiento. No modifica el árbol de clase. | Comunidad (detalles de beta) |
| Comprensión (Mago) | Nueva habilidad menor exclusiva del Mago para descifrar pergaminos que sueltan las criaturas (*Comprehend Scroll*). Recompensas sin detallar. | Oficial |
| Razas de Mago | Humano, Gnomo, Skyborne (nueva), **Orco (nuevo)**, No-muerto, Trol. | Comunidad (varias fuentes) |
| Roles | Las tres ramas son de daño a distancia. | Comunidad |

## Cambios oficiales del Mago

La lista completa y estructurada está en `src/data/changes.json` (fuente: deep dive oficial de Mago y Chamán, octubre de 2026). Resumen:

- **Base:** Frostfire Bolt (nivel 40, Fuego + Escarcha), Comprensión, Cone of Cold con menor duración (medida contra el *farmeo*), Mage Armor regenera más maná.
- **Arcano:** nuevo Arcane Blast (decisivo de 11), Arcane Wrath (decisivo de 16 desde el 15 de octubre), Missile Barrage en la fila 2, nuevo Arcane Geometry, Arcane Impact y Arcane Mind rediseñados, Magic Attunement pasa a ser habilidad base.
- **Fuego:** nuevo Heating Up (Pyroblast más rápido), Wake of Fire, Incineration, Ignite individual por Mago, Blast Wave ya no requiere Pyroblast.
- **Escarcha:** nuevo Ice Lance (decisivo de 11), nuevo Fingers of Frost, Ice Block (decisivo de 16), Cold Snap (decisivo de 21, 10 min de reutilización), Improved Blizzard ralentiza menos.

## Cambios antes del lanzamiento y notas de lanzamiento

Las builds del 24 sep, 1, 8, 15 y 28 oct ajustaron el Mago durante la beta; las notas de Blizzard para el lanzamiento (2 de noviembre, ampliadas el 4) confirman el estado final: Tromba de misiles en la fila 2 y gastada al empezar a canalizar, Resiliencia Arcana a 3 rangos, Explosión Arcana al 12 % del Intelecto, Accelerant, Incineración a 5 puntos, Masa crítica a 3, Precision con golpe para todos los hechizos, adiós a Enfoque Arcano, Hielo penetrante y Frost Blast, Barrera de hielo con +15 % de daño de Escarcha, Lanza de hielo con 8 s compartidos con Explosión de Fuego y Escalofrío del invierno al 20 %. Corrigen además Concentración Arcana con Misiles Arcanos e Ignición con Fogonazo. La historia completa está en el historial (`CHANGELOG.md`) y el estado actual en `src/data/changes.json`.

## Qué **no** se puede afirmar todavía

- Valores numéricos oficiales de casi todos los talentos y hechizos nuevos: las cifras salen del cliente.
- Prioridades de estadísticas, mejor equipo de nivel 60, bandas (abren el 9 de diciembre) y builds probadas a nivel 60.
- El precio de cada visita al instructor (Blizzard solo da el total: 206-207 de oro del 1 al 60).
- Los nombres oficiales en español de los hechizos que el deep dive no menciona (se usan los del cliente).

## Consecuencias para el producto

1. Todo el contenido lleva la versión `forever-launch-2026-11` (parche 1.60.1). La versión de la beta ya no existe.
2. Solo se publica como **verificado** lo que procede de Blizzard. Las cifras del cliente se marcan como **comunidad**, las interpretaciones como **análisis** y los datos de Classic como **referencia Classic**.
3. El equipo de nivel 60 y las builds de JcJ y banda siguen **pendientes** hasta poder probarlos; las builds de leveo están publicadas y marcadas como sin probar.
4. Cada parche o hotfix se revisa según [maintenance.md](maintenance.md); Blizzard no prevé grandes ajustes hasta la apertura de las bandas y sí un gran repaso cuando haya datos de jugadores por encima del nivel 30.
