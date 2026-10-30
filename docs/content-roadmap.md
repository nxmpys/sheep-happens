# Hoja de ruta del contenido

> Creado: 2026-10-12 · Revisión: 2026-10-30 · Versión de juego: `forever-beta-2026-10` (lanzamiento el 4 de noviembre de 2026)

Lista viva de lo que falta, de lo que hay que quitar al lanzar y de lo que hay que vigilar con el tiempo, para que la guía esté siempre al día y dé a cada lector lo que busca:

1. Lo que todavía no existe (ni está publicado ni se puede probar en la beta).
2. Lo que es de la beta y hay que quitar o reescribir: **tras el lanzamiento no debe quedar nada de la beta en la web**.
3. Lo que ya tenemos, pero hay que revisar a medida que avance el juego.
4. Builds: lo que más buscará la gente tras el lanzamiento.
5. Razas: cuál elegir según para qué juegues.
6. Mejoras de la experiencia: ideas para que la web sea más útil para aprender, consultar e informarse.
7. Profesiones: qué revisar en la guía de profesiones.
8. Addons: mantener al día MageProcs y la página de addons.
9. Ideas de los lectores y tabla unificada de todo lo pendiente.

## Cómo usar este documento

Revísalo **cada vez que actualices la guía**: en cada revisión de fuentes (miércoles y viernes), al cambiar un dato o una página y con cada parche.

1. Marca con `[x]` lo que esté resuelto y anota dónde (página o dato) y la fecha.
2. Añade lo nuevo que falte o que haya que vigilar.
3. Actualiza la fecha de «Revisión» de la cabecera.

Las reglas de siempre siguen vigentes: cada dato lleva su estado de verificación ([content-sources.md](content-sources.md)), nunca se usan valores de Retail o de Classic como si fueran de Forever, y cada cambio de datos lleva su `updated` y su entrada en el historial ([maintenance.md](maintenance.md)). Todo cambio de texto se hace en los dos idiomas (`es` y `en`).

## 1. Lo que todavía no existe

### Talentos y builds

- [ ] Árbol completo de Forever con valores **oficiales**. La posición de cada talento ya está en `src/data/talents.json` (sacada de la calculadora de Wowhead, datos del cliente de la beta); las cifras siguen sin confirmar.
- [ ] Talento decisivo de 16 puntos de Fuego (`fire-16` en `src/data/milestones.json`). Pista: en la calculadora de Wowhead, Calentamiento es el único talento de 1 punto de la fila 4 de Fuego. Falta una fuente oficial. (El de Arcano quedó resuelto el 15 de octubre: Cólera Arcana; Tromba de misiles bajó a la fila 1.)
- [ ] Escalofrío del invierno (15 oct): las notas oficiales dan dos descripciones distintas (+40 % de daño de Cono de frío por carga, o +5 % y un 7 % de tu daño con hechizos por carga). Confirmar cuál queda y corregir `change:winters-chill`.
- [x] ~~Nombre oficial en español de **Frost Blast**~~: el hechizo desaparece del libro de hechizos en la build del 28 oct (2026-10-29).
- [ ] Nombres en español de **Accelerant** (antes Bola de Fuego mejorada) y **Precision** (antes Enfoque elemental): el cliente en español aún tiene los nombres y textos anteriores al 28 oct (`STALE_ES` en `scripts/spell-text.ts` y texto en inglés en `talent-text.json`). Cuando cambien, añadir `es` en `src/data/spell-names.json`, quitar esas excepciones y volver a ejecutar `npm run talents:text` y `npm run spells:text`.
- [ ] **Rehacer las builds de leveo** con el árbol del 28 oct (2026-10-29: se borraron las cuatro builds, `builds.json` está vacío y `/builds/leveo/` redirige a `/builds/` con un 302 en `public/_redirects`; quita esas líneas al publicar la primera). Quitar también la razón `leveling` de `noBuild` en `specs.json` de cada rama que vuelva a tener build.
- [ ] Comprobar en el juego si Cólera Arcana requiere Explosión Arcana: la calculadora de Wowhead lo marca así desde el 28 oct, sin mención en ninguna nota.
- [ ] Filas de Piroexplosión, Ola explosiva, Combustión, Presencia mental y Poder Arcano (ahora son «Referencia Classic» en `milestones.json`).
- [ ] Requisito entre Dedos de Escarcha y Lanza de hielo (discrepancia abierta en `content-validation.md`). Pista: la calculadora de Wowhead confirma la lectura coherente (Dedos de Escarcha requiere Lanza de hielo). Falta comprobarlo en el juego.
- [x] Builds de mazmorras a nivel 60 (`*-dungeons` en `builds.json`, 2026-10-30): Arcano, Arcano y Fuego, Pirofrío, Fuego y Escarcha, sin probar en el juego.
- [ ] Decidir si las builds de mazmorras sirven también para banda (añadir `raid` a sus `uses` y quitar `noBuild.raid` en `specs.json`).
- [ ] Al llegar a 60: comprobar con esas builds si el 6 % de golpe de Precision basta en mazmorras, si Meditación Arcana y Armadura de mago se suman, si la cola de un hechizo sobre Dedos de Escarcha da el tercer golpe, si Poder de Fuego cuenta Chamuscar mejorado, cuánto maná base tiene el Mago (el coste de Explosión Arcana depende de él), si Misiles Arcanos gratis consumen Lanzamiento libre y si los costes de los rangos máximos siguen siendo los de la beta. Revisar también las guías de Wowhead de cada rama cuando las actualicen a 60.
- [ ] Builds probadas: leveo primero; después farmeo AoE, mazmorras, banda y PvP, solo en las ramas con sentido (ver la sección 4).
- [x] Calculadora de talentos de Forever: la de Wowhead, con enlaces generados desde `src/lib/talents.ts` (`wowheadBuildUrl`) (hecho el 2026-10-13).

