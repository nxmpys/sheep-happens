# Investigación: JcJ del Mago en WoW Forever

Fecha: 2026-11-18 (dos semanas después del lanzamiento). Notas de trabajo para reescribir la guía JcJ; no es texto publicable.

Leyenda de fiabilidad: **[oficial]** notas o artículos de Blizzard · **[datos]** texto del cliente (talent-text.json, Wowhead Forever, ForeverChanges) · **[guía]** guía de terceros · **[foro]** informes de jugadores · **[duda]** sin confirmar o contradictorio.

## 1. Fuentes consultadas

| Fuente | Fecha | Fiabilidad | Qué aporta |
| --- | --- | --- | --- |
| Blizzard, notas de desarrollo (hilo 2360696, posts 1-10) | 24 sep - 4 nov | Oficial | Cambios de talentos, DR, crítico en JcJ, Honor, raciales |
| Blizzard, hotfixes (hilo 2403040) | 5 - 18 nov | Oficial | Nova de Escarcha, Concentración Arcana, campos de batalla |
| Blizzard, «How PvP Progression Works» (news/24303316) | 7 oct | Oficial | Honor, puntos de rango, rangos y recompensas, temporadas |
| talent-text.json del sitio (Wowhead Forever, 31 oct) | 31 oct | Datos | Texto exacto de cada talento |
| ForeverChanges `/class/mage` | 18 nov | Datos | Hechizos base frente a Classic |
| Wowhead Forever, tooltips de objetos JcJ | 18 nov | Datos | Conjunto del Mago y armas |
| Skill-Capped, Frost Mage PvP guide | 12 nov | Guía, la mejor | Build 17/0/34, macros, razas, ingeniería |
| wowforeverbuilds.com/pvp/mage | 1 nov | Guía, teórica | Tres builds de 51 puntos (Arcano, Fuego, Escarcha) |
| wowforeverguides.com/pvp/mage | 9 nov | Guía | Tiempos de reutilización, resultados del Forever Open |
| ConquestCapped, PvP overview y costes | 10 nov / 9 oct | Guía (vende servicios) | Puntos por rango, campos, costes beta |
| LFCarry, Mage PvP y Honor farming | 14 y 16 nov | Guía (vende boosts) | Campos y niveles, plan de rangos |
| ForeverDB, wowforevertierlist, u4n, mmonster | oct - nov | Baja | Desactualizadas o comerciales; solo para contrastar |
| Foro de Blizzard, hilos de jugadores | 30 oct - 17 nov | Foro | Problemas reales tras el lanzamiento |

No existe guía JcJ de Wowhead ni de Icy Veins para Forever. Ninguna guía tiene datos de rendimiento a nivel 60; el único dato de partidas es el Forever Open (duelos a nivel 30 en la beta).

## 2. Sistema JcJ de Forever

### Confirmado

- **Dos progresiones**: el Honor se gasta; los puntos de rango solo llenan la barra de rango, con tope semanal. [oficial]
- **Rangos 1-14** con recompensas: 1 tabardo, 2 abalorio JcJ, 3 capa, 4 collar, 5 pociones de combate, 6 tabardo, 7 estandarte, 8 lacres de muñecas y cintura, 9 pies, 10 manos, 11 monturas, 12 piernas y hombros, 13 pecho y cabeza, 14 armas épicas. [oficial]
- **Dos conjuntos**: azul (sin rango) y épico (pieza azul + lacre envalentonado con rango). [oficial]
- **Temporadas** con un recorrido de tareas semanales que dan Honor y puntos de rango; tres tareas por temporada dan un punto de Legado. [oficial]
- **Tope de Honor 25.000** (era 15.000); el equipo JcJ y sus mejoras cuestan un ~50 % más de Honor. [oficial, 1 oct]
- **Los críticos ya no se reducen en JcJ.** [oficial, 8 oct] No hay temple ni reducción de daño JcJ: ninguna fuente la menciona.
- **Marcas de honor**: se apilan hasta 30. [oficial]
- **Islas Lanza Negra** (Darkspear Islands) existe y está abierto. [oficial]
- **Raíces de procs con rendimientos decrecientes**: Mordiescarcha, Entrapment, Improved Wing Clip, Counterattack, Improved Hamstring. [oficial, 2 nov]
- Hotfixes de campos: no montar en la sala inicial de Garganta Grito de Guerra; misiones de Valle de Alterac piden nivel 58; Plainsrunning ya no se apila con la bandera. [oficial]
- Los reinos JcJ tienen menos población por zona que los normales tras el hotfix del 10 nov. [oficial]
- No hay arenas ni JcJ puntuado. [guía, todas coinciden; Blizzard no anuncia nada]

