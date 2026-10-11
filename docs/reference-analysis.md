# Análisis de la referencia: Wings Is Up

> Fecha de inspección: 2026-10-11. Herramientas: navegador integrado (DOM, estilos calculados, clics y teclado reales), Wayback Machine (índice CDX y capturas de 2024-2025).
> Alcance: el usuario pidió detener el análisis en profundidad una vez entendidas las ideas principales, porque gran parte del contenido es específico de Retail y no se aplica a Forever. Este documento recoge solo lo que se llegó a observar.

Convenciones: **[H]** = hecho observado · **[C]** = conclusión · **[P]** = propuesta propia.

## 1. Qué es hoy la web

- [H] `wingsisup.com` es una guía de **Paladín Sagrado** (Retail, *Midnight* temporada 2) creada por un único autor (Ellesmere).
- [H] La versión actual en vivo se reduce a tres páginas útiles: `/home`, `/quickview` (guía rápida de una sola página) y `/eui` (promoción de su addon de interfaz). El propio texto de `/quickview` dice que la guía completa no está disponible por falta de tiempo del autor.
- [H] La **guía completa** existió hasta 2025 en seis páginas (`/wiu-overview`, `/wiu-talents`, `/wiu-setup`, `/wiu-playstyle`, `/wiu-dungeons`, `/wiu-interface`) y se ha inspeccionado a través de capturas de la Wayback Machine.
- [C] La propia evolución del sitio, de seis páginas a una "quickview", indica que **el coste de mantener contenido extenso escrito a mano es su principal problema**. Separar el contenido de la presentación (requisito de este proyecto) responde directamente a ese riesgo.

## 2. Diseño visual

| Aspecto | Observación [H] | Valoración [C] |
|---|---|---|
| Fondo | Negro / casi negro (`#000`, `#090909`, `#222`) con ilustración de la expansión a pantalla completa en la portada y una textura en las páginas. | Ambienta bien, pero la portada depende de una imagen JPG de 3200×1788. |
| Acentos | Verde azulado `#0CD29D` (enlaces, elemento activo), oro `#E0A95E` (nombres de hechizos, títulos de build), rojo `#EA3F3F` (debilidades, "Required"), amarillos y naranja para las escalas de valor. | Los colores tienen significado (valor de un talento, dificultad de un jefe). Sin embargo, el significado solo se transmite mediante el color y una palabra. |
| Tipografía | Cuerpo en Open Sans **13 px**, interlineado 24 px; títulos en Lato 24–42 px; enlaces de navegación en peso 300. | El cuerpo de 13 px sobre fondo negro resulta pequeño para leer mientras se juega. **[P]** Usar un cuerpo de 16–17 px como mínimo. |
| Separadores | Ornamentos horizontales con temática de la expansión entre secciones; secciones alternas sobre fondo gris (`.section.gray`). | La alternancia de fondos ayuda a percibir los bloques en páginas largas. Es barata y eficaz. |
| Iconos | Iconos circulares de hechizos y talentos como elemento principal de navegación dentro de una sección. | Son muy visuales, pero no tienen texto alternativo (22 de las 25 imágenes de `/quickview` carecen de `alt`). |
| Densidad | Texto centrado en los encabezados de bloque y párrafos justificados a la izquierda; mucho espacio vertical. | Se lee de forma cómoda, pero las páginas resultan muy largas (`/quickview` mide unos 20 000 px). |

## 3. Arquitectura de información

- [H] La navegación global está en una cabecera fija: logo → inicio, "Quickview Guide", "Full Written Guide" (submenú con 6 páginas), vídeo de la build, tienda y stream.
- [H] La guía completa sigue un **orden pedagógico**: introducción (incluye una "New Player Section" con el aviso "Skip this if you know the basics") → talentos → estadísticas y equipo → estilo de juego → mazmorras → addons.
- [H] Cada página termina con un bloque **"Next: …"** que lleva a la siguiente.
- [H] Dentro de cada página, las secciones tienen `id` (`#healing-cooldowns`, `#beacon`, …) y un icono de enlace que **copia la URL de la sección** al portapapeles.
- [H] **No hay índice de contenidos dentro de la página** ni buscador. La única forma de saltar a una sección es conocer el ancla o desplazarse.
- [H] La versión rápida (`/quickview`) repite el mismo esquema para dos contextos (Mythic+ y Raid): build → hechizos clave → prioridad de estadísticas → abalorios → bonificaciones de conjunto → enfriamientos → prioridades numeradas.
- [C] El valor de la web está en la **doble lectura**: una versión de consulta rápida (resumen por contexto) y una versión de aprendizaje (páginas largas en orden). Ese es el patrón más importante que se debe adaptar.

Ver el mapa completo en [reference-navigation.md](reference-navigation.md).

## 4. Interactividad observada

Todas las interacciones se han probado con clics reales en el navegador integrado.