### Valores numéricos

- [ ] Daño, coste y probabilidad de Explosión Arcana, Cólera Arcana, Lanza de hielo, Descarga de Pirofrío, Tromba de misiles, Calentamiento y Dedos de Escarcha. Oficial desde el 15 oct: Explosión Arcana da un 15 % del Intelecto como daño con hechizos por carga; Cólera Arcana suma un 5 % del maná máximo; Lanza de hielo, +200 % contra congelados. Estela de Fuego ya no existe (vuelve a ser Explosión de Fuego mejorada).

### Contenido de los niveles 31 a 60

- [x] Qué rama sube mejor de nivel del 1 al 30: Escarcha, en la guía de leveo (`leveling`, 2026-10-14). Falta del 31 al 60, sobre todo Fuego con Descarga de Pirofrío.
- [ ] Orden de los hechizos de área (Ventisca, Cono de frío, Deflagración Arcana, Flamestrike) y aperturas por rama (avisos pendientes en Combate).
- [ ] Prioridad de estadísticas por rama y actividad, y cuánto golpe hace falta (Equipo).
- [ ] Equipo por tramo de nivel, equipo antes de bandas y mejor equipo posible.
- [ ] Encantamientos, consumibles y profesiones.
- [ ] Mazmorras, bandas y PvP nuevos de Forever.
- [x] Zonas y rutas de farmeo del 10 al 30: página Farmeo AoE (`aoe-farming`, 2026-10-15), con las dos rotaciones, Concentración Arcana y las arañas de Cima del Trueno. Del 30 al 60, las zonas son de Classic y están «Pendiente».
- [ ] Farmeo AoE del 31 al 60: probar las zonas, comparar con las misiones (experiencia por hora) y ordenar las opciones de área (aviso pendiente en Combate y en `aoe-farming`).

### Sistemas

- [ ] Niveles de aprendizaje: 24 de las 25 habilidades de `src/data/abilities.json` usan los de Classic (solo Descarga de Pirofrío a nivel 40 es oficial).
- [ ] Coste de la doble especialización y nivel definitivo (40 o antes).
- [x] Cómo funciona Comprensión: pasos, dónde está Comprender pergamino, qué conviene y qué no, la habilidad que pide cada pergamino y consejos para el leveo, en la página Pergaminos (`scrolls`, 2026-10-15; datos en `src/data/scrolls.json`). Ejemplos de recompensas: imbuir el bastón, familiares, maná (Warcraft Tavern y Wowhead).
- [ ] Recompensas de Comprensión: qué da cada pergamino, máximo de la habilidad, probabilidad de fallo y de botín, y si se pueden comerciar. Hoy son los bloques «Pendiente» de «Lo que aún no se sabe» en `scrolls`.
- [x] Partes del Legado que sirven al Mago: página `legacy` (2026-10-20).
- [ ] Nombres oficiales en español de los hechizos que no salen en el artículo de Blizzard sobre el Mago (Blink, Evocation, Flamestrike, Combustion, Ice Barrier…).
- [ ] Modo Hardcore (llegará más adelante).

### Guías: misiones de clase, biblioteca y JcJ (sección Guías, 2026-10-20)

- [x] Misiones de clase del Mago (`class-quests`, datos en `src/data/class-quests.json` y objetos en `src/data/items.json`): siete cadenas del 10 al 60 con sus recompensas de la base de datos de Forever de Wowhead.
- [ ] Qué misión del nivel 10 recibe el Cielonato y si las versiones del nivel 26 están limitadas por raza (Orco, Cielonato).
- [ ] Recompensas de la cadena del archimago Xylem (nivel 50): las de Classic no están en los datos de Forever (`status: pending`).
- [x] Biblioteca (`library`, datos en `src/data/library-books.json`): 38 libros, premios de 10, 20 y 25 y contador en el navegador (`sh-library`).
- [ ] Comprobar en el juego los libros de zonas de nivel 40 a 60 (salen de la guía de runas de Season of Discovery de Wowhead) y si hay más títulos.
- [x] JcJ (`pvp`): Honor, rangos, equipo de Mago azul y épico, lacres, armas del rango 14 e Islas Lanza Negra.
- [ ] Precios en Honor del equipo JcJ en el lanzamiento (hoy remitimos al intendente; ConquestCapped estima unos 64.000 para el conjunto azul).
- [ ] Builds de JcJ: solo cuando se pueda jugar a nivel 60 y solo en las ramas que funcionen (ver sección 4).
- [x] Legado (`legacy`, datos en `src/data/legacy.json`): 21 ventajas con requisitos de la calculadora de Legado de Wowhead y cuatro combinaciones validadas por `src/lib/legacy.ts` (2026-10-20).
- [ ] Legado en el lanzamiento: valores de cada ventaja, máximo de puntos por personaje (16), coste de cambiarlos, si Ahorro de componentes cubre Estudiar y las ventajas «no implementadas».

