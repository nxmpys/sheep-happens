# Investigación: profesiones para el Mago en WoW Forever

> Fecha: **2026-10-14** · Versión de juego: `forever-beta-2026-10` (cliente 1.60.1, nivel máximo 30 en la beta) · Página: `/es/profesiones/` y `/en/professions/` · Datos: `src/data/professions.json` y `src/data/profession-picks.json`

Notas de la investigación que respalda la página de Profesiones: qué se comprobó, con qué fuente y qué queda sin verificar. Sirve para revisarla tras el lanzamiento (4 de noviembre de 2026) y cuando lleguen las bandas.

## 1. Versión y reglas que aplican

- WoW Forever es un producto oficial de Blizzard basado en la época vanilla (ver [game-version.md](game-version.md)). Sus profesiones parten de Classic, pero **no son las de Classic**: hay recetas nuevas, objetos de campamento y perks de Legado. No se ha usado ningún dato de Retail, TBC, WotLK ni Season of Discovery como si fuera de Forever.
- Algunas mecánicas de Forever vienen de Season of Discovery (Waylaid Supplies, Favor de mercader, Azeroth Commerce Authority / Durotar Supply and Logistics). Se documentan porque las fuentes de Forever las describen en Forever, no por venir de SoD.
- Profesiones disponibles: nueve principales (Alquimia, Herrería, Encantamiento, Ingeniería, Peletería, Sastrería, Herboristería, Minería y Desuello) y tres secundarias (Cocina, Primeros auxilios y Pesca). Sin Joyería ni profesiones nuevas. Dos principales por personaje. *(Comunidad: Warcraft Tavern y Zockify coinciden.)*
- La especialización de Ingeniería (gnómica / goblin) sigue existiendo: la base de datos muestra objetos con «Requires Gnomish Engineer» y «Requires Goblin Engineer». *(Herramienta: Wowhead.)*

## 2. Método

1. Fuentes oficiales primero: el resumen del panel Deep Dive de Blizzard (13 sep 2026) es la única fuente oficial que habla de profesiones.
2. Guías de la comunidad específicas de Forever para lo que Blizzard no ha detallado (lista de profesiones, objetos de campamento, Legado, recomendaciones de otras guías).
3. **Verificación de cada objeto citado** en la base de datos de Forever de Wowhead (datos extraídos del cliente de la beta): para cada profesión se leyó la lista de recetas (`/forever/spells/professions/<profesión>`), con su marca «new / updated / unchanged» respecto a Classic, y la ficha de cada objeto creado (ligado al recoger o al equipar, nivel, estadísticas, requisitos de profesión). Así se separó lo **exclusivo de quien tiene la profesión** (ligado al recoger o «Requires <profesión>») de lo que cualquiera puede comprar.
4. Las valoraciones (Alto, Medio, Bajo, Nulo) y las recomendaciones son **análisis** propio a partir de esos datos, y se marcan así en la página.

## 3. Fuentes

### Específicas de WoW Forever

