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

## Discrepancias abiertas

| Tema | Fuente A | Fuente B | Decisión |
|---|---|---|---|
| Fin de la beta | 21 oct (LFCarry, "último día completo") | 22 oct (imagen de la hoja de ruta de Blizzard, según LFCarry) | Se muestra "21-22 oct" |
| Límite de nivel inicial de la beta | 20 hasta el 1 oct | Una fuente indica 30 desde el inicio | Se usa 20 → 30 (dos fuentes) |
| Doble especialización | Deep dive oficial: nivel 40 | Zockify: "no anunciada oficialmente" (página anterior al deep dive) | Se da por buena la fuente oficial, más reciente |
| "Magic Attunement" | Oficial: pasa a ser habilidad base | Zockify: aparece como "eliminado" | Ambas son compatibles: deja de ser talento. Se usa la redacción oficial |
| Requisito de Fingers of Frost | Texto oficial: «Pre-requisite of Ice Lance» | Ice Lance es hito de 11 (fila 3) y Fingers of Frost está en la fila 5: no puede ser requisito de Ice Lance | Se muestra la redacción oficial y la lectura coherente («FoF requiere Ice Lance»), marcada como pendiente |
| Versión de cliente | "1.60.1 beta" (Seemeta) | "build 69913" (Guildorder, antigua) | Resuelto: se publica «1.60.1, build 70338» como dato de la comunidad (wago.tools + Warcraft Wiki) |
| Nivel de la doble especialización | Deep dive: nivel 40 | Pódcast: «currently 40», estudian adelantarlo | Se muestra «40 por ahora» con el aviso |

## Pendiente (no publicar como hecho)

- [ ] Valores numéricos: daño, coste y probabilidad de Arcane Blast, Ice Lance, Frostfire Bolt, Missile Barrage, Heating Up, Fingers of Frost.
  - Un extracto de Zockify menciona "95 to 104 Arcane damage" para Arcane Blast, pero la página consultada no lo muestra → **no se usa**.
- [ ] Niveles en los que se aprenden las habilidades base (salvo Frostfire Bolt, 40).
- [ ] Builds de nivelación probadas y builds de nivel 60.
- [ ] Prioridad de estadísticas y valor del índice de golpe con los nuevos Arcane Focus y Elemental Precision.
- [ ] Equipo, consumibles, encantamientos, profesiones.
- [ ] Mazmorras, raids y PvP de Forever.
- [ ] Formato de importación o exportación de talentos.
- [ ] Nombres oficiales en español de los hechizos **no** citados en el deep dive (Blink, Evocation, Flamestrike, Combustion, Ice Barrier…): se muestran en inglés.
- [ ] Error conocido de la beta: recibir daño al canalizar Misiles Arcanos dispara un misil con el daño completo (Known Issues, 8 oct). No es un cambio de diseño.
- [ ] Recompensas de Comprensión (Comprehend Scroll).

## Lista de revisión tras el lanzamiento (4 nov 2026)

1. Leer las notas del parche de lanzamiento y añadirlas a `sources.json`.
2. Revisar cada entrada de `changes.json`: ¿sigue vigente? Actualizar `status` y `reviewed`.
3. Crear la versión de juego `forever-launch` en `game-versions.json` y apuntar las páginas revisadas a ella.
4. Comprobar en el juego los niveles de aprendizaje y las interacciones clave (Ice Lance contra objetivos congelados, Heating Up, apilamiento de Arcane Blast) → `tested`.
5. Desbloquear las secciones pendientes a medida que haya datos.
