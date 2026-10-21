# Validación del contenido

> Revisión: 2026-10-11 (incluye la primera revisión semanal) · Versión de juego: `forever-beta-2026-10`

## Verificado (fuente oficial leída)

- [x] Forever es un producto oficial de Blizzard con base vanilla.
- [x] Mago: ramas Arcano, Fuego y Escarcha.
- [x] Lista completa de cambios del deep dive de Mago (base, Arcano, Fuego, Escarcha) → `src/data/changes.json`.
- [x] Talentos desde el nivel 10; hitos de 11, 16 (nuevo), 21 y 31 puntos.
- [x] Los talentos (incluidos los de Legado) se cambian en el instructor de clase de una capital.
- [x] Doble especialización a nivel 40.
- [x] Frostfire Bolt se aprende a nivel 40; ejemplo oficial: Ignite + Ice Shards → 200 % de crítico + 40 % como Ignite = 280 %.
- [x] **Nombres oficiales en español** de 45 hechizos y talentos (versión española del deep dive).
- [x] Cambios de las notas de desarrollo de la beta: Misiles Arcanos (línea de visión), Estela de Fuego (30 s), Calentamiento (antes Hot Streak, 20 s), Ignición sin doble beneficio, Comprensión (no en movimiento), Chamuscar mejorado y Escalofrío del invierno sin tirada de resistencia extra, penalización a rangos bajos, rangos bajos reajustados, Combustion con 3 cargas.
- [x] Intención de diseño de Explosión Arcana (usar otros hechizos tras acumular cargas) y motivo del nerf al farmeo (vendedores de oro y economía): oficiales.

## Reportado (comunidad o prensa, sin el original oficial leído)

- [ ] Nivel máximo de 60 "en el futuro previsible" (citado por varias fuentes).
- [ ] Versión del cliente: parche 1.60.1 (build 70338 el 10 oct), según wago.tools y Warcraft Wiki.
- [ ] Blizzard estudia adelantar la doble especialización (pódcast oficial, ep. 3, transcrito por Wowhead).
- [ ] Lanzamiento el 4 nov 2026 a las 15:00 PST; beta del 17 sep al 21/22 oct; nivel máximo de 30 en la beta desde el 1 oct.
- [ ] Razas de Mago: Humano, Gnomo, Skyborne, Orco, No-muerto, Trol.
- [ ] 51 puntos de talento a nivel 60.
- [ ] Sistema de Legado: 16 puntos gastables en el lanzamiento; el talento "Reagent Economy" elimina los componentes de vendedor.
- [ ] Legado: los puntos se ganan con desafíos de cuenta (por ejemplo, nivel 25, 45 y 60 con cada clase), así que el primer personaje del lanzamiento no tendrá Talented (Warcraft Tavern). Talented: primer punto a nivel 9 con 1 rango y a nivel 5 con 5.
- [ ] Valores de talentos y hechizos usados en la guía de leveo (calculadora de Wowhead, datos de la beta 2026-10-14): Improved Frostbolt −0,1 s por rango; Frostbite 5/10/15 %, congela 5 s; Ice Shards +20 % de bonificación de crítico por rango; Piercing Ice +2 % por rango; Canalización de Escarcha −5 % de maná y −10 % de amenaza por rango; Trizar +17/33/50 % de crítico contra congelados; Dedos de Escarcha 15 %, 1/2 cargas, 15 s; Ventisca mejorada 15/25/40 % durante 1,5 s; Escarcha permanente +11/22/33 % de duración y −3/7/10 % de velocidad; Nova de Escarcha 25 s de reutilización y hasta 8 s de congelación; Cono de frío 40 % durante 6 s; Ventisca de rango 1, 320 de maná; Lanza de hielo de rango 1, 28-32 de daño.
- [ ] Niveles de los hechizos del 1 al 30 según la lista del instructor de la beta (calculadora de Wowhead), coincidentes con Method y con Classic. Lanza de hielo de rango 2 se entrena a nivel 28.
- [ ] Comprensión, según Warcraft Tavern: se aprende a nivel 6 y, si fallas al descifrar, te conviertes en oveja. Investigar se gana entregando libros al bibliotecario y Estudiar da un Montón de pergaminos cada hora en una biblioteca.
- [ ] Comprensión, datos del cliente de la beta (Wowhead, 2026-10-15): Comprender pergamino tarda 5 s y no cuesta maná; los pergaminos sin descifrar piden Comprensión 1, 15, 50 o 175 (niveles de objeto 10, 20, 30 y 50) y dejan de dar puntos en 30, 75, 200 y 300; el Pergamino de Comprensión da +15 durante 1 hora; Estudiar tiene 1 hora de reutilización y gasta una Pluma ligera. Se publican como «Análisis» en la página Pergaminos.
- [ ] Farmeo AoE (Conquest Capped y forg.gg, 2026-10-15): rotación corta desde el nivel 14 para grupos de 3 a 7; una Ventisca completa por grupo con el maná de los niveles 22 a 30; arañas Gloomrise de Mulgore (27-29, Horda, desde el 23, ~1600 de experiencia por tirón a nivel 29); Toque de la tumba puede romper la Nova de Escarcha. Concentración Arcana: ¿una tirada por objetivo alcanzado en Forever? Se publican como «Comunidad» o «Análisis» en la página Farmeo AoE.
- [ ] Experiencia de mazmorras: mucha menos por matar y mucha más por las misiones (entrevista a Kris Zierhut, vía Icy Veins). Los ajustes del 1 y el 8 de octubre sí están en las notas oficiales.

## Discrepancias abiertas