### Razas

- [x] Habilidades raciales de las seis razas de Mago, según los datos de la beta: `src/data/races.json`, página Razas (2026-10-13). Siguen como «Comunidad» hasta tener fuente oficial o probarlas.
- [x] Cambios de raciales anunciados para la semana del 13 de octubre de 2026: llegaron con la build del 15 de octubre (Ruthless y Savage sustituyen a las raciales de armas; Eureka!, Wind Blessed, Read Ley Line, Shatter Curse, Blood Fury, Touch of the Grave y Regeneration cambian). Incorporados el 2026-10-16.
- [ ] Nombres oficiales en español de las raciales de Forever.

## 2. Lo que es de la beta: quitar o reescribir al lanzar

### Lo que cambia solo o casi solo

- [ ] Crear la versión `forever-launch` (`stage: "launch"`) en `src/data/game-versions.json` y cambiar el `gameVersion` de las 26 páginas a medida que se revisen. Al cambiar de versión desaparece el aviso «Forever está en beta» de la cabecera (`src/components/layout/PageMeta.astro`).
- [ ] Inicio: la cuenta atrás y la tarjeta de estado con lanzamiento, beta y nivel máximo (`src/layouts/HomeLayout.astro`) pasan a «Disponible», con el nivel máximo y el parche actual.

### Datos

- [ ] `facts.json`: borrar `beta`, poner `launch` en pasado, cambiar `client-version` (es una build de la beta) y revisar `dual-spec` («estudian adelantarla»).
- [ ] `changes.json`: quitar de las fichas la historia de la beta («en la beta pasó de 20 a 30 s», «se llamaba Hot Streak en la beta», «build del 1 de octubre») y dejar solo cómo funciona. Esa historia ya está en el historial.
- [ ] `changes.json`: revisar las 43 fichas contra las notas del parche de lanzamiento.
- [ ] `watchlist.json`: cambiar las notas de desarrollo, los errores conocidos y el foro de la beta por las notas de parche, los hotfixes y los errores conocidos del juego.
- [ ] `sources.json`: revisar las fuentes `lfcarry-beta` e `icyveins-beta-cap`, y la categoría «Calculadoras con datos de la beta» (`src/components/guide/SourcesTable.astro`).

### Texto de las páginas

- [ ] Inicio: preguntas frecuentes «¿Cuándo sale WoW Forever?» (fin de la beta y tope de 30) y «¿Cuál es la mejor rama para subir de nivel?».
- [ ] Inicio: tarjeta de Equipo con «Pendiente hasta el lanzamiento» (`src/components/guide/QuestionCards.astro`).
- [ ] Guía: «Forever sigue en beta» y «las notas de la beta añaden más cada semana».
- [ ] Leveo: la guía es una BETA del 1 al 30 (aviso `LevelingStatus`, resumen, título, `seoTitle` y descripción con «1 a 30» y «BETA»). Al lanzar, revisar las tres builds y los valores sacados de la beta (Ventisca de rango 1 a 320 de maná, Cono de frío 40 % durante 6 s, probabilidades de Frostbite y Dedos de Escarcha) y las misiones de mazmorra. El aviso BETA solo desaparece cuando las builds lleguen al 60 (ver la sección 4).
- [ ] Talentos: «nadie ha podido probarlas por encima del nivel 30» y el aviso pendiente de builds.
- [ ] Combate: aviso «Análisis sin probar… sin acceso a los niveles 31 a 60».
- [ ] Cambios: aviso «Información de beta».
- [ ] Farmeo AoE: aviso «Información de beta», rotaciones y zonas sacadas de la beta (pasarlas a «Probado en juego» o corregirlas) y la tabla de zonas del 30 al 60 («Pendiente»).
- [ ] Equipo: aviso pendiente que cita el nivel 60 de la beta.
- [ ] Arcano, Fuego y Escarcha: secciones «Lo que falta por saber».
- [ ] Pergaminos: los bloques de «Análisis» salen de los datos del cliente de la beta (5 s de lanzamiento, habilidad que pide cada pergamino, Pergamino de Comprensión, apilamiento). Comprobarlos en el juego y pasarlos a «Probado en juego», y revisar el nombre del hechizo en el cliente en español («Entender pergamino» en la beta, «Comprender pergamino» en el artículo de Blizzard).
- [ ] Fuentes y Cambios: resolver «Nivel de la doble especialización» y «Requisito de Dedos de Escarcha». (La discrepancia «Fin de la beta» se resolvió el 2026-10-21: Blizzard anuncia el cierre el 23 de octubre a las 10:00 PDT.)
- [ ] `facts.json`: al lanzar, reescribir `beta` (ya cerrada), quitar `name-reservation` (reserva del 27 de octubre al 3 de noviembre) y revisar `raid-unlock` (bandas de nivel 60 desde el 9 de diciembre; tamaños y ubicaciones solo en el artículo completo de Blizzard, que no se ha leído).
- [ ] Error de la beta con Misiles Arcanos (recibir daño dispara un misil con el daño completo): comprobar si sigue.

