# Requisitos de producto: Sheep Happens

> Guía de clase interactiva del Mago para World of Warcraft: Forever. Bilingüe (ES/EN).
> Decisiones del usuario (2026-10-11): stack con Node/Astro; sitio **bilingüe ES/EN**; centrarse en **una guía de clase interactiva**, no en replicar el contenido de Retail de la referencia.

## 1. Objetivo

Que un jugador de Mago en Forever pueda **aprender** la clase de forma progresiva y **consultar** un dato concreto en menos de 10 segundos, sabiendo siempre **de qué versión es el dato y lo fiable que es**.

## 2. Usuarios y tareas

| Perfil | Tarea principal | Cómo la resuelve la web |
|---|---|---|
| Nuevo en el Mago | "¿Cómo empiezo?" | Guía de clase → fundamentos, herramientas por función y recorrido con "Siguiente" |
| Veterano de Classic | "¿Qué cambia respecto a vanilla?" | **Explorador de cambios** filtrable por rama y tipo |
| Jugador subiendo de nivel | "¿Qué rama y talentos para subir?" | Página de nivelación: hechos confirmados + estado pendiente explícito |
| Optimizador | "¿Cómo funciona la mecánica X?" | Páginas de rama con fichas de talentos y la calculadora de crítico |
| Jugador en partida | "Dame el dato ya" | Buscador por secciones (Ctrl/⌘+K o `/`), índice de la página, enlaces directos a secciones |

## 3. Requisitos funcionales

### P0: primera versión publicable
- **RF-01** Portada orientada a tareas: accesos por pregunta, accesos por rama, estado de la versión del juego y últimos cambios.
- **RF-02** Guía de clase (fundamentos del Mago en Forever).
- **RF-03** Explorador de cambios de Forever: filtros por rama (Base / Arcano / Fuego / Escarcha) y tipo (nuevo, rediseñado, renombrado, movido, ajustado, ahora base), búsqueda por texto, contador de resultados, estado vacío y **filtros en la URL**.
- **RF-04** Una página por rama de talentos con identidad de la rama, mapa de hitos (11/16/21/31), explorador de talentos (botón con nombre → ficha) y notas de juego marcadas como "Análisis".
- **RF-05** Página de nivelación con datos confirmados y secciones pendientes explícitas.
- **RF-06** Página de combate: prioridades **condicionales** por rama, sin secuencias rígidas.
- **RF-07** Buscador global que devuelve **secciones** (encabezado + extracto) y respeta el idioma.
- **RF-08** Navegación: cabecera global, migas de pan, índice de la página con resaltado de sección, anterior/siguiente y enlace copiable en cada encabezado.
- **RF-09** Cabecera de verificación por página: fecha de revisión, versión del juego, estado y fuentes.
- **RF-10** Insignias de estado por afirmación (Oficial / Comunidad / Referencia Classic / Análisis / Probado / Pendiente).
- **RF-11** Página de fuentes y metodología; página de novedades (historial).
- **RF-12** Selector de idioma que mantiene la página equivalente.

### P1: interactividad avanzada
- **RF-20** Calculadora de multiplicador crítico de Frostfire Bolt (rangos de Ice Shards e Ignite).
- **RF-21** Tema claro/oscuro con preferencia guardada.
- **RF-22** Atajo de teclado para el buscador.

### P2: cuando existan datos verificados
- Valoración de talentos por contexto (nivelación / mazmorras / PvP), builds compartibles, comparador de equipo, guías de PvE y PvP, vista compacta para jugar.

### Fuera de alcance (v1)
- Simulador completo del árbol de talentos (no hay datos completos verificados).
- Copiar o importar cadenas de talentos (formato no verificado).
- Cuentas, comentarios, base de datos y CMS.

## 4. Requisitos no funcionales

| ID | Requisito | Criterio de aceptación |
|---|---|---|
| RNF-01 | Rendimiento | HTML estático; JS solo en componentes interactivos; < 50 KB de JS por página (sin contar el buscador, que se carga bajo demanda) |
| RNF-02 | Accesibilidad | WCAG 2.2 AA: contraste ≥ 4.5:1 en texto, foco visible, todo operable con teclado, `lang` correcto, landmarks y jerarquía de encabezados |
| RNF-03 | Diseño adaptable | Sin desplazamiento horizontal entre 320 y 2560 px; tablas legibles en móvil |
| RNF-04 | SEO | `title` y `description` únicos, `canonical`, `hreflang` ES/EN, sitemap, Open Graph |
| RNF-05 | Mantenibilidad | Contenido separado de los componentes (Markdown/MDX + JSON validado con esquemas). Las fuentes son obligatorias. La compilación falla si faltan datos |
| RNF-06 | URLs estables | Sin prefijos de versión ni de expansión; slugs localizados y definidos en un único registro |
| RNF-07 | Transparencia | Ningún contenido de ejemplo se presenta como verificado; la fecha de revisión es manual y nunca automática |
| RNF-08 | Mejora progresiva | Todo el contenido es legible sin JavaScript |
| RNF-09 | Privacidad | Sin cookies ni incrustaciones de terceros. Única analítica: Cloudflare Web Analytics (sin cookies ni datos personales; añadida el 11 oct 2026 a petición del autor). Sin donaciones (Ko-fi retirado el 22 oct 2026) |
| RNF-10 | Despliegue | Cualquier hosting estático; CI con validación, pruebas, compilación y comprobación de enlaces |

## 5. Mapa del sitio (v1)

| Página | ES | EN |
|---|---|---|
| Inicio | `/es/` | `/en/` |
| Guía de clase | `/es/guia/` | `/en/guide/` |
| Cambios en Forever | `/es/cambios/` | `/en/changes/` |
| Talentos (índice) | `/es/talentos/` | `/en/talents/` |
| Arcano / Fuego / Escarcha | `/es/talentos/arcano/` … | `/en/talents/arcane/` … |
| Nivelación | `/es/nivelacion/` | `/en/leveling/` |
| Combate | `/es/combate/` | `/en/combat/` |
| Equipo (pendiente) | `/es/equipo/` | `/en/gear/` |
| Herramientas | `/es/herramientas/` | `/en/tools/` |
| Fuentes | `/es/fuentes/` | `/en/sources/` |
| Novedades | `/es/novedades/` | `/en/updates/` |

La raíz `/` detecta el idioma preferido del navegador (con enlace de respaldo) y redirige a `/es/` o `/en/`.