| Interacción | Qué hace [H] | Feedback [H] | Valoración [C] |
|---|---|---|---|
| **Tira de iconos → ficha** ("bubbles") | Al pulsar un icono de una fila, se muestra la ficha correspondiente debajo: nombre enlazado a Wowhead, línea técnica ("Instant Cast // Costs 3 HP") y explicación. | El icono activo se ilumina y los demás se atenúan. | Condensa entre 6 y 30 fichas en el espacio de una. Sin embargo, el usuario no sabe qué es cada icono hasta que lo pulsa, y los iconos son `div` sin foco de teclado. |
| **Prioridad de estadísticas** | `Haste (~25%) > Vers / Crit / Mastery`. Cada estadística se puede pulsar y muestra su justificación. | La estadística activa cambia a color oro. | Muestra el orden y el porqué en una sola línea. Es muy reutilizable. |
| **Valor del talento por contexto** | Cada talento muestra "Value: Required (M+), Medium (Raid)" con colores. | Solo el color y el texto. | Responde a "¿lo necesito?" según la actividad. Encaja con Forever si se distinguen nivelación, mazmorras y PvP. |
| **Copiar cadena de talentos** | Copia la cadena de importación del juego. | Aviso "Success!" o "Whoops!". | Solo es útil si el juego tiene un formato de importación verificado. **Forever no lo tiene confirmado.** |
| **Copiar enlace de sección** | Al pulsar el título de una sección o el `h1`, se copia la URL con el ancla. | El mismo aviso. | Útil para compartir en Discord. La pista visual (icono de cadena) es pequeña. |
| **Selector de mazmorra** | Una fila de 8 imágenes de mazmorras; al pulsar una, se muestran sus jefes y la URL cambia a `#nombre-mazmorra`. | Imagen activa resaltada y **hash en la URL** (enlazable). | Patrón excelente: filtrar y enlazar sin recargar la página. |
| **Dificultad de sanación por jefe** | Etiqueta "Healing Difficulty: High/Medium/Low" con colores. | — | Prioriza la atención. Se puede adaptar como "importancia para el Mago" por encuentro, cuando haya contenido. |
| **Menú móvil** | El botón hamburguesa abre un desplegable con fondo oscurecido. | Fondo oscuro; se cierra al pulsar fuera. | **No se cierra con Escape** (comprobado) y no gestiona el foco. |
| **Bloque "Next"** | Enlace a la siguiente página de la guía. | — | Guía el aprendizaje lineal con coste nulo. |

## 5. Calidad técnica

- [H] Sitio de páginas generadas en el servidor con jQuery 3.2.1 y un único script en línea de unas 15 KB que enlaza todos los eventos. También carga Font Awesome, Google Analytics y el reproductor de Twitch incrustado en el pie de **todas** las páginas.
- [H] Las rutas son "planas" y versionadas por expansión (`/df-talents`, `/tww-talents`, `/wiu-talents`). Con cada expansión las URLs cambian y los enlaces antiguos dejan de apuntar al contenido actual.
- [H] SEO: tienen `description`, `keywords`, Open Graph y Twitter Card, pero el `<title>` es el mismo en todas las páginas, la portada no tiene `canonical` y el idioma es `lang="en"`.
- [H] Semántica: no hay `main`, `nav` ni `footer`; solo un `h1` por página y ningún `h2` o `h3` (los títulos de sección son `div`); no hay `button`, `tabindex` ni atributos ARIA. Hay 38 elementos interactivos que no reciben foco de teclado y el foco no es visible (`outline: none`).
- [H] Diseño adaptable: 10 puntos de ruptura (de 480 a 2200 px). En unos 760 px pasa a menú hamburguesa y a una sola columna.
- [C] Sus puntos débiles son la accesibilidad por teclado, la semántica, las URLs inestables y el peso del pie (iframe de Twitch). Sus puntos fuertes son la jerarquía visual y la interacción de condensar y desplegar.

## 6. Conclusiones aplicables a Sheep Happens

1. **[P]** Mantener la doble lectura: una **vista rápida** por contexto y **páginas de aprendizaje** en orden con "Siguiente".
2. **[P]** Adaptar el selector de icono → ficha, pero con **nombre visible**, botones reales, navegación con flechas y contenido completo en el HTML (accesible sin JavaScript e indexable por el buscador).
3. **[P]** Prioridades y estadísticas como **cadenas ordenadas con justificación**, nunca como rankings universales sin contexto.
4. **[P]** Valoración por contexto (nivelación / mazmorras / PvP), **solo cuando haya datos**. Hoy Forever está en beta, por lo que esas valoraciones quedan pendientes.
5. **[P]** Añadir lo que Wings Is Up no tiene: **índice de contenidos**, **buscador por secciones**, **estado de verificación y fuentes visibles**, **fecha de revisión** y **URLs estables sin el prefijo de la expansión**.
6. **[P]** Descartar: la copia de cadenas de talentos (formato no verificado en Forever), el stream incrustado, la tienda y el contenido de Retail (Mythic+, abalorios, bonificaciones de conjunto, héroes).
