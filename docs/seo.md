# SEO: posicionamiento en buscadores

Objetivo: aparecer cuando alguien busque **«guía mago wow forever»**, «talentos mago forever», «mago escarcha forever», «lanza de hielo forever», etc., en español (prioridad) y en inglés.

## Expectativas realistas

- Ninguna configuración garantiza la primera posición. Google tarda **de días a semanas** en indexar un sitio nuevo y más en confiar en él.
- En inglés compiten Wowhead, Icy Veins y otros sitios grandes. En **español la competencia es mucho menor**: ahí está la oportunidad.
- El pico de búsquedas llegará con el **lanzamiento (4 nov 2026)**. Conviene publicar cuanto antes para que Google ya conozca el sitio ese día.
- Lo que más pesa a medio plazo: contenido útil y **actualizado** (la revisión semanal ayuda) y **enlaces** desde otros sitios y comunidades.

## Qué está hecho en la web

| Área | Implementación |
|---|---|
| Títulos | `seoTitle` por página con la palabra clave al principio (≤ 60 caracteres + «\| Sheep Happens») |
| Descripciones | `description` única por página, de 50 a 170 caracteres (validada) |
| Idiomas | `hreflang` es/en/x-default en cada página y en el sitemap; `lang` correcto; URLs localizadas (`/es/talentos/escarcha/`) |
| Canónicas | `canonical` absoluta en cada página; la raíz `/` apunta a `/es/` |
| Sitemap | `sitemap-index.xml` con `lastmod` real (revisión o historial) y alternativas de idioma; sin la página 404 ni la raíz |
| robots.txt | Permite todo y declara el sitemap |
| Datos estructurados | JSON-LD `WebSite` (portada), `Article` (fechas de publicación y modificación, sobre el videojuego) y `BreadcrumbList` |
| Redes sociales | Imagen 1200×630 por página e idioma (`public/og/`), Open Graph y Twitter Card |
| Palabras clave | Nombres **oficiales en español** (Lanza de hielo, Descarga de Pirofrío…) junto al inglés: cubre ambas búsquedas |
| Preguntas frecuentes | Bloque en la portada con respuestas reales (lanzamiento, razas, hechizos nuevos, doble especialización) |
| Frescura | Fecha de revisión visible, «Actualizado el…» en cada ficha y RSS del historial |
| Rendimiento | HTML estático, JS mínimo, fuentes propias, caché inmutable de recursos (`_headers`) |
| Accesibilidad | Encabezados correctos, contraste AA verificado por pruebas, navegación por teclado |
| Duplicados | Las vistas previas de Cloudflare llevan `X-Robots-Tag: noindex` |

### Palabras clave por página (español)

| Página | Búsqueda principal |
|---|---|
| `/es/` | guía mago wow forever |
| `/es/guia/` | guía de clase mago forever, habilidades mago forever |
| `/es/cambios/` | cambios mago wow forever, talentos nuevos mago forever |
| `/es/talentos/` | talentos mago wow forever |
| `/es/talentos/arcano/` | mago arcano wow forever, explosión arcana forever |
| `/es/talentos/fuego/` | mago fuego wow forever, calentamiento piroexplosión |
| `/es/talentos/escarcha/` | mago escarcha wow forever, lanza de hielo forever |
| `/es/nivelacion/` | subir de nivel mago wow forever |
| `/es/combate/` | rotación mago wow forever |
| `/es/equipo/` | equipo mago wow forever, estadísticas mago forever |

## Lo que tienes que hacer tú (tras publicar)

### 1. Google Search Console (gratis, 10 minutos)

1. Entra en https://search.google.com/search-console y añade una propiedad de tipo **Prefijo de URL**: `https://sheep-happens.pages.dev/`.
2. Elige la verificación por **etiqueta HTML**. Copia solo el código del atributo `content`.
3. En Cloudflare Pages, añade la variable `PUBLIC_GOOGLE_SITE_VERIFICATION` con ese código y vuelve a desplegar (*Deployments → Retry deployment*).
4. Pulsa **Verificar** en Search Console.
5. En **Sitemaps**, envía `sitemap-index.xml`.
6. En **Inspección de URLs**, solicita la indexación de `/es/`, `/es/guia/`, `/es/cambios/` y de las tres ramas.

### 2. Bing Webmaster Tools (gratis, 5 minutos)

Bing también alimenta a DuckDuckGo, Ecosia, Yahoo y la búsqueda de varios asistentes de IA.

1. Entra en https://www.bing.com/webmasters e **importa el sitio desde Google Search Console** (no hace falta otra verificación).
2. Si prefieres verificar aparte, usa la variable `PUBLIC_BING_SITE_VERIFICATION`.
3. Envía el sitemap.

### 3. Conseguir enlaces y visitas (lo que más ayuda)

- Comparte páginas **concretas y útiles**, no solo la portada: el explorador de cambios filtrado (`/es/cambios/?tree=frost&kind=new`) o la calculadora. La imagen social se muestra sola en Discord, X y Reddit.
- Comunidades hispanohablantes de WoW: servidores de Discord, subreddits, foros de Blizzard en español y hermandades. Aporta valor (resume un cambio y enlaza la fuente); no hagas spam.
- Creadores de contenido en español: una guía que se actualiza cada semana con fuentes es fácil de recomendar.
- Cada revisión semanal es una buena excusa para compartir «qué ha cambiado para el Mago esta semana».

### 4. Medir y ajustar (cada 2-4 semanas)

En Search Console → **Rendimiento**: consultas, impresiones y CTR por página.

- Si una página tiene muchas impresiones y pocos clics, mejora su `seoTitle` y su `description`.
- Si aparecen consultas que no cubrimos (p. ej., «mejor raza mago forever»), valora una sección nueva **cuando haya datos fiables**.

Si quieres estadísticas de visitas sin cookies, Cloudflare Web Analytics es gratuito. Para activarlo, añade a la CSP de `public/_headers` `https://static.cloudflareinsights.com` en `script-src` y `https://cloudflareinsights.com` en `connect-src`; si no, el script quedará bloqueado.

## Riesgo conocido: bloqueos de LaLiga en España

Durante los partidos de LaLiga, algunos operadores españoles bloquean IP de Cloudflare, también las de `pages.dev`. Googlebot no se ve afectado (rastrea desde fuera de España), pero algunos lectores españoles no podrán abrir la web durante esas horas. Si el bloqueo se volviera frecuente y afectara a muchas visitas, la alternativa sería un espejo en otro proveedor. Antes de hacerlo, mide el impacto en Search Console.

## Lo que no hacemos (a propósito)

- **Repetir palabras clave** ni crear páginas vacías para posicionar: Google lo penaliza y no ayuda a nadie.
- **Marcado FAQ (`FAQPage`)**: Google ya no lo muestra para este tipo de sitios. Las preguntas están como contenido normal.
- **Prometer builds o rankings** que aún no existen: la guía los marca como pendientes; un título engañoso dispararía la tasa de rebote.

## Cuando haya contenido nuevo

Las páginas que más búsquedas atraerán tras el lanzamiento: **builds de nivelación por rama**, **mejor rama para subir**, **prioridad de estadísticas** y **PvP**. Cada una debería tener su propia URL estable (añádela al registro de rutas) y su `seoTitle`.