### Página temporal de duelos a nivel 30

La página «Duelos a nivel 30» (`builds-duel-30`) y sus dos builds son de la beta y del torneo Forever Open (17 y 18 de octubre de 2026). Para retirarla, tras la beta: **Retirada el 18 de octubre de 2026** (ver abajo).

- [x] Quitar `builds-duel-30` de `PAGE_IDS`, `ROUTES` y del submenú de Builds en `src/i18n/routes.ts`, y su etiqueta en `src/i18n/ui.ts`.
- [x] Borrar `src/content/pages/{es,en}/builds-duel-30.mdx` y `public/og/{es,en}-builds-duel-30.png`.
- [x] Quitar las builds `frost-duels-30-*` de `src/data/builds.json` (o sustituirlas por las de nivel 60) y explicarlo en el historial.
- [x] Redirigir `/es/builds/duelos-nivel-30/` y `/en/builds/duels-level-30/` a la página de Builds con un archivo `public/_redirects` (301), para no romper enlaces compartidos.
- [x] Quitar el aviso del torneo del inicio (`home.mdx`), la mención en la tarjeta de Builds del inicio (`QuestionCards.astro`), en Talentos y en el aviso «Builds de la beta» de Builds.

### Documentos internos

- [ ] `README.md` (estado del juego), `docs/game-version.md`, `docs/content-validation.md` y los borradores de `docs/difusion.md`.

### Decisión pendiente: el historial

`src/data/changelog.json` tiene entradas de la época de la beta. Propuesta: dejarlas como archivo, agrupadas bajo «Beta (septiembre-octubre de 2026)», porque son historia y no información vigente. Si se prefiere que no quede nada, se pueden ocultar.

- [ ] Decidir qué hacer con el historial de la beta.

## 3. Lo que hay que revisar con el tiempo

### El día del lanzamiento

Comprobar en el juego y marcar como «Oficial» o «Probado en juego», o corregir:

- [ ] Datos de «Comunidad»: fecha de lanzamiento, razas, 51 puntos de talento y Legado.
- [ ] Datos de «Referencia Classic» y de la beta: tabla de hechizos por nivel de Leveo (hoy «Comunidad», de la lista del instructor de la beta), cuadrícula de habilidades de la Guía y filas de los talentos decisivos.
- [ ] Valores de los rangos intermedios de la calculadora de crítico (Fragmentos de hielo e Ignición).
- [ ] Prioridades de Combate y análisis de las páginas de rama: de «Análisis» a «Probado en juego».
- [ ] Objetos de `src/data/items.json` (misiones de clase, biblioteca, JcJ): estadísticas, niveles y rangos en el cliente final. Si cambia un icono, descárgalo a `public/icons/` (el build falla si falta uno).

### Con cada parche o hotfix

Forma parte de cada revisión de fuentes ([maintenance.md](maintenance.md)):

- [x] **Semana del 12 de octubre de 2026:** comprobar si llegan los cambios de raciales anunciados y anotarlos en la sección 1. Llegaron en las notas de la build del 15 de octubre; incorporados en la revisión del 16 de octubre.
- Las fichas de cambios, los mapas de talentos decisivos y la tabla de builds híbridas de Talentos.
- Las raciales y la recomendación de razas (sección 5), cuando existan.
- La versión del cliente (`client-version`).
- **Farmeo AoE y bajar de rango:** es lo más inestable, porque Blizzard ya los ha frenado a propósito y puede seguir haciéndolo.
- Builds, prioridades de estadísticas y equipo, cuando existan: cada una indica «válida para el parche X».

### Con el contenido nuevo

Forever añade contenido en todos los rangos de nivel:

- Nivel máximo («60 en el futuro previsible»), límite del Legado (16 puntos al lanzar) y modo Hardcore.
- Equipo de cada contenido nuevo, mazmorras y bandas.
- Nombres en español, a medida que el juego los muestre.
- «Lo más destacado de Forever» del inicio: tras el lanzamiento importa menos que las builds.
- Fuentes: enlaces rotos y webs nuevas (por ejemplo, calculadoras de talentos de Forever).

## 4. Builds: la prioridad tras el lanzamiento

Muchos lectores no querrán leer la teoría: buscarán una build que funcione y cómo jugarla. Al principio, **builds de leveo y de farmeo AoE**; cuando la gente llegue a 60, de mazmorras, banda, PvP y duelos. El contenido en profundidad se queda para quien quiera entender el Mago.

Del 1 al 30 ya está publicado como BETA (2026-10-14). Del 31 al 60 sigue bloqueado por el tope de nivel 30 de la beta y por la falta de valores oficiales de los talentos.

### Objetivo: builds viables que encajen con el contenido (fijado el 2026-10-18)

