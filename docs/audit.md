# Auditoría final (v0.1, 2026-10-11)

Comparación entre lo implementado y los patrones observados en Wings Is Up (WIU), resultado de las pruebas y limitaciones conocidas.

## 1. Patrones de WIU: adaptados, mejorados y descartados

| Patrón de WIU | Decisión | Implementación en Sheep Happens |
|---|---|---|
| Tira de iconos → ficha | **Adaptado y mejorado** | `TalentExplorer` (sustituido en oct 2026 por la lista compacta `ChangeSummaryList`; las fichas viven solo en Cambios): botones con **nombre visible** (WIU solo mostraba iconos sin `alt`), patrón de pestañas ARIA con flechas, Inicio y Fin, el talento seleccionado en la URL (`#change-ice-lance`) y todas las fichas presentes en el HTML (funciona sin JS y lo indexa el buscador) |
| Cadena de prioridad clicable | **Adaptado** | `Priority`: listas condicionales («si pasa X, haz Y») con su estado de verificación. Sin valores inventados |
| Valor del talento por contexto (M+/Raid) | **Aplazado** | No hay datos de Forever para valorar talentos por actividad. Se sustituye por el estado de verificación de cada afirmación |
| Guía rápida frente a guía completa | **Adaptado** | Explorador de cambios (consulta rápida) + recorrido de aprendizaje con «En resumen» al principio de cada página |
| «Next: …» al final de la página | **Adaptado** | `PrevNext` siguiendo `READING_ORDER`, generado desde el menú principal (`PRIMARY_NAV`) |
| Enlace copiable a una sección | **Adaptado y mejorado** | Botón `#` accesible en cada `h2`/`h3`, aviso anunciado por lectores de pantalla (`aria-live`) |
| Selector con estado en la URL (mazmorras) | **Adaptado** | Filtros del explorador en la URL (`?tree=frost&kind=new&q=…`), restaurables, compartibles e independientes del idioma |
| Etiquetas de valor por color | **Mejorado** | Insignias de estado con icono + palabra + color (nunca solo color) |
| Fondos alternos y ornamentos | **Adaptado con moderación** | Superficies planas, acento de escuela en los `h2`; sin ornamentos que pesen |
| Menú móvil con fondo oscurecido | **Mejorado** | Escape cierra el menú y devuelve el foco; `aria-expanded`; submenú accesible por teclado |
| Copiar cadena de talentos | **Descartado** | Formato de importación de Forever no verificado |
| Imagen del árbol completo | **Descartado** | Sin datos completos fiables; las imágenes envejecen sin aviso |
| Twitch, Discord y Patreon incrustados | **Descartado** | Rendimiento y privacidad (sin incrustaciones de terceros; la única analítica es Cloudflare Web Analytics, sin cookies) |
| URLs con prefijo de expansión (`/tww-*`) | **Descartado** | Slugs estables y localizados desde un registro único |

**Añadido respecto a WIU:** índice de la página con resaltado de la sección visible, buscador por secciones (Ctrl/⌘+K o `/`), cabecera de verificación por página (fecha, versión y estado), fuentes por afirmación, estados vacíos explícitos, tema claro/oscuro, ES/EN y calculadora de crítico.

## 2. Criterios de aceptación

### Funcionalidad
- [x] Enlaces internos: `npm run links` comprobó 1124 enlaces y anclas en 28 páginas, sin errores (también con `BASE_PATH=/sheep_happens/`).
- [x] Buscador: probado con «ice lance» (ES) y «pyroblast» (EN); devuelve páginas y secciones concretas.
- [x] Filtros: probados con clics reales (Escarcha + Nuevo → 2 resultados, estado vacío, reinicio) y al cargar una URL con filtros.
- [x] Teclado: pestañas de talentos con flechas, control deslizante de la calculadora, menú con Escape, atajos de búsqueda.
- [~] Fuentes externas: 17 de 19 responden; Massively OP e Icy Veins devuelven 403 a peticiones automáticas (existen y se citan desde buscadores; hay que comprobarlas a mano).
- [x] Enlaces compartidos: filtros y talento seleccionado restaurables desde la URL; el selector de idioma conserva el hash y los filtros.

### Diseño y usabilidad
- [x] Sin desplazamiento horizontal a 375, 750, 1205 y 1366 px (medido).
- [x] Solapamiento de la cabecera a 1366 px detectado y corregido (etiquetas cortas y punto de ruptura a 1200 px).
- [x] Tablas dentro de un contenedor con desplazamiento propio.
- [x] Estados hover, foco (anillo dorado de 3 px), activo, vacío y pendiente resueltos.

### Calidad técnica
- [x] `astro check`: 0 errores, 0 advertencias, 0 sugerencias.
- [x] 103 pruebas unitarias (filtros, rutas, calculadora, integridad de datos, reglas editoriales, enlaces, **contraste WCAG de los tokens en ambos temas**).
- [x] La prueba de contraste detectó bordes de controles por debajo de 3:1 (2,47:1 en claro y 2,15:1 en oscuro); corregido.
- [x] Consola del navegador sin errores.
- [x] Accesibilidad automática en 17 páginas: un único `h1`, sin saltos de encabezado ni IDs duplicados, todos los controles con nombre, `lang` correcto y `main` presente.
- [x] SEO: `title` y `description` únicos, `canonical`, `hreflang` (es/en/x-default), Open Graph, sitemap y `robots.txt` con sitemap absoluto.
- [x] Sin secretos en el repositorio; sin analítica.

### Calidad del contenido
- [x] Versión del juego identificada y visible en cada página.
- [x] Cada afirmación lleva su estado y su fuente; el validador impide marcar como «Oficial» algo sin fuente oficial.
- [x] Discrepancias documentadas en la web (`/fuentes`) y en `content-validation.md`.
- [x] Nada de contenido de ejemplo: las secciones sin datos usan `Pending`.
- [x] Fechas de revisión reales (2026-10-11) y manuales.

## 3. Limitaciones conocidas

1. **Forever está en beta** y limitado al nivel 30: no hay builds, prioridades de estadísticas, equipo, PvE ni PvP verificados. La web lo indica en cada sección afectada.
2. **Nombres en español** de hechizos y talentos: se muestran en inglés hasta que Blizzard publique la localización (campo `nameEs` preparado).
3. **Iconos de hechizos:** se usan iconos propios por escuela, no los de Blizzard (licencia incierta).
4. **Revisión humana pendiente:** el contenido inicial se compiló a partir de las fuentes citadas el 2026-10-11; conviene que la persona responsable lo revise y ponga su nombre en `reviewedBy`.
5. La verificación visual de escritorio a más de 750 px se hizo midiendo el diseño (cajas y desbordamientos), no con capturas a tamaño completo, por las limitaciones del panel del navegador.

## 4. Siguientes pasos recomendados

1. Elegir hosting y dominio, y configurar `SITE_URL` (ver `docs/deployment.md`).
2. Tras el 4 de noviembre de 2026, seguir la lista de revisión de `content-validation.md`.
3. Con datos del lanzamiento: valoración de talentos por actividad, builds compartibles y planificador de talentos.