| Tema | Fuente A | Fuente B | Decisión |
|---|---|---|---|
| Fin de la beta | 21 oct (LFCarry, "último día completo") | 22 oct (imagen de la hoja de ruta de Blizzard, según LFCarry) | Resuelto el 2026-10-21: Blizzard anuncia el cierre el 23 oct a las 10:00 PDT (`blizzard-stress-test`) |
| Límite de nivel inicial de la beta | 20 hasta el 1 oct | Una fuente indica 30 desde el inicio | Se usa 20 → 30 (dos fuentes) |
| Doble especialización | Deep dive oficial: nivel 40 | Zockify: "no anunciada oficialmente" (página anterior al deep dive) | Se da por buena la fuente oficial, más reciente |
| "Magic Attunement" | Oficial: pasa a ser habilidad base | Zockify: aparece como "eliminado" | Ambas son compatibles: deja de ser talento. Se usa la redacción oficial |
| Requisito de Fingers of Frost | Texto oficial: «Pre-requisite of Ice Lance» | Ice Lance es hito de 11 (fila 3) y Fingers of Frost está en la fila 5: no puede ser requisito de Ice Lance | Se muestra la redacción oficial y la lectura coherente («FoF requiere Ice Lance»), marcada como pendiente |
| Versión de cliente | "1.60.1 beta" (Seemeta) | "build 69913" (Guildorder, antigua) | Resuelto: se publica «1.60.1, build 70338» como dato de la comunidad (wago.tools + Warcraft Wiki) |
| Nivel de la doble especialización | Deep dive: nivel 40 | Pódcast: «currently 40», estudian adelantarlo | Se muestra «40 por ahora» con el aviso |
| Ventisca mejorada en las guías de área | Oficial y calculadora: ralentiza como máximo un 40 % | WoW Forever Builds (guía de área 22-60): 65 %, el valor de Classic | Se usa el 40 %. No seguimos esa guía para la build de área |
| Nombre en español de *Comprehend Scroll* | Artículo de Blizzard en español: «Comprender pergamino» | Cliente en español de la beta (Wowhead): «Entender pergamino» | Se usa el nombre oficial del artículo y se avisa del nombre del cliente en la página Pergaminos |
| Reutilización de Estudiar (Montón de pergaminos) | Wowhead, guía de libros (5 oct): un día | Datos del cliente (Wowhead) y Warcraft Tavern: 1 hora | Se usa 1 hora (datos del cliente, más recientes) |
| Build de leveo de Escarcha a nivel 30 | Icy Veins: Enfoque elemental 2 y Ventisca mejorada 1; Mobalytics (Escarcha): Enfoque elemental 2 y Bloqueo de hielo | Mobalytics (leveo): Frostbite 2 y Ventisca mejorada 1; WoW Forever Builds: Enfoque elemental 5 y Canalización de Escarcha, sin Improved Frostbolt | Núcleo común (Improved Frostbolt, Frostbite, Ice Shards, Lanza de hielo, Trizar, Dedos de Escarcha) + Piercing Ice 3/3. Comparativa en la guía de leveo |

## Pendiente (no publicar como hecho)

- [ ] Valores numéricos: daño, coste y probabilidad de Arcane Blast, Ice Lance, Frostfire Bolt, Missile Barrage, Heating Up, Fingers of Frost.
  - Un extracto de Zockify menciona "95 to 104 Arcane damage" para Arcane Blast, pero la página consultada no lo muestra → **no se usa**.
- [ ] Niveles en los que se aprenden las habilidades base (salvo Frostfire Bolt, 40).
- [ ] Builds de nivelación probadas en el servidor (las del 1 al 30 están razonadas, no probadas; la de área es experimental) y builds de nivel 60.
- [ ] Prioridad de estadísticas y valor del índice de golpe con los nuevos Arcane Focus y Elemental Precision.
- [ ] Equipo, consumibles, encantamientos, profesiones.
- [ ] Mazmorras, raids y PvP de Forever.
- [ ] Formato de importación o exportación de talentos.
- [ ] Nombres oficiales en español de los hechizos **no** citados en el deep dive (Blink, Evocation, Flamestrike, Combustion, Ice Barrier…): se muestran en inglés.
- [ ] Errores conocidos de la beta con Comprensión (Known Issues de las notas de desarrollo): el Pergamino de Pasaje liminal no funciona bien y algunos Magos que aprenden Investigar no pueden abrirlo. No se mencionan en la página Pergaminos; comprobar si siguen al lanzar.
- [ ] Error conocido de la beta: recibir daño al canalizar Misiles Arcanos dispara un misil con el daño completo (Known Issues, 8 oct). No es un cambio de diseño.
- [ ] Recompensas de Comprensión (Comprehend Scroll): no hay una lista completa. Solo ejemplos de Warcraft Tavern (Pergamino de espíritu, de imbuir escarcha, de familiar rata) y el contenido del Montón de pergaminos de Estudiar (Wowhead). Tampoco se saben el máximo de la habilidad, la probabilidad de fallo o de botín, ni si se pueden comerciar.

## Lista de revisión tras el lanzamiento (4 nov 2026)

1. Leer las notas del parche de lanzamiento y añadirlas a `sources.json`.
2. Revisar cada entrada de `changes.json`: ¿sigue vigente? Actualizar `status` y `reviewed`.
3. Crear la versión de juego `forever-launch` en `game-versions.json` y apuntar las páginas revisadas a ella.
4. Comprobar en el juego los niveles de aprendizaje y las interacciones clave (Ice Lance contra objetivos congelados, Heating Up, apilamiento de Arcane Blast) → `tested`.
5. Desbloquear las secciones pendientes a medida que haya datos.
6. Quitar o reescribir todo lo que sea de la beta, según la sección 2 de [content-roadmap.md](content-roadmap.md).
