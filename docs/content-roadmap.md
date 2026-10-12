# Hoja de ruta del contenido

> Creado: 2026-10-12 · Revisión: 2026-10-12 · Versión de juego: `forever-beta-2026-10` (lanzamiento el 4 de noviembre de 2026)

Lista viva de lo que falta, de lo que hay que quitar al lanzar y de lo que hay que vigilar con el tiempo, para que la guía esté siempre al día y dé a cada lector lo que busca:

1. Lo que todavía no existe (ni está publicado ni se puede probar en la beta).
2. Lo que es de la beta y hay que quitar o reescribir: **tras el lanzamiento no debe quedar nada de la beta en la web**.
3. Lo que ya tenemos, pero hay que revisar a medida que avance el juego.
4. Builds: lo que más buscará la gente tras el lanzamiento.
5. Razas: cuál elegir según para qué juegues.

## Cómo usar este documento

Revísalo **cada vez que actualices la guía**: en cada revisión de fuentes (miércoles y viernes), al cambiar un dato o una página y con cada parche.

1. Marca con `[x]` lo que esté resuelto y anota dónde (página o dato) y la fecha.
2. Añade lo nuevo que falte o que haya que vigilar.
3. Actualiza la fecha de «Revisión» de la cabecera.

Las reglas de siempre siguen vigentes: cada dato lleva su estado de verificación ([content-sources.md](content-sources.md)), nunca se usan valores de Retail o de Classic como si fueran de Forever, y cada cambio de datos lleva su `updated` y su entrada en el historial ([maintenance.md](maintenance.md)). Todo cambio de texto se hace en los dos idiomas (`es` y `en`).

## 1. Lo que todavía no existe

### Talentos y builds

- [ ] Árbol completo de Forever con sus valores. Blizzard solo ha publicado los cambios; sin el árbol no hay builds ni planificador.
- [ ] Talento decisivo de 16 puntos de Fuego (`fire-16` en `src/data/milestones.json`).
- [ ] Filas de Piroexplosión, Ola explosiva, Combustión, Presencia mental y Poder Arcano (ahora son «Referencia Classic» en `milestones.json`).
- [ ] Requisito entre Dedos de Escarcha y Lanza de hielo (discrepancia abierta en `content-validation.md`).
- [ ] Builds probadas: leveo, farmeo AoE, mazmorras, banda, PvP y duelos (ver la sección 4).
- [ ] Calculadora de talentos de Forever (de Wowhead u otra web) o formato para compartir builds.

### Valores numéricos

- [ ] Daño, coste y probabilidad de Explosión Arcana (lo que aporta cada carga), Lanza de hielo, Descarga de Pirofrío, Tromba de misiles, Calentamiento, Dedos de Escarcha y Estela de Fuego.

### Contenido de los niveles 31 a 60

- [ ] Qué rama sube mejor de nivel (aviso pendiente en Nivelación).
- [ ] Orden de los hechizos de área (Ventisca, Cono de frío, Deflagración Arcana, Flamestrike) y aperturas por rama (avisos pendientes en Combate).
- [ ] Prioridad de estadísticas por rama y actividad, y cuánto golpe hace falta (Equipo).
- [ ] Equipo por tramo de nivel, equipo antes de bandas y mejor equipo posible.
- [ ] Encantamientos, consumibles y profesiones.
- [ ] Mazmorras, bandas y PvP nuevos de Forever.
- [ ] Zonas y rutas de farmeo.

### Sistemas

- [ ] Niveles de aprendizaje: 24 de las 25 habilidades de `src/data/abilities.json` usan los de Classic (solo Descarga de Pirofrío a nivel 40 es oficial).
- [ ] Coste de la doble especialización y nivel definitivo (40 o antes).
- [ ] Recompensas de Comprensión.
- [ ] Partes del Legado que sirven al Mago (por ejemplo, Reagent Economy).
- [ ] Nombres oficiales en español de los hechizos que no salen en el artículo de Blizzard sobre el Mago (Blink, Evocation, Flamestrike, Combustion, Ice Barrier…).
- [ ] Modo Hardcore (llegará más adelante).

### Razas

- [ ] Habilidades raciales de Forever de las seis razas de Mago (Humano, Gnomo, Skyborne, Orco, No-muerto y Trol). Wowhead anticipó el 8 de octubre de 2026 cambios en las raciales para la semana siguiente («Changes to Racials Likely Coming Next Week»).
- [ ] Raciales de Skyborne (raza nueva) y del Orco Mago (nuevo en Forever): no hay referencia de Classic que sirva.

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
- [ ] Nivelación: resumen («la beta solo permite llegar al nivel 30»), el dato `beta` de la lista de datos, el aviso pendiente de qué rama elegir y la descripción SEO («qué falta por comprobar»).
- [ ] Talentos: «nadie ha podido probarlas por encima del nivel 30» y el aviso pendiente de builds.
- [ ] Combate: aviso «Análisis sin probar… sin acceso a los niveles 31 a 60».
- [ ] Cambios: aviso «Información de beta».
- [ ] Equipo: aviso pendiente que cita el nivel 60 de la beta.
- [ ] Arcano, Fuego y Escarcha: secciones «Lo que falta por saber».
- [ ] Fuentes y Cambios: borrar la discrepancia «Fin de la beta» y resolver «Nivel de la doble especialización» y «Requisito de Dedos de Escarcha».
- [ ] Error de la beta con Misiles Arcanos (recibir daño dispara un misil con el daño completo): comprobar si sigue.