- **Primero, el leveo.** Es lo que buscará la gente en el lanzamiento: builds de leveo viables hasta el 60.
- **Solo builds con sentido.** Una build por rama solo si esa rama funciona para ese contenido. Si en un uso solo valen Escarcha y Fuego, solo aparecen esas dos: no hacemos una de Arcano para farmeo en área, mazmorras o banda si ese contenido se hace con otra rama. Más builds no es mejor.
- **Usos:** leveo, farmeo AoE, mazmorras, banda y PvP. Ya no hay apartado de duelos.
- **Recomendada frente a viable**: en cada uso y nivel, una build es la recomendada (`recommendedFor` en `builds.json`) y las demás se etiquetan «Viable». `npm run validate` da error si hay dos recomendadas para el mismo uso y nivel.
- **Nada inventado**: las builds de 60 esperan a tener datos del lanzamiento (talentos con valores del juego, mazmorras y bandas abiertas).

### Añadir una build de nivel 60

No hace falta tocar el diseño ni las páginas: la tarjeta y los filtros salen de `builds.json`.

1. Comprueba antes que la build tiene sentido para ese contenido (no la añadas solo para cubrir una rama).
2. Añádela a `src/data/builds.json` con `level: 60`, sus `uses` y su `spec` (`arcane`, `fire`, `frost` o `hybrid`). El resto de campos, como en CONTRIBUTING.md («Añadir o actualizar una build»).
3. Si es la mejor de su uso a nivel 60, pon ese uso en `recommendedFor`; si no, déjalo fuera y saldrá como «Viable». Para cambiar la recomendada, quítasela a la anterior en el mismo cambio.
4. Para una build de leveo que ya existe a nivel 30, no crees otra: sube su `level` a 60 y amplía `order` (punto 7 de CONTRIBUTING.md).
5. Si tiene guía en profundidad, enlázala con `page`; si no, la ficha completa queda en Builds.
6. `npm run check` y entrada en el historial con `refs: ["build:<id>"]`.

### Cómo debería ser

- [x] Una página propia «Builds», la primera del menú y del inicio, separada de la explicación de Talentos (hecho el 2026-10-13).
- [x] Filtro por uso y por rama arriba, como en el explorador de cambios (los filtros se guardan en la URL) (hecho el 2026-10-13).
- [x] Una tarjeta por build (hecho el 2026-10-13), con los datos en `src/data/builds.json`:
  - para qué sirve: Leveo, Farmeo AoE, Mazmorras, Banda, PvP o Duelos;
  - rama o ramas y tramo de nivel;
  - el reparto de puntos, la vista de calculadora y el enlace a Wowhead;
  - «Cómo se juega» en 3 a 5 pasos, puntos fuertes y débiles, y guía en profundidad si la hay;
  - los objetos clave, si hacen falta;
  - estado de verificación y parche en que se comprobó.
- [x] Builds de leveo con el orden de puntos nivel a nivel (campo `order` en `builds.json`, tabla `TalentOrder` en cada tarjeta) y la columna «Con Talented»: los puntos extra del perk de Legado van al final del orden (hecho del 1 al 30 el 2026-10-14).
- [x] Guía de leveo en la misma URL de Nivelación (`/es/nivelacion/`, `/en/leveling/`), con selector de builds (`BuildPicker`) y aviso de estado (`LevelingStatus`) (2026-10-14): en solitario (recomendada), mazmorras y área (experimental, desde el 22).
- [ ] **Ampliar el leveo al 60**, sin crear páginas nuevas: en cada build de `leveling`, subir `level` a 60, añadir los puntos 22 a 51 a `order` (más notas en `orderNotes`) y actualizar `points`. A nivel 40 llegan Descarga de Pirofrío y la doble especialización: valorar una build híbrida o de Fuego para el 31-60. El aviso BETA y las etapas se actualizan solos (`src/lib/leveling.ts`) cuando **todas** las builds de leveo llegan al 60.
- [ ] Probar en el juego las tres builds de leveo (sobre todo la de área, que es experimental) y pasarlas a `tested` o corregirlas.
- [ ] Si una build necesita otro orden con Talented (no solo los mismos puntos antes), hoy no se puede expresar: habría que añadir un segundo orden.
- [x] Etiqueta «Recomendada» o «Viable» en cada uso de la tarjeta (hecho el 2026-10-18). La build de leveo en solitario es la recomendada para leveo a nivel 30. Sin apartado de duelos.
- [ ] Builds de leveo viables hasta el 60 (prioridad), y después las de mazmorras, banda y PvP, solo en las ramas que tengan sentido para cada contenido. Pendientes de los datos del lanzamiento.

### Orden de publicación

Dentro de cada paso, primero la recomendada y después las viables que tengan sentido (no una por rama por obligación).

1. [ ] Leveo y farmeo AoE: del 1 al 30 publicado como BETA el 2026-10-14; del 31 al 60, el día del lanzamiento o lo antes posible.
2. [ ] Mazmorras.
3. [ ] Banda y PvP (cuando haya gente a nivel 60).

### Opción antes del lanzamiento

Hecho en parte el 2026-10-14: las builds del 1 al 30 están razonadas con los valores de la calculadora de Wowhead (datos de la beta), pero sin probar en el servidor. Con acceso a la beta se puede probar ya una build de leveo del 10 al 30: a nivel 30 hay 26 puntos con el perk de Legado Talented (21 sin él), suficientes para llegar al talento decisivo de 21 de una rama. Si el juego muestra las descripciones de todo el árbol, como en Classic, también se pueden leer algunos valores. Sería información de beta (marcada así y revisada al lanzar), pero la build de leveo estaría lista el primer día.