### Datos de terceros sin confirmar

- Puntos por rango (750 el rango 1 … 24.750 el rango 14) y rango 14 no antes de la semana 10. [guía, ConquestCapped, «datamined from the beta»]
- Campos y niveles: Garganta 10v10 desde 10; Arathi 15v15 desde 20; Islas Lanza Negra 15v15 desde 30, a 2.000 puntos; Alterac 40v40 desde 51. [guía, LFCarry y ConquestCapped coinciden]
- 3 marcas por victoria, 1 por derrota. [guía]
- Costes en Honor: solo hay valores de la beta y estimaciones (+50 %). Nada fiable para el lanzamiento. [duda]
- Premades contra premades: un hilo de 70 respuestas (16 nov) dice que Blizzard lo prometió y que en la práctica los grupos sueltos se cruzan con premades. [foro] No encuentro la frase de Blizzard.

### Problemas tras el lanzamiento (foro)

- **Topes ocultos de rango por nivel** (hilo 2409758, 241 respuestas): no se ganan puntos de rango por encima del rango 3 hasta el nivel 40, ni del 5 hasta el 50; el rango sigue subiendo al jugar el tramo 50-59. Blizzard no lo ha explicado. [foro, muy repetido]
- Alterac daba 0 puntos de rango a algunos jugadores (hilo 2414959). [foro]
- «Rank 14 sets far too good» (17 nov): un jugador dice que los conjuntos llevan golpe. Los tooltips de Wowhead del conjunto del Mago **no** llevan golpe. [duda: Wowhead puede ir retrasado]

## 3. El kit del Mago en JcJ (valores de Forever)

| Hechizo | Forever | Cambio frente a Classic |
| --- | --- | --- |
| Polimorfia | Hasta 50 s (rango 4), solo una a la vez | Sin cambios [datos] |
| Nova de Escarcha | 25 s de reutilización, 8 s de congelación; el daño puede romperla | Desde el 13 nov la rompen el daño de procs y Ventisca [oficial] |
| Cono de frío | 40 % durante 6 s; los 4 primeros objetivos, 50 % durante 9 s | Classic: 50 % durante 8 s [datos] |
| Traslación | 15 s; libra de aturdimientos e inmovilizaciones | Sin cambio real [datos] |
| Contrahechizo | 30 s, bloquea la escuela 10 s | Sin cambios [datos] |
| Descarga de Escarcha | Ralentiza un 40 % | El rango 1 vuelve a activar Mordiescarcha y Dedos de Escarcha desde el 2 nov (salvo Ventisca) [oficial] |
| Lanza de hielo (talento 11 puntos) | Instantánea, +300 % contra congelados, 8 s compartidos con Explosión de Fuego | Nueva [oficial] |
| Barrera de hielo (talento 31) | Escudo + 15 % de daño de Escarcha 1 min, +5 % mientras dure, sin retroceso de lanzamiento | Nueva función [datos] |
| Bloqueo de hielo (talento 16) | 10 s | Ahora se coge antes [datos] |
| Mordedura helada (talento 21) | Reutilización 10 min | Era 5 min [oficial] |
| Contrahechizo mejorado | 2 s / 4 s de silencio siempre | Classic: 50 % de probabilidad de 4 s [datos] |
| Custodia de Escarcha (talento) | 10/20 % de anular el hechizo (ya no refleja) | [oficial] |
| Impacto | 3/7/10 % de aturdir 2 s con hechizos de Fuego | 3 rangos en vez de 5 [datos] |
| Ola explosiva | 50 % de ralentización 6 s | Ya no pide Piroexplosión [datos] |
| Poder Arcano | +30 % de daño y coste 15 s | Ahora pide Presencia mental [datos] |
| Explosión Arcana (talento 11) | 1,5 s, apila daño de hechizos por Intelecto (12 %, 18 s) | Nueva [oficial] |
| Descarga de Escarcha de fuego | 3 s, Fuego y Escarcha a la vez, DoT con ralentización (nivel 40) | Nueva [oficial] |
| Escalofrío del invierno | Ya no da crítico; prepara el Cono de frío | Rediseñado [oficial] |

Conjunto JcJ del Mago (Wowhead, 18 nov): azul 2 piezas +23 daño, **4 piezas Traslación −2 s**, 6 piezas +20 Aguante; épico 2 piezas +20 Aguante, **3 piezas Traslación −2 s**, 6 piezas +23 daño. Los guantes suben Escudo de maná en 285. La guía actual ya lo tiene bien.

### Errores encontrados en el sitio

