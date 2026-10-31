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
| Canónicas | `canonical` absoluta en cada página, que apunta a sí misma. También la raíz `/` (portada para elegir idioma): Google toma de ella el nombre del sitio |
| Sitemap | `sitemap-index.xml` con `lastmod` real (revisión o historial) y alternativas de idioma; incluye la raíz `/`, pero no la 404 ni los borradores |
| robots.txt | Permite todo y declara el sitemap |
| Datos estructurados | JSON-LD `WebSite` (portada), `Article` (fechas de publicación y modificación, sobre el videojuego) y `BreadcrumbList`. Una sola `Organization` (`#organization`, con logo) como autora y editora; los artículos enlazan con el `WebSite` de la raíz (`#website`) |
| Favicon | La oveja del logo sobre una baldosa oscura, legible en resultados claros y oscuros: `favicon.svg`, `favicon.ico` (16, 32 y 48 px: Google pide múltiplos de 48) y `apple-touch-icon.png`; los dos últimos se generan desde el SVG con `npm run og` |
| Aviso a buscadores | Sitemap en Google y Bing, e IndexNow (`npm run indexnow`) para Bing, Yandex y otros |
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
| `/es/aprende/` | guía de clase mago forever, habilidades mago forever, rotación mago wow forever |
| `/es/cambios/` | cambios mago wow forever, talentos nuevos mago forever |
| `/es/talentos/` | talentos mago wow forever |
| `/es/talentos/arcano/` | mago arcano wow forever, explosión arcana forever |
| `/es/talentos/fuego/` | mago fuego wow forever, calentamiento piroexplosión |
| `/es/talentos/escarcha/` | mago escarcha wow forever, lanza de hielo forever |
| `/es/nivelacion/` | guía de leveo mago wow forever, build de leveo mago, talentos de leveo 1-30, subir de nivel mago wow forever (en inglés, `/en/leveling/`: wow forever mage leveling guide, mage leveling build, leveling talents 1-30) |
| `/es/equipo/` | equipo mago wow forever, estadísticas mago forever, misiones de clase mago forever |

## Lo que tienes que hacer tú (tras publicar)

### 1. Google Search Console (gratis, 10 minutos)

Estado (14 oct 2026), propiedad **`https://sheephappens.app/`** (prefijo de URL):

- `sitemap-index.xml` enviado y leído sin errores: 33 páginas descubiertas.
- **Ya indexadas** («URL is on Google»): `/`, `/es/`, `/en/`, `/es/guia/`, `/es/builds/`, `/es/builds/duelos-nivel-30/` y `/es/razas/`. Último rastreo de la portada: 13 oct, 20:56.
- **Cambio de dirección** iniciado el 14 oct desde la propiedad antigua (*Ajustes* → *Cambio de dirección*): `sheep-happens.pages.dev` → `sheephappens.app`, con la validación superada (301 en la portada y las dos propiedades verificadas). Google traslada los resultados poco a poco durante unos 180 días. Mientras tanto, en las búsquedas pueden seguir saliendo URL de `pages.dev`: redirigen bien, así que no hay que hacer nada más. No canceles el traslado ni quites la redirección.
- **Favicon:** el 14 oct pasó a ser la oveja del logo. Google lo actualiza cuando vuelve a rastrear la portada, y puede tardar días o semanas. Solicitar la indexación de `/` dio «Quota Exceeded» el 14 oct: reinténtalo otro día.
- **Pendientes de solicitar**, una tanda al día y en este orden: `/`, `/es/cambios/`, `/es/talentos/`, `/es/talentos/fuego/`, `/es/talentos/arcano/`, `/es/nivelacion/`, `/es/aprende/`, `/es/equipo/` y después las páginas en inglés. Antes de pedirla, inspecciona la URL: si ya dice «URL is on Google», no gastes cupo.
- La propiedad antigua `https://sheep-happens.pages.dev/` se mantiene: el traslado necesita que siga verificada.

Notas:

- El cupo de «Solicitar indexación» es pequeño (6 peticiones el 13 oct por la tarde; ninguna el 11, el 12 ni el 14 por la mañana). Si sale «Quota Exceeded», vuelve más tarde o al día siguiente; el sitemap sigue funcionando sin ello.
- Con una URL que Google aún no conoce, «Request indexing» hace antes una prueba en directo (alrededor de un minuto) y después confirma con «Indexing requested».
- El enlace directo `…/search-console/inspect?…&id=<url>` da 404: inspecciona las URL desde la barra de búsqueda de Search Console.

Pasos (ya hechos para las dos direcciones):

1. Entra en https://search.google.com/search-console y añade una propiedad de tipo **Prefijo de URL**: `https://sheephappens.app/`.
2. Verificación usada: **archivo HTML** `public/googlefdba108afcc31ea5.html`. **No lo borres**: si desaparece, Google retira la verificación. (Alternativa: etiqueta HTML con la variable `PUBLIC_GOOGLE_SITE_VERIFICATION` en Cloudflare y un nuevo despliegue).
3. Pulsa **Verificar** en Search Console.
4. En **Sitemaps**, envía `sitemap-index.xml`.
5. Espera: Google lee el sitemap por su cuenta en días.
6. En **Inspección de URLs**, solicita la indexación de `/es/`, `/es/aprende/`, `/es/cambios/` y de las tres ramas. Hay un **cupo diario** pequeño: si sale «Quota Exceeded», vuelve a intentarlo al día siguiente.

### 2. Bing Webmaster Tools (gratis, 5 minutos)