## 5. Razas: cuál elegir según para qué juegues

«¿Qué raza hago?» es de las primeras preguntas al crear un personaje. La respuesta depende de para qué juegues, así que no basta con una «mejor raza»: hay que explicar el porqué y en qué situación.

Publicada el 2026-10-13 con las raciales de la beta. Hay que revisarla con cada cambio de raciales y tras el lanzamiento.

### Cómo debería ser

- [x] Una página «Razas», enlazada desde el menú, el inicio (pregunta «¿Qué raza elijo?») y la guía de duelos (hecho el 2026-10-13).
- [x] Una recomendación por situación: leveo, mazmorras y banda, JcJ y duelos, y farmeo en área (hecho el 2026-10-13).
- [x] Para cada raza (hecho el 2026-10-13):
  - facción (Alianza u Horda);
  - raciales que importan al Mago y por qué;
  - en qué situación destaca y en cuál no aporta;
  - estado de verificación y parche en que se comprobó.
- [x] Una tabla comparativa corta arriba para quien solo quiera la respuesta, y la explicación debajo (hecho el 2026-10-13).

### Pendiente

- [ ] Pasar las raciales a «Oficial» (si Blizzard publica la lista) o a «Probado en juego».
- [ ] Revisar las recomendaciones tras los cambios de raciales del 15 de octubre. Hecho en parte el 2026-10-16 (valores de Ruthless, Savage, Wind Blessed, Shatter Curse y Touch of the Grave, y el motivo de «Mazmorras y bandas»); falta decidir si el Cielonato sube en la tabla de mazmorras y si el Orco baja en JcJ.

## 6. Mejoras de la experiencia

Ideas para enriquecer la web para quien viene a ver guías, aprender o informarse sobre el Mago. Lista recogida el 2026-10-12. Cada idea indica cuándo se puede hacer:

- **Ya**: con lo que hay hoy.
- **Casi ya**: se puede escribir con referencias de Classic, marcadas como tales.
- **Con datos**: necesita datos del lanzamiento.
- **Con juego**: necesita grabar o probar en el juego.

Al hacer una idea, márcala y anota dónde está.

### Encontrar rápido lo que busco

- [ ] **Inicio orientado a tareas** (con datos): accesos directos arriba a «Build de leveo», «Build de farmeo AoE», «Qué raza elijo» y «Qué ha cambiado esta semana»; la explicación en profundidad, debajo.
- [x] **Builds con filtros** por uso y rama (hecho el 2026-10-13). Ver la sección 4.
- [x] **Razas** (hecho el 2026-10-13). Ver la sección 5.
- [ ] **Caja «Lo esencial»** al principio de cada página, uniforme en todas (ya).
- [ ] **Buscador más visible** (ya): atajo de teclado a la vista y sugerencias («Lanza de hielo», «leveo», «golpe»).

### Aprender jugando

- [ ] **Guía «Mi primer Mago» del 1 al 20** (casi ya): qué entrenar en cada nivel, cuándo beber, Nova de Escarcha y Blink, y errores típicos.
- [ ] **Planificador de talentos en profundidad** (con datos): puntos con clic, requisitos y enlace para compartir, con cada talento explicado. De momento, cada build tiene su vista de calculadora y enlace a Wowhead (2026-10-13); el planificador propio espera a los valores definitivos.
- [ ] **Orden de puntos por nivel** en las builds de leveo, del 10 al 60 (con datos). Del 10 al 30, hecho el 2026-10-14 (tabla «Orden de puntos» de cada build).
- [ ] **Prioridades en formato «de bolsillo»** (ya): versión compacta de Combate para tener abierta en el móvil mientras juegas.
- [ ] **Glosario** (ya): bajar de rango, hito, proc, kitear, Trizar…, con tooltip al pasar por encima del término en cualquier página.
- [x] **Tooltips de hechizos** (hecho el 2026-10-13): los nombres en negrita de las páginas y los talentos de las builds muestran escuela o rama, nivel o fila y cambios en Forever (`src/lib/spells.ts`). Sin coste de maná: no hay cifras oficiales.

### Herramientas

- [ ] **Calculadora de golpe** contra enemigos de cada nivel, con los talentos de acierto (con datos).
- [ ] **Comparador de ramas para leveo**: tiempo por enemigo, descansos y riesgo (con datos).
- [ ] **Equipo por tramo de nivel**, con filtros por espacio y por cómo se consigue (con datos).
- [ ] **Planificador de portales y teletransportes**: destinos por nivel y componentes (casi ya).
- [ ] **Calculadora de crítico ampliada** con la probabilidad de crítico, para estimar el daño medio (con datos).

### Mantenerse informado

- [ ] **«Qué ha cambiado para el Mago esta semana»** en el inicio, a partir de cada revisión de fuentes (ya).
- [ ] **Avisos de lo que te interesa** (ya): RSS por rama, o una marca de «nuevo desde tu última visita» guardada en el navegador.
- [ ] **Diferencias entre parches**: antes y después por talento (tras el lanzamiento).
- [ ] **Aviso de build desactualizada** si se comprobó en un parche anterior al actual (con datos).