### Documentos internos

- [ ] `README.md` (estado del juego), `docs/game-version.md`, `docs/content-validation.md` y los borradores de `docs/difusion.md`.

### Decisión pendiente: el historial

`src/data/changelog.json` tiene entradas de la época de la beta. Propuesta: dejarlas como archivo, agrupadas bajo «Beta (septiembre-octubre de 2026)», porque son historia y no información vigente. Si se prefiere que no quede nada, se pueden ocultar.

- [ ] Decidir qué hacer con el historial de la beta.

## 3. Lo que hay que revisar con el tiempo

### El día del lanzamiento

Comprobar en el juego y marcar como «Oficial» o «Probado en juego», o corregir:

- [ ] Datos de «Comunidad»: fecha de lanzamiento, razas, 51 puntos de talento y Legado.
- [ ] Datos de «Referencia Classic»: tabla de niveles de Nivelación, cuadrícula de habilidades de la Guía y filas de los talentos decisivos.
- [ ] Valores de los rangos intermedios de la calculadora de crítico (Fragmentos de hielo e Ignición).
- [ ] Prioridades de Combate y análisis de las páginas de rama: de «Análisis» a «Probado en juego».

### Con cada parche o hotfix

Forma parte de cada revisión de fuentes ([maintenance.md](maintenance.md)):

- [ ] **Semana del 12 de octubre de 2026:** comprobar si llegan los cambios de raciales anunciados y anotarlos en la sección 1.
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

Bloqueado ahora por el tope de nivel 30 de la beta y por la falta de valores de los talentos.

### Cómo debería ser

- [ ] Una página propia «Builds», la primera del menú y del inicio, separada de la explicación de Talentos.
- [ ] Filtro por uso arriba, como en el explorador de cambios (los filtros se guardan en la URL).
- [ ] Una tarjeta por build con:
  - para qué sirve: Leveo, Farmeo AoE, Mazmorras, Banda, PvP o Duelos;
  - rama o ramas y tramo de nivel;
  - el reparto de puntos, en imagen o con enlace a una calculadora;
  - «Cómo se juega» en 3 a 5 líneas, con enlace a la prioridad de Combate;
  - los objetos clave, si hacen falta;
  - estado de verificación y parche en que se comprobó.
- [ ] Builds de leveo con el orden de puntos por tramos (10-20, 20-40 y 40-60): a nivel 40 llegan Descarga de Pirofrío y la doble especialización, y la build cambia.

### Orden de publicación

1. [ ] Leveo y farmeo AoE (el día del lanzamiento o lo antes posible).
2. [ ] Mazmorras.
3. [ ] Banda, PvP y duelos (cuando haya gente a nivel 60).

### Opción antes del lanzamiento

Con acceso a la beta se puede probar ya una build de leveo del 10 al 30: a nivel 30 hay 21 puntos, suficientes para llegar al talento decisivo de 21 de una rama. Si el juego muestra las descripciones de todo el árbol, como en Classic, también se pueden leer algunos valores. Sería información de beta (marcada así y revisada al lanzar), pero la build de leveo estaría lista el primer día.

## 5. Razas: cuál elegir según para qué juegues

«¿Qué raza hago?» es de las primeras preguntas al crear un personaje. La respuesta depende de para qué juegues, así que no basta con una «mejor raza»: hay que explicar el porqué y en qué situación.

Bloqueado ahora porque las raciales de Forever no son definitivas: se esperan cambios y Skyborne y el Orco Mago son nuevos.

### Cómo debería ser

- [ ] Una sección o página «Razas», enlazada desde el inicio (pregunta «¿Qué raza elijo?») y desde Builds.
- [ ] Una recomendación por situación: leveo, mazmorras y banda (PvE), PvP y duelos, y farmeo.
- [ ] Para cada raza:
  - facción (Alianza u Horda);
  - raciales que importan al Mago y por qué;
  - en qué situación destaca y en cuál no aporta;
  - estado de verificación y parche en que se comprobó.
- [ ] Una tabla comparativa corta arriba para quien solo quiera la respuesta, y la explicación debajo.

### Puntos de partida (Classic, sin publicar)

En Classic se suelen recomendar Gnome (Escape Artist e Intelecto) y Human (Spirit) en Alianza, y Undead (Will of the Forsaken, para PvP) y Troll (Berserking, para PvE) en Horda. **Solo sirve para saber qué comprobar:** no se publica como dato de Forever hasta verlo en el juego o en una fuente oficial.