- `race-picks.json` (mazmorras): Berserking dura **15 s** desde el 2 nov, no 10. [oficial] No es JcJ, pero lo he visto.

## 4. Contradicciones entre fuentes y mi veredicto

| Tema | Lo que dicen | Veredicto |
| --- | --- | --- |
| Lanza de hielo contra congelados | 200 % (tierlist, oct) / 300 % (resto) | **300 %** y 8 s compartidos con Explosión de Fuego [oficial, 2 nov] |
| Downranking y Mordiescarcha | 0 % con rango 1 (u4n, dev notes 1 oct) / vuelve a activarse (Skill-Capped) | **Vuelve a activarse** [oficial, 2 nov]; solo Ventisca conserva la penalización |
| Explosión de Escarcha | Nueva (tierlist) / retirada | **Retirada** [oficial, 2 nov] |
| Mordedura helada | 5 / 10 min | **10 min** [datos] |
| Masa crítica | 5 rangos / 3 | **3 rangos, 6 %** [oficial] |
| Duración de Polimorfia en jugadores | 20-30 s / 50 s / «sin tope JcJ» | **50 s en el tooltip**; nadie ha medido la duración real contra jugadores ni sus rendimientos decrecientes [duda] |
| DR de Mordiescarcha con Nova de Escarcha | Nadie lo dice | Blizzard solo dice que comparte grupo con las raíces de procs de otras clases [duda: probar en el juego] |
| Voluntad de los Renegados | «Ya no da inmunidad al miedo después» (Skill-Capped) | No lo encuentro en las notas [duda] |
| Mejor raza Horda | No-muerto / Trol / Orco | Ver §6 |
| Rama para JcJ | Escarcha A en todas; Fuego y Arcano entre B y C | **Escarcha** por consenso; nadie ha probado Fuego o Arcano a 60 |

## 5. Builds JcJ encontradas (nivel 60)

Doce builds de siete fuentes. Todos los códigos se han decodificado con `talents.json` y suman 51. Ninguna fuente dice haberlas probado a 60; wowforeverbuilds las llama teóricas. Popularidad: talentsforever.com cuenta las builds que la gente guarda y etiqueta como «PvP» (mide planes, no partidas).

### Familia A: Escarcha con Contrahechizo mejorado (17-20 en Arcano)

La más repetida: cinco fuentes.

| Fuente | Reparto | Diferencias |
| --- | --- | --- |
| Skill-Capped (12 nov) | 17/0/34 | Arcano: Especialización en varitas 2, Recuperación Arcana 3, Sutileza Arcana 2, Concentración Arcana 5, Geometría Arcana 2, Explosión Arcana 1, Contrahechizo mejorado 2. Escarcha: Descarga mejorada 5, Fragmentos de hielo 5, Mordiescarcha 3, Nova mejorada 1, Escarcha permanente 3, Lanza de hielo, Alcance ártico 2, Bloqueo de hielo, Trizar 3, Cono de frío mejorado 3, Mordedura helada, Dedos de Escarcha 2, Escalofrío del invierno 3, Barrera de hielo. **Sin Precisión.** |
| wowforeverbuilds (16 nov) | 20/0/31 | Arcano: Canalización mejorada 2, Recuperación 3, Sutileza 2, Absorción mágica 2, Concentración 5, Impacto Arcano 1, Contrahechizo mejorado 2, Meditación Arcana 3. Escarcha: Custodia de Escarcha 2, Descarga mejorada 5, Fragmentos 5, Mordiescarcha 3, Nova mejorada 2, Escarcha permanente 2, Lanza, Alcance ártico 1, Bloqueo, Trizar 3, Cono mejorado 2, Mordedura, Dedos 2, Barrera. **Sin Precisión ni Escalofrío.** |
| metammo (6 nov) | 20/0/31 | Arcano con Protección Arcana 2 (Escudo de maná más barato). Escarcha con Precisión 2, Escarcha permanente 3, Alcance ártico 2; sin Cono mejorado ni Escalofrío. |
| rankedboost (8 nov) | 17/0/34 | Arcano con Geometría Arcana 2; Escarcha con Precisión 3 y Custodia de Escarcha 2. Detalle parcial. |
| mmonster (5 nov) | 20/0/31 | Solo el reparto. |

Idea: Contrahechizo silencia 4 s, más armadura (Recuperación Arcana) y resistencias; Escarcha hasta Barrera de hielo.

### Familia B: Escarcha profunda (39-45 en Escarcha)