### Comodidad y confianza

- [ ] **Vista compacta o «de juego»**: menos texto y solo listas y tablas (ya).
- [ ] **Iconos e imágenes de hechizos** (antes, revisar los derechos de los recursos de Blizzard).
- [ ] **Vídeos o GIF cortos de mecánicas**, por ejemplo Nova de Escarcha y Lanza de hielo, o las cargas de Calentamiento (con juego).
- [ ] **Botón «¿Algo está mal?» en cada ficha**, que abra una issue o un formulario sencillo (ya).
- [ ] **Fecha y parche visibles en cada build y en cada tabla**, no solo en la cabecera de la página (ya).

### Comunidad y difusión

- [ ] **Imagen para compartir cada build** en Discord o Reddit, con enlace a la web (con datos).
- [ ] **Preguntas frecuentes reales**, recogidas de Reddit, Discord y los foros (ya).
- [ ] **Contenido largo en español**: hay poca competencia y es la mayor ventaja para los buscadores (ya).

### Orden propuesto

1. **Antes del lanzamiento (4 de noviembre de 2026):** glosario y tooltips de hechizos, «Mi primer Mago» del 1 al 20, resumen semanal en el inicio y botón «¿Algo está mal?».
2. **Semana del lanzamiento:** inicio orientado a tareas, Builds (leveo y farmeo AoE) y Razas.
3. **Después:** planificador de talentos, equipo, calculadora de golpe y contenido de nivel 60.

## 7. Profesiones: cuáles elegir

Publicada el 2026-10-14 con los datos de la beta: recomendaciones por objetivo, comparativa de las nueve profesiones principales, análisis de cada una, objetos de campamento y profesiones secundarias (`src/data/professions.json`, `src/data/profession-picks.json`). Notas de la investigación y lista de lo que falta por verificar: [professions-research.md](professions-research.md).

### Pendiente

- [ ] Tras el lanzamiento, revisar en el juego los objetos citados (nivel, estadísticas, ligado) y pasar a «Probado en juego» lo que se compruebe.
- [ ] Confirmar si los campamentos se pueden montar en mazmorras y bandas, el valor de cada mejora por nivel y la regla de un objeto por jugador.
- [ ] Averiguar de dónde salen las recetas sin fuente en la beta (explosivos EZ-Thro, Frozen Heart of the Mountain, Brilliant Wand, equipo de Sastrería de nivel 40-50).
- [ ] Con las primeras bandas: revisar la recomendación de PvE a nivel 60 (Sastrería + Alquimia) según cuánto aguanten la Robe of the Archmage y los objetos de Encantamiento.
- [ ] Si Blizzard publica los puntos de Legado por profesión o los perks del árbol de Profesiones, pasar esos datos a «Oficial».
- [ ] Enlazar la página desde Equipo («Encantamientos y consumibles») cuando esa sección deje de estar pendiente.

## 8. Addons para el Mago

Publicada el 2026-10-14 (`/es/addons/`, `/en/addons/`, dentro de Herramientas) con **MageProcs 1.60.1**, el addon de alertas de procs de Sheep Happens, publicado como Release en <https://www.curseforge.com/wow/addons/mageprocs>. La página es corta a propósito: un párrafo, las 6 imágenes de su ficha de CurseForge (`arcane_flare/publication/screenshots/*.png`, en WebP en `public/addons/mageprocs/`), los procs, la instalación con los comandos y los límites. Los datos están en `src/data/addons.json`; las fuentes, el código y la documentación del addon (proyecto local `arcane_flare`).

### Pendiente

- [x] **Ficha de CurseForge pública** (2026-10-14): abre sin sesión, MageProcs 1.60.1 para Forever; `listing` es `"live"`.
- [x] **MageProcs y Estela de Fuego (15 oct):** MageProcs 1.2.0 quita la alerta de Estela de Fuego y añade el contador opcional de Explosión Arcana; `addons.json`, Addons y Herramientas lo describen (2026-10-16).
- [ ] **Subir MageProcs 1.2.0 a CurseForge.** El 2026-10-16 CurseForge aún sirve la 1.1.0 (con Estela de Fuego), mientras la web describe la 1.2.0.
- [ ] **Capturas nuevas de MageProcs.** Tres de las seis imágenes de la galería (02 opciones, 03 estilos y 05 visualización) muestran «Wake of Fire» en la lista de procs y «Version 1.60.1». Hay que hacerlas de nuevo en `arcane_flare/publication/screenshots/`, convertirlas a WebP en `public/addons/mageprocs/` y actualizarlas también en CurseForge.
- [ ] **Con cada versión nueva del addon**: actualizar `version`, `game` (versión e interfaz del `.toc`), procs, comandos y límites según su changelog, y `checked`. Si cambian las imágenes de CurseForge, volver a convertirlas.
- [ ] **Cuando se confirmen procs en el juego** con Magos de nivel alto: quitar el primer límite de `limitations`.
- [ ] **Addons nuevos**: solo si aportan algo concreto al Mago en Forever y se han revisado. Cada uno con descripción, procs o funciones, instalación, límites y enlace oficial; `origin: "third-party"` y su autor si no es nuestro.