| id en `sources.json` | Fuente | Tipo | Qué respalda |
| --- | --- | --- | --- |
| `blizzard-forever-deep-dive-recap` | [Blizzard — Forever Deep Dive Panel Recap](https://worldofwarcraft.blizzard.com/en-us/news/24303313) | Oficial | Más de 600 recetas nuevas, comida con experiencia, campamentos (tres objetos por profesión, el primero a 20 de habilidad, no se acumulan con las mejoras de clase, hogueras de 5 y 10 objetos), planos de jefes de mazmorra, Bountiful Harvest, Reagent Economy |
| `blizzard-deep-dive-mage` | [Blizzard — Class Deep Dives: Mage & Shaman](https://news.blizzard.com/en-us/article/24302097/) | Oficial | Descarga de Pirofrío usa la mejor bonificación entre Fuego y Escarcha; Cono de frío más corto contra el farmeo masivo |
| `wowhead-forever-professions-db` | [Wowhead — Forever profession spells](https://www.wowhead.com/forever/spells/professions) | Herramienta | Recetas, objetos y estadísticas de la beta (ver sección 4) |
| `warcrafttavern-professions` | [Warcraft Tavern — Professions Overview](https://www.warcrafttavern.com/forever/guides/professions/) | Comunidad | Lista de profesiones y objetos de campamento con su mejora de clase equivalente |
| `warcrafttavern-camping-objects` | [Warcraft Tavern — Camping Objects & Buffs](https://www.warcrafttavern.com/forever/guides/camping-objects-buffs/) | Comunidad | Los tres objetos de cada profesión y su efecto |
| `method-camping` | [Method — Camping in WoW Forever](https://www.method.gg/wow-forever/camping-in-wow-forever-how-it-all-works-all-profession-buffs) | Comunidad | Un objeto por jugador en cada hoguera |
| `zockify-professions` | [Zockify — WoW Forever Professions](https://www.zockify.com/forever/professions/) | Comunidad | Sin profesiones nuevas, límite de dos principales, bonificaciones pasivas no confirmadas |
| `warcrafttavern-legacy` | [Warcraft Tavern — Legacy System](https://www.warcrafttavern.com/forever/guides/legacy/) | Comunidad | Puntos de Legado a 150, 225 y 300 en profesiones de fabricación; perks del árbol de Profesiones |
| `warcrafttavern-mage-guide` | [Warcraft Tavern — Mage Guide](https://www.warcrafttavern.com/forever/guides/mage/) | Comunidad | Recomendaciones de otra guía (Sastrería + Encantamiento; Ingeniería para JcJ; Alquimia para oro) |
| `method-mage-leveling` | [Method — Mage Leveling Guide](https://www.method.gg/wow-forever/wow-forever-mage-leveling-guide-and-talents) (9 oct 2026) | Comunidad | Sastrería y Encantamiento para subir; Cocina y Primeros auxilios |
| `warcrafttavern-tailoring` | [Warcraft Tavern — Tailoring Overview](https://www.warcrafttavern.com/forever/guides/tailoring/) | Comunidad | Equipo por escuela con Favor de mercader, patrones de mazmorra, bolsas de componentes |
| `warcrafttavern-enchanting` | [Warcraft Tavern — Enchanting Overview](https://www.warcrafttavern.com/forever/guides/enchanting/) | Comunidad | Varitas con poder con hechizos, bastones y orbes, encantamientos de collar |

Consultadas y no citadas: Mobalytics, wowforeverguides.com, classicwowforever.com y varias webs de servicios de «boost» (repiten lo anterior o no aportan fuente); Icy Veins (devuelve 403 a las peticiones automáticas).

### WoW Classic

No ha hecho falta ninguna fuente de Classic: la base de datos de Forever ya indica qué objetos siguen igual que en Classic («unchanged»), y esos datos se citan como datos de Forever. Mecánicas de Classic que **no** se han trasladado a la página por no poder verificarlas en Forever: tiempo de reutilización compartido de las pociones, interrupción de las vendas al recibir daño, comida conjurada sin mejora, y el uso de explosivos en bandas.

## 4. Datos comprobados en la base de datos de la beta

| Profesión | Lo que se comprobó | Exclusivo de quien la tiene |
| --- | --- | --- |
| Sastrería | Más de 60 piezas de tela nuevas ligadas al recoger con daño de hechizos (también hay familias de Sombras, Sagrado y sanación), por escuela (Fuego: Flame/Fiery/Netherflame; Escarcha: Silky/Frothing/Netherfroth; Arcano: Pearly/Golden/Nethershine), del nivel 10 al 50. Casi todas se compran con Favor de mercader; las Filigreed caen en mazmorras; unas pocas las enseña el instructor. Robe of the Archmage (ligada, solo Mago) sigue igual. Bolsas de componentes nuevas (ligadas al equipar). | Las piezas ligadas y la Robe of the Archmage |
| Encantamiento | Glimmering Staff y Orb of Mystic Insight (nivel 25), Radiant Staff y Truesilver Conduit (45), Frozen Heart of the Mountain (50), Brilliant Wand (55): todos ligados al recoger. Varitas con poder con hechizos desde el nivel 5 (ligadas al equipar). Encantamientos nuevos: collar (Spell Power +6), 2H Mighty Spell Power (+55), Revelation, Insight. Ninguno indica que solo se pueda aplicar al propio encantador. | Los objetos ligados |
| Ingeniería | Goblin Sapper Charge (Ingeniería 205), Gnomish Net-o-Matic (210), Thorium Grenade (260), reflectores, Mind Control Cap, Spellpower Goggles Xtreme Plus (270), Bloodvine Goggles (300): siguen pidiendo Ingeniería. Nuevos: Gnomish Poultryizer y Emergency Field Cloak (ligados), y explosivos **EZ-Thro y SAF-T sin requisito de profesión** (EZ-Thro Thorium Grenade: 300-500 de daño y 3 s de aturdimiento, igual que la Thorium Grenade). | Lo que pide «Requires Engineering» y los objetos ligados |
| Alquimia | Elixires y pociones nuevos para lanzadores (Minor Arcane Elixir, Mageblood, Spellblasting de +7 a +47 durante 30 s, Elixir of the Owl). Alchemist’s Stone (ligada, Alquimia 275, +20 % a pociones de maná y sanación). Las pociones de sanación de Alquimia son «Discolored» (75 % de lo curado vuelve como daño). | Alchemist’s Stone |
| Primeros auxilios | Hace las pociones de sanación (Minor a Major), cataplasmas, torniquetes y antídotos. | — |
| Cocina | Casi toda la comida: «bien alimentado» tras 10 s sentado, +5 % de experiencia por muerte durante 15 min y una estadística (Smoked Sagefish +4 de daño de hechizos; Briny Seafood Stew +14). | — |
| Herboristería, Minería, Desuello | Sin hechizos pasivos de combate en sus listas. | — |
| Peletería, Herrería | Capas y armas para lanzadores ligadas al equipar (Frost Leather Cloak, Searing Golden Blade, Sageblade). | Nada útil para un Mago |
| Campamento | Fish Bowl (+8 % a estadísticas, excluyente con Bendición de reyes), Camp Chair (+2 % de crítico, excluyente con Aura de lechúcico), Camp Tent (experiencia descansada hasta el 5 % de un nivel), Reagent Bot (vendedor); todos comparten una hora de reutilización. | — |

## 5. Conclusiones de la investigación

1. Forever da a las profesiones de fabricación **más poder personal** que Classic, porque muchas recetas nuevas son ligadas al recoger. Eso favorece a Sastrería y Encantamiento para un Mago que sube de nivel.
2. Ingeniería sigue siendo la profesión de JcJ, pero los explosivos EZ-Thro reducen parte de su ventaja exclusiva si los ingenieros los venden.
3. Alquimia pierde las pociones de sanación (pasan a Primeros auxilios) y gana consumibles de lanzador; su valor exclusivo es el Alchemist’s Stone, el resto es ahorro y oro.
4. Las profesiones de recolección no tienen bonificaciones de combate en la beta, y según la comunidad no dan puntos de Legado por habilidad.
5. El objeto de campamento de Herboristería no sirve a un Mago (no se acumula con Intelecto Arcano); el de Desuello sí (+2 % de crítico). Como cada jugador pone un solo objeto por hoguera, el campamento no debería decidir las profesiones principales.

## 6. Pendiente de verificar

- [ ] Si los objetos de campamento se pueden montar dentro de mazmorras y bandas, y el valor numérico de cada mejora por nivel (la base de datos da fórmulas sin resolver).
- [ ] La regla «un objeto por jugador y hoguera» (solo la comunidad lo dice).
- [ ] Puntos de Legado por profesión y perks del árbol de Profesiones (solo comunidad; nombres y cifras difieren entre guías).
- [ ] De dónde salen las recetas sin fuente en la beta: varios explosivos EZ-Thro, Frozen Heart of the Mountain, Brilliant Wand y parte del equipo de nivel 40-50 de Sastrería.
- [ ] Si Waylaid Supplies da experiencia al entregar cajas (en SoD sí; en Forever no se ha confirmado). La página no lo afirma.
- [ ] Bloodvine Garb (requiere Sastrería 300) y las bandas de nivel 60: no sabemos cuándo llegan.
- [ ] Revisar todas las cifras con el parche de lanzamiento y pasar a «Probado en juego» lo que se compruebe.