| Fuente | Reparto | Notas |
| --- | --- | --- |
| talentsforever, n.º 1 con etiqueta PvP | 3/5/43 | Recuperación Arcana 3 e **Incineración 5** (crítico de Lanza de hielo); Escarcha completa: Precisión 3, Nova mejorada 2, Escarcha permanente 3, Canalización de Escarcha 3, Escalofrío 5, Barrera. Variante n.º 3: Ventisca mejorada 3 en vez de Canalización. |
| talentsforever, n.º 2 | 12/0/39 | Arcano: varitas 2, Canalización mejorada 5, Sutileza 2, Tromba de misiles 2, Explosión Arcana. Escarcha con Custodia de Escarcha 2, Precisión 2, Ventisca mejorada 1. |
| foreverdb (18 nov) | 6/0/45 | Canalización mejorada 2, Recuperación 3, Tromba 1; Escarcha casi entera. |

Idea: renuncia al silencio del Contrahechizo a cambio de más daño de Escarcha (Escalofrío 5/5 para el Cono de frío), coste de maná (Canalización de Escarcha) y, en la 3/5/43, crítico de Lanza de hielo.

### Familia C: Arcano de ráfaga con Trizar (31-40 en Arcano)

| Fuente | Reparto | Notas |
| --- | --- | --- |
| wowforeverbuilds (16 nov) | 32/0/19 | Presencia mental, Poder Arcano, Cólera Arcana, Explosión Arcana, Contrahechizo mejorado, Mente Arcana 5, Inestabilidad 3; Escarcha: Custodia de Escarcha 2, Precisión 3, Mordiescarcha 3, Nova mejorada 2, Escarcha permanente 3, Canalización 1, Lanza, Bloqueo, Trizar 3. |
| talentsforever, n.º 4 | 31/0/20 | Igual idea, con Canalización mejorada 5; Escarcha con Descarga mejorada 3 y Ventisca mejorada 1. |
| mmonster | 31/0/20 | Solo el reparto. |
| foreverdb | 40/0/11 | Arcano casi entero; Escarcha solo hasta Escarcha permanente: **sin Bloqueo de hielo ni Trizar**. |

Idea: abrir con Poder Arcano + Presencia mental, matar en una ventana corta; Escarcha para Bloqueo de hielo y Trizar.

### Familia D: Fuego (31-40 en Fuego)

| Fuente | Reparto | Notas |
| --- | --- | --- |
| wowforeverbuilds (16 nov) | 0/31/20 | Incineración 5, Acelerante 3, Ignición 5, Impacto 3, Alma ardiente 3, Piroexplosión, Explosión de Fuego mejorada 2, Calentamiento, Maestro de los elementos 3, Masa crítica 3, Ola explosiva, Combustión; Escarcha: Custodia de Escarcha 2, Precisión 3, Fragmentos 1, Mordiescarcha 3, Nova mejorada 2, Escarcha permanente 3, Canalización 1, Lanza, Bloqueo, Trizar 3. |
| foreverdb | 0/40/11 | Fuego entero con Lanzallamas 2 y Poder de Fuego 3; sin Bloqueo de hielo. |

Idea: aturdimientos de Impacto, Ola explosiva, Piroexplosión rápida con Calentamiento; en JcJ los críticos ya no se reducen.

### Lo que comparten y lo que se discute

- **En casi todas**: Mordiescarcha 3/3, Nova de Escarcha mejorada, Escarcha permanente, Lanza de hielo, Bloqueo de hielo, Trizar 3/3. Solo las dos de foreverdb de 40 puntos renuncian a Bloqueo de hielo.
- **Contrahechizo mejorado o Escarcha profunda**: la decisión principal entre A y B.
- **Precisión**: la más cogida del juego (83 % de todas las builds en talentsforever), pero Skill-Capped y wowforeverbuilds Escarcha no la cogen. Contra jugadores de nivel 60 el fallo base de hechizos es bajo; habría que medir si compensa.
- **Escalofrío del invierno**: 0, 3 o 5 puntos según la fuente; solo potencia el Cono de frío.
- Popularidad (talentsforever, builds de 41+ puntos de cualquier uso): Escarcha 47 %, Arcano 28 %, Fuego 25 %.

## 6. Razas (Mago)

| Raza | Racial JcJ | Opinión de las fuentes |
| --- | --- | --- |
| Gnomo | Escape Artist (libra de raíces y ralentizaciones), Eureka! (8 s, +10 % daño y −10 % coste) | Primera opción de Alianza en todas |
| Humano | Will to Survive (quita aturdimientos), Perception, Ruthless +1 % crit | Segunda; LFCarry la pone a la par del Gnomo |
| Skyborne (High Order) | Walk on Air, +2 % celeridad | Warcraft Tavern la ve buena; Skill-Capped no |
| No-muerto | Voluntad de los Renegados | Primera de Horda para Skill-Capped y tierlist; **ojo**: Touch of the Grave rompe tu propia Nova de Escarcha (un jugador contó 43 de 150, hilos 2412598 y 2412770; sin respuesta de Blizzard) [foro] |
| Orco | Blood Fury 2 min (+10 % poder con hechizos 15 s), Hardiness (aturdimientos −20 %), Shatter Curse | Skill-Capped la empata con No-muerto y Trol |
| Trol | Berserking 15 s | Igual |