## 9. Ideas de los lectores y tabla unificada

Recogido el 2026-10-19 a partir del primer feedback largo de un lector, junto con las ideas de las secciones 1, 4 y 6. Es la vista de conjunto; el detalle de cada idea sigue en su sección. Al hacer una idea, márcala aquí y en su sección.

### Lo que pidió el lector (2026-10-19)

- Constructor de talentos y prioridad de estadísticas y equipo (ya estaban en el plan).
- Guías de farmeo de mazmorras de un solo pull con AoE, cuando la comunidad las descubra.
- Guías de PvP detalladas (y arenas, si Blizzard las añade).
- Con las bandas: qué rama rinde mejor en cada banda, con una cifra aproximada («Escarcha hace el 90 % del daño de Arcano») y guías para jugarlas.
- Ahora: guías de leveo con imágenes y vídeos («soy muy visual»).
- Idea grande: importar el personaje (equipo y talentos) y que la web sugiera mazmorras para mejorar el equipo o talentos para hacer más daño.

### Tabla

Dificultad: baja, media, alta o muy alta. Origen: L (lector), N (nuestra).

| Idea | Origen | Dificultad | Bloqueo | Estado |
|---|---|---|---|---|
| Constructor de talentos propio | L + N | Alta | Valores oficiales de los talentos | **Hecho el 2026-10-19** (Herramientas → Calculadora de talentos), con las descripciones del juego vía Wowhead; los valores se confirman al lanzar |
| Prioridad de estadísticas y equipo | L + N | Media | Datos del 31 al 60 | Esperar al lanzamiento |
| Farmeo de mazmorras con pulls de AoE | L | Media | Probarlo en el juego; Blizzard lo frena | Tras el lanzamiento, en Farmeo AoE |
| Guías de PvP detalladas | L + N | Media | Builds de 60; no hay arenas | Tras el lanzamiento |
| Rama por banda con % relativo | L | Alta | No hay bandas; hace falta una fuente de registros (Warcraft Logs) | Cuando haya bandas y registros |
| Guías de banda | L + N | Media | No hay bandas | Cuando haya bandas |
| Leveo con imágenes, GIF y vídeos | L + N | Media | Grabar en el juego | Capturar mientras haya acceso al juego |
| Importar personaje y recibir sugerencias | L | Muy alta | API de Blizzard para Forever (desconocida), datos de objetos | Prueba propuesta: exportar una cadena desde MageProcs ([mageprocs-export-prompt.md](mageprocs-export-prompt.md)) |
| Leveo hasta el 60 | N | Media | Tope de la beta | Día del lanzamiento (sección 4) |
| Builds de mazmorras, banda y PvP | N | Media | Datos del 60 | Tras el leveo (sección 4) |
| Botón «¿Algo está mal?» en cada ficha | N | Baja | — | **Hecho el 2026-10-19** (builds, cambios y razas: abre el formulario con la ficha ya indicada) |
| Fecha y parche en cada build | N | Baja | — | **Hecho el 2026-10-19** (pie de cada tarjeta de build) |
| Glosario con tooltip | N | Baja | — | **Hecho el 2026-10-19** (`src/data/glossary.json`, sección Glosario de Aprende) |
| «Qué ha cambiado esta semana» en el inicio | N | Baja | — | **Hecho el 2026-10-19** (solo las entradas de tipo «Juego» de `changelog.json`: cambios de Blizzard que afectan al Mago, no los de la web) |
| Aviso de build desactualizada | N | Baja | Que haya parches tras el lanzamiento | Tras el lanzamiento |
| Calculadora de golpe | N | Baja | Valores de acierto en Forever | Con datos |
| Comparador de ramas para leveo | N | Media | Datos y pruebas | Con datos |
| «Mi primer Mago» del 1 al 20 | N | Media | — | Siguiente candidata (junto con imágenes) |
| Prioridades «de bolsillo» y vista compacta | N | Baja | — | Ya se puede |
| Caja «Lo esencial» uniforme | N | Baja | — | Ya se puede |
| Buscador más visible | N | Baja | — | Ya se puede |
| Inicio orientado a tareas | N | Baja | Builds del lanzamiento | Semana del lanzamiento |
| Planificador de portales | N | Baja | Niveles de aprendizaje oficiales | Casi (con referencia Classic) |
| RSS por rama o «nuevo desde tu visita» | N | Baja | — | Ya se puede |
| Imagen para compartir cada build | N | Media | Builds del 60 | Infraestructura OG ya existe |
| Diferencias entre parches por talento | N | Media | Varios parches | Tras el lanzamiento |
| Preguntas frecuentes reales | N | Baja | — | Ya se puede |
| Modo Hardcore | N | Media | No ha salido | Cuando salga |
| MageProcs 1.2.0 en CurseForge y capturas nuevas | N | Baja | — | Pendiente (sección 8) |

### Siguiente tanda propuesta

1. «Mi primer Mago» del 1 al 20 con capturas y GIF cortos.
2. Prueba del export de MageProcs: si funciona, una página que lea la cadena y compare el personaje con las builds.
3. Calculadora de talentos: al lanzar, revisar `spell-text.json` (`npm run spells:text`) y quitar el aviso de valores de beta.