Bing también alimenta a DuckDuckGo, Ecosia, Yahoo y la búsqueda de varios asistentes de IA.

Estado:

- `sheep-happens.pages.dev` (11 oct 2026): sitio **importado desde Search Console**, con `sitemap-index.xml` enviado y rastreado sin errores. Las 26 URL se enviaron a mano en *URL Submission* (cupo: 100 al día).
- `sheephappens.app` (13 oct 2026): las 33 URL del sitemap se enviaron por **IndexNow** (aceptadas). **Falta** añadir el sitio en Bing Webmaster Tools para ver sus datos: impórtalo desde Search Console, ahora que la propiedad de Google existe.

1. Entra en https://www.bing.com/webmasters e **importa el sitio desde Google Search Console** (no hace falta otra verificación).
2. Si prefieres verificar aparte, usa la variable `PUBLIC_BING_SITE_VERIFICATION`.
3. Envía el sitemap.

**IndexNow** (sin iniciar sesión): `npm run indexnow` avisa a Bing, Yandex, Seznam, Naver y Yep de todas las URL del sitemap. Con argumentos (`npm run indexnow -- https://sheephappens.app/es/cambios/`) solo avisa de esas URL. Ejecútalo **después** de que el despliegue esté en línea, con las páginas que cambian en cada revisión de fuentes. La clave es pública a propósito (`public/<clave>.txt`).

### 3. Conseguir enlaces y visitas (lo que más ayuda)

- Comparte páginas **concretas y útiles**, no solo la portada: el explorador de cambios filtrado (`/es/cambios/?tree=frost&kind=new`) o la calculadora. La imagen social se muestra sola en Discord, X y Reddit.
- Comunidades hispanohablantes de WoW: servidores de Discord, subreddits, foros de Blizzard en español y hermandades. Aporta valor (resume un cambio y enlaza la fuente); no hagas spam.
- Creadores de contenido en español: una guía que se actualiza cada semana con fuentes es fácil de recomendar.
- Cada revisión semanal es una buena excusa para compartir «qué ha cambiado para el Mago esta semana».

### 4. Medir y ajustar (cada 2-4 semanas)

En Search Console → **Rendimiento**: consultas, impresiones y CTR por página.

- Si una página tiene muchas impresiones y pocos clics, mejora su `seoTitle` y su `description`.
- Si aparecen consultas que no cubrimos (p. ej., «mejor raza mago forever»), valora una sección nueva **cuando haya datos fiables**.

### 5. Visitas: Cloudflare Web Analytics

Gratis y sin cookies (no necesita aviso de cookies): visitas, páginas vistas, páginas más vistas, de dónde llegan (referencias), países, dispositivos y Core Web Vitals.

- **Activar (una vez):** Cloudflare → *Workers & Pages* → `sheep-happens` → *Metrics* → *Web Analytics* → **Enable**. Cloudflare inserta el script en el **siguiente despliegue** (haz *Retry deployment* o cualquier push).
- **Consultar:** Cloudflare → *Analytics & Logs* → *Web Analytics* → `sheep-happens.pages.dev +1`. El «+1» es `sheephappens.app`: las dos direcciones envían los datos a ese sitio, con el mismo script de Pages. Para ver solo el dominio propio, filtra por **Host**.
- La tarjeta `sheephappens.app` (*Automatic setup*) se creó al añadir el dominio a Cloudflare y se queda en 0, porque las páginas ya llevan el script de Pages. No aporta nada: se puede borrar.
- La CSP de `public/_headers` ya permite `https://static.cloudflareinsights.com` (`script-src`) y `https://cloudflareinsights.com` (`connect-src`). Si la quitas, el script quedará bloqueado.
- Las cifras son aproximadas: no cuentan visitas con bloqueadores de anuncios ni las bloqueadas por LaLiga.

| Pregunta | Dónde mirar |
|---|---|
| ¿Cuánta gente entra y qué páginas lee? | Cloudflare Web Analytics |
| ¿De dónde vienen (Discord, Reddit, Google…)? | Cloudflare Web Analytics → *Referers* |
| ¿Qué buscan en Google para llegar? | Search Console → *Rendimiento* |
| ¿Y en Bing/DuckDuckGo? | Bing Webmaster Tools → *Search Performance* |

## Riesgo conocido: bloqueos de LaLiga en España

Durante los partidos de LaLiga, algunos operadores españoles bloquean IP de Cloudflare, también las de `pages.dev`. Googlebot no se ve afectado (rastrea desde fuera de España), pero algunos lectores españoles no podrán abrir la web durante esas horas. Si el bloqueo se volviera frecuente y afectara a muchas visitas, la alternativa sería un espejo en otro proveedor. Antes de hacerlo, mide el impacto en Search Console.

## Lo que no hacemos (a propósito)

- **Repetir palabras clave** ni crear páginas vacías para posicionar: Google lo penaliza y no ayuda a nadie.
- **Marcado FAQ (`FAQPage`)**: Google ya no lo muestra para este tipo de sitios. Las preguntas están como contenido normal.
- **Prometer builds o rankings** que aún no existen: la guía los marca como pendientes; un título engañoso dispararía la tasa de rebote.

## Cuando haya contenido nuevo

Las páginas que más búsquedas atraerán tras el lanzamiento: **builds de nivelación por rama**, **mejor rama para subir**, **prioridad de estadísticas** y **PvP**. Cada una debería tener su propia URL estable (añádela al registro de rutas) y su `seoTitle`.