## 7. Lo que dicen los jugadores del Mago Escarcha en JcJ

- Antes del lanzamiento: el Mago ganó un 48 % de los duelos del Forever Open (nivel 30) y perdía mucho contra Brujo (26 %) y Sacerdote (40 %). [guía, datos de la beta]
- «Frost Mage PvP: already behind in duels, now nerfed again» (30 oct, 35 respuestas): quejas por el tiempo de reutilización de Lanza de hielo, la retirada de Explosión de Escarcha y el DR de Mordiescarcha. [foro]
- Tras el lanzamiento: congelaciones que se rompen en cuanto otro jugador pega (lo confirma el hotfix del 13 nov), Nova de Escarcha que gasta cargas de Dedos de Escarcha, Touch of the Grave. [foro]
- «Damage buffs and PVP» (4 nov, 57 respuestas): con el aumento de daño del 2 nov y sin reducción de críticos, se muere muy rápido. [foro]

## 8. Macros (Skill-Capped, comprobar en el juego)

Contrahechizo al foco con /stopcasting, Polimorfia al foco, Bloqueo de hielo con /stopcasting y para cancelarlo, Quitar maldición menor con mouseover, Ventisca en el cursor. Su macro de Polimorfia rango 1 → rango 2 se basa en que no se puede sobrescribir una Polimorfia de igual o mayor rango: no lo he podido confirmar.

## 9. Ingeniería y objetos

Ingeniería sigue siendo la profesión JcJ según todas las fuentes, pero nadie la ha probado a 60. Objetos nuevos de Forever para cualquier clase (Skill-Capped): SAF-T Nitro Boosts, EZ-Thro Magnetic Displacer, EZ-Thro Mana Bomb (drena maná y silencia 5 s), Gnomish Poultryizer, Tinkerbox. Hay que verificarlos en Wowhead antes de publicarlos.

## 10. Pruebas en el juego (para el usuario)

Por orden de importancia para la guía. Con un compañero en duelo basta para casi todas.

1. **Polimorfia en un jugador**: cuánto dura con el rango máximo, y cuánto la segunda y la tercera seguidas (rendimientos decrecientes). ¿Se puede relanzar sobre una oveja con el mismo rango, o hace falta un rango distinto como dice la macro de Skill-Capped?
2. **Nova de Escarcha y Mordiescarcha**: congela con Nova, y cuando acabe, provoca un Mordiescarcha. ¿Dura los 5 s completos o la mitad? Repite al revés.
3. **Nova de Escarcha rota por daño**: ¿la rompe un solo golpe de cuerpo a cuerpo de otro jugador? ¿Y Lanza de hielo? (Para saber cuántas Lanzas caben antes de que se rompa.)
4. **Descarga de Escarcha de rango 1**: ¿activa Mordiescarcha y Dedos de Escarcha contra jugadores? (Blizzard dice que sí desde el 2 nov.)
5. **Conjunto épico**: abre en el intendente la toga y los guantes épicos del Mago. ¿Llevan golpe? ¿Cuánto Honor cuestan la pieza azul y el lacre?
6. **Topes de rango por nivel**: en la pestaña JcJ, ¿indica algo del nivel mínimo para pasar del rango 3 o del 5?
7. **Si juegas No-muerto**: ¿Touch of the Grave rompe tu propia Nova de Escarcha?
8. **Precisión**: con 0 puntos, ¿cuántos hechizos te resisten o fallan contra jugadores de nivel 60? (El registro de combate lo dice.)

## 11. Pendiente de verificar

- Duración de Polimorfia contra jugadores y sus rendimientos decrecientes.
- Si Mordiescarcha comparte DR con Nova de Escarcha.
- Topes de rango por nivel (rango 3 hasta el 40, rango 5 hasta el 50).
- Costes de Honor del lanzamiento por pieza y lacre.
- Estadísticas finales del conjunto épico (¿llevan golpe?).
- Si Touch of the Grave rompe tu propia Nova (y si Blizzard lo arregla).
- Objetos de ingeniería nuevos y pergaminos de Comprensión con uso JcJ (por ejemplo Imbue Iceknife, que enraíza).
