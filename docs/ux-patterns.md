# Catálogo de patrones UX

Patrones observados en Wings Is Up (WIU) y patrones propios añadidos para cubrir lo que le falta. Prioridad: **P0** = primera versión publicable · **P1** = interactividad avanzada · **P2** = cuando haya datos o demanda.

## Tabla de patrones

| Patrón observado | Problema que resuelve | Cómo funciona | Aplicación a la guía de Mago | Prioridad |
|---|---|---|---|---|
| Tira de iconos → ficha (WIU "bubbles") | Muchas habilidades o talentos ocupan demasiado espacio en vertical | Una fila de iconos; al pulsar uno se muestra su ficha y el resto queda oculto | **Explorador de talentos por rama**: botones con nombre visible y una ficha con su efecto, la fuente y su estado. Navegación con flechas. Sin JS se muestran todas las fichas en lista. | P0 |
| Cadena de prioridad clicable (estadísticas) | El "orden" sin el "porqué" no enseña nada | `A > B > C`; cada eslabón muestra su justificación | Prioridades **condicionales** de combate por rama (p. ej., "Ice Lance solo sobre objetivo congelado"), con estado de verificación | P0 (conceptual) / P2 (valores) |
| Valor del talento por contexto | "¿Necesito este talento?" depende de la actividad | Etiqueta de valor por contexto (M+ o Raid) | Valor por **nivelación / mazmorras / PvP** cuando haya pruebas. Hoy: "pendiente" | P2 |
| Guía rápida frente a guía completa | Un jugador en partida necesita la respuesta en segundos; uno nuevo necesita contexto | Dos niveles de profundidad | Página "Cambios en Forever" (consulta) y "Guía de clase" (aprendizaje) + **resumen al principio** de cada página | P0 |
| "Next: …" al final de la página | Saber qué leer después | Enlace a la siguiente página del recorrido | Paginación anterior/siguiente en el recorrido de la guía | P0 |
| Enlace copiable a una sección | Compartir una respuesta concreta en Discord | Icono de cadena junto al título; copia la URL con ancla | Botón `#` accesible en cada `h2`/`h3` con aviso "Enlace copiado" (`aria-live`) | P0 |
| Selector con estado en la URL (mazmorras) | Filtrar sin perder la posibilidad de enlazar | Hash `#mazmorra` actualizado al seleccionar | **Filtros del explorador de cambios en la URL** (`?rama=frost&tipo=new`): compartibles | P0 |
| Etiquetas de dificultad con color | Priorizar la atención | Palabra y color | **Insignias de verificación** (oficial, comunidad, referencia Classic, análisis, pendiente) con icono + texto + color, nunca solo color | P0 |
| Secciones con fondo alterno y separadores | Percibir bloques en páginas largas | Fondo gris alterno y ornamento | Secciones con superficie alterna sutil; ornamento propio muy discreto | P0 |
| Menú hamburguesa con fondo oscurecido | Navegación en móvil | Desplegable y fondo oscuro | Igual, pero **con Escape, retorno del foco y `aria-expanded`** (WIU no lo tiene) | P0 |
| *Propio:* índice de la página con resaltado de sección | WIU no ofrece forma de saltar dentro de páginas de 7 000–20 000 px | — | Índice fijo en escritorio y desplegable "En esta página" en móvil; resalta la sección visible | P0 |
| *Propio:* buscador por secciones | Encontrar un dato concreto en segundos | — | Buscador estático (Pagefind) que devuelve **el encabezado concreto** dentro de la página, con filtro por idioma | P0 |
| *Propio:* cabecera de verificación | Saber si la información está al día y de qué versión es | — | Bloque con fecha de revisión, versión del juego, estado (beta) y número de fuentes en cada página | P0 |
| *Propio:* fuentes por afirmación | Diferenciar lo oficial de lo supuesto | — | Cada ficha enlaza su fuente; la página `/fuentes` explica los niveles de fiabilidad | P0 |
| *Propio:* estado vacío "pendiente de documentar" | No rellenar con texto inventado | — | Bloque explícito con lo que falta y por qué (p. ej., "nivel 31-60 no disponible en la beta") | P0 |
| *Propio:* calculadora de multiplicador crítico (Frostfire Bolt) | Las interacciones entre escuelas de Forever no son intuitivas | — | Se eligen los rangos de Ice Shards e Ignite y se muestra el resultado. Validada con el ejemplo oficial (200 % + 40 % = 280 %) | P1 |
| Copiar cadena de talentos (WIU) | Importar la build en el juego | Copia la cadena de exportación | **Descartado** hasta verificar si Forever tiene un formato de importación | — |
| Imagen del árbol completo (WIU) | Ver la build de un vistazo | JPG estático | **Descartado**: no hay datos completos y verificados del árbol; las imágenes envejecen sin aviso | P2 |
| Stream y Discord incrustados en el pie (WIU) | Promoción del autor | iframe de Twitch en todas las páginas | **Descartado**: coste de rendimiento y de privacidad | — |

## Reglas de interacción comunes

1. **Mejora progresiva:** todo el contenido está en el HTML; JavaScript solo reorganiza (pestañas, filtros). Sin JS la página sigue siendo completa y legible.
2. **Teclado:** todo control es un `button` o un `a` real; foco visible de 2 px con contraste ≥ 3:1; Escape cierra los menús y el foco vuelve al botón que los abrió.
3. **Feedback:** cada acción tiene una respuesta visible (estado activo, contador de resultados, aviso "copiado") y anunciada (`aria-live="polite"`).
4. **Estado compartible:** los filtros y las pestañas relevantes se reflejan en la URL; abrir esa URL restaura la vista.
5. **Movimiento:** se respeta `prefers-reduced-motion`; no hay animaciones decorativas.
