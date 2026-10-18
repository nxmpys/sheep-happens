# Publicación en Cloudflare Pages (gratis)

URL de producción: **https://sheephappens.app** (dominio propio, comprado en Cloudflare). La dirección original `https://sheep-happens.pages.dev` redirige a él con un 301 que conserva ruta y parámetros (comprobado el 13 oct 2026; la prueba de humo lo vigila cada día).

Coste: 0 €. Cloudflare Pages (plan gratuito) ofrece ancho de banda ilimitado, HTTPS, CDN global y 500 compilaciones al mes. GitHub (repositorio y Actions) también es gratuito para repositorios públicos.

## Arquitectura

```
push a main ──► GitHub ──► Cloudflare Pages ejecuta `npm run check` ──► publica dist/
                  │                (si algo falla, NO publica)
                  │                + functions/ (POST /api/feedback → issue «feedback»; GET / → idioma)
                  ├── CI (Actions): mismas comprobaciones + datos documentados
                  └── Revisión de fuentes (Actions, miércoles y viernes): issue con las novedades
```

## Pasos (una sola vez)

### 1. Repositorio en GitHub

1. Crea un repositorio **vacío** en GitHub (por ejemplo, `sheep-happens`). Puede ser público o privado; con uno público, Actions no tiene límite de minutos.
2. En esta carpeta:

   ```bash
   git remote add origin https://github.com/<tu-usuario>/sheep-happens.git
   ```

   ```bash
   git push -u origin main
   ```

### 2. Proyecto en Cloudflare Pages

1. Crea una cuenta gratuita en Cloudflare y entra en **Workers & Pages → Create → Pages → Connect to Git**.
2. Autoriza a Cloudflare a leer el repositorio y elígelo.
3. **Project name: `sheep-happens`.** Es el subdominio: `sheep-happens.pages.dev`. Si está ocupado, Cloudflare propondrá otro. En ese caso, pon el definitivo en la variable `SITE_URL` (punto 5).
4. Configuración de compilación:

   | Campo | Valor |
   |---|---|
   | Framework preset | None (o Astro) |
   | Build command | `npm run check` |
   | Build output directory | `dist` |
   | Root directory | (vacío) |

5. Variables de entorno (*Settings → Environment variables*, para *Production* y *Preview*):

   | Variable | Valor | Obligatoria |
   |---|---|---|
   | `NODE_VERSION` | `22` | Recomendada (también se lee de `.nvmrc`) |
   | `SITE_URL` | URL pública, p. ej. `https://sheephappens.app` | No: es el valor por defecto de `astro.config.mjs`. Solo para publicar en otra dirección |
   | `PUBLIC_GOOGLE_SITE_VERIFICATION` | código de Search Console | Opcional (ver `docs/seo.md`) |
   | `PUBLIC_BING_SITE_VERIFICATION` | código de Bing Webmaster | Opcional |

6. **Save and Deploy.** La primera compilación tarda unos 2 minutos.

### 3. Comprobación tras publicar

- `https://sheephappens.app/` redirige (302) a `/es/` o `/en/` según la cookie `sh-lang` (la guarda el selector de idioma) o, si no hay, según `Accept-Language` (`functions/index.ts`). Sin `Accept-Language` (los rastreadores no lo envían) se sirve la página raíz, indexable y con el nombre del sitio: compruébalo con `curl -sI https://sheephappens.app/` (200) y `curl -sI -H 'Accept-Language: en' https://sheephappens.app/` (302 a `/en/`).
- Pulsa `/` y busca «Lanza de hielo»: aparecen resultados por sección.
- `/es/cambios/?tree=frost&kind=new` muestra 2 cambios.
- `/sitemap-index.xml`, `/robots.txt` y `/es/novedades/rss.xml` responden.
- Las cabeceras de seguridad están activas: comprueba la URL en https://securityheaders.com.
- Las vistas previas (`<rama>.sheep-happens.pages.dev`) devuelven `X-Robots-Tag: noindex` y no se indexan.
- `https://sheep-happens.pages.dev/es/cambios/?tree=frost` responde `301` a `https://sheephappens.app/es/cambios/?tree=frost`.

## Publicar una actualización

1. Edita (ver `docs/maintenance.md` y `CONTRIBUTING.md`).
2. Ejecuta `npm run check` en local.
3. Haz commit y push a `main`. Cloudflare compila y publica en uno o dos minutos. Si la compilación falla, la versión anterior sigue en línea.

Para cambios grandes, trabaja en una rama: Cloudflare crea una vista previa en `<rama>.sheep-happens.pages.dev` (no indexable) y la CI comprueba el pull request.

## Configuración incluida

| Archivo | Para qué |
|---|---|
| `public/_headers` | Cabeceras de seguridad (CSP, HSTS…), caché de recursos y `noindex` para vistas previas |
| `.nvmrc` | Versión de Node para Cloudflare |
| `.github/workflows/ci.yml` | Comprobaciones en cada push y pull request |
| `.github/workflows/weekly-sources.yml` | Informe de fuentes de los miércoles y viernes (issue) |
| `.github/workflows/smoke.yml` | Tras cada despliegue y cada mañana, comprueba la web publicada desde GitHub: páginas clave, 404, cabeceras, canónica, sitemap, robots y la redirección de `pages.dev` |
| `functions/api/feedback.ts` | Formulario de comentarios: comprueba Turnstile y abre una issue `feedback` (ver abajo) |
| `src/pages/build.json.ts` | Publica `/build.json` con el commit desplegado (lo usa la prueba de humo) |

## Formulario de feedback

Al final de cada página de la guía, el lector puede decir que un dato es incorrecto, que falta información o sugerir algo, sin cuenta. Lo envía a `POST /api/feedback`, una *Pages Function* (`functions/api/feedback.ts`; Cloudflare la publica sola junto a `dist/`, dentro del plan gratuito: 100 000 peticiones al día). La función:

1. Comprueba que la petición viene de la propia web (cabecera `Origin`), el tamaño y un campo trampa para bots.
2. Valida el tipo, la página (solo rutas reales de la guía) y la longitud (10 a 2000 caracteres) con `src/lib/feedback.ts`.
3. Verifica el token de **Cloudflare Turnstile** (acción `feedback` y mismo dominio).
4. Abre una issue en `nxmpys/sheep-happens` con la etiqueta `feedback`. No guarda nada más: ni IP, ni email, ni cookies.

El widget de Turnstile solo se carga cuando alguien abre el formulario, así que las visitas normales no cargan nada de fuera. La CSP de `public/_headers` permite `https://challenges.cloudflare.com` en `script-src` y `frame-src`; si la quitas, el formulario deja de funcionar.

Qué hace después la revisión automática con esas issues: [maintenance.md](maintenance.md), sección 7.

### Puesta en marcha (una sola vez)

Mientras falte algo de esto, el formulario **no aparece** en producción (en `npm run dev` sí, con la clave de prueba de Turnstile, pero no se puede enviar porque Astro no ejecuta la función).

1. **Turnstile:** panel de Cloudflare → *Turnstile* → *Add widget*. Nombre `sheep-happens-feedback`; dominios `sheephappens.app` y `sheep-happens.pages.dev` (este último para las vistas previas); modo *Managed*. Copia la **clave del sitio** y la **clave secreta**.
2. **Token de GitHub:** <https://github.com/settings/personal-access-tokens/new> (*fine-grained*). Propietario `nxmpys`, solo el repositorio `sheep-happens`, permiso **Issues: Read and write** y nada más. Ponle caducidad (por ejemplo, un año) y apunta la fecha para renovarlo.
3. **Variables del proyecto:** *Workers & Pages* → `sheep-happens` → *Settings* → *Variables and secrets*, en **Production** (y en *Preview* si quieres probar en ramas):

   | Nombre | Tipo | Valor |
   |---|---|---|
   | `PUBLIC_TURNSTILE_SITE_KEY` | Texto | Clave del sitio (se usa al compilar; es pública) |
   | `TURNSTILE_SECRET_KEY` | Secreto | Clave secreta de Turnstile |
   | `FEEDBACK_GITHUB_TOKEN` | Secreto | El token del paso 2 |

4. **Vuelve a desplegar** (*Deployments* → *Retry deployment*, o cualquier push): la clave del sitio se lee al compilar.
5. **Prueba:** envía un comentario desde una página y comprueba que aparece la issue con la etiqueta `feedback`. Ciérrala a mano.

Si el token caduca o se revoca, el formulario responde «no se pudo enviar» y el error queda en *Deployments* → *Functions* → *Real-time logs*. Para retirarlo, borra `PUBLIC_TURNSTILE_SITE_KEY` y vuelve a desplegar.

Si llega spam pese a Turnstile, añade una regla de *Rate limiting* gratuita en *Security* → *WAF* para la ruta `/api/feedback` (por ejemplo, 5 peticiones por minuto por IP).

## Si la web no carga desde España

Los fines de semana con partidos de fútbol, varios operadores españoles bloquean rangos de IP de Cloudflare por orden judicial de LaLiga, entre ellos los de `*.pages.dev`. La web sigue en línea para el resto del mundo y para Google, pero no carga desde esas conexiones mientras dura el bloqueo. Para comprobarlo:

- Revisa la ejecución más reciente de **Production smoke test** en la pestaña *Actions* de GitHub (se hace desde fuera de España).
- Prueba con los datos móviles de otro operador o con una VPN.

No se puede evitar sin salir de Cloudflare. Un dominio propio en Cloudflare usa las mismas IP. Ver `docs/seo.md` para el impacto.

## Dominio propio: sheephappens.app

Elegido el 13 de octubre de 2026. `.app` obliga a usar HTTPS (HSTS precargado), algo que la web ya cumple.

1. **Comprar** `sheephappens.app` en Cloudflare → *Domain Registration* → *Register Domains*. Al comprarlo en Cloudflare, sus DNS ya quedan en la cuenta.
2. **Conectar** el dominio al proyecto: *Workers & Pages* → `sheep-happens` → *Custom domains* → *Set up a custom domain* → `sheephappens.app`. Cloudflare crea el registro DNS y el certificado (unos minutos).
3. **Opcional (no hecho):** añadir también `www.sheephappens.app` como dominio personalizado y redirigirlo al dominio sin `www`. Hoy `www` no existe en los DNS, así que quien lo escriba no llega a ninguna parte.
4. **Redirigir `pages.dev` (hecho el 13 oct):** *Bulk Redirects* (en la cuenta, *Rules* → *Redirect Rules* → *Bulk Redirects*): una lista con `sheep-happens.pages.dev` → `https://sheephappens.app`, código 301, conservando ruta y parámetros (*Preserve path suffix* y *Preserve query string*), y una regla que la active. Así no se pierde lo ya indexado ni los enlaces compartidos.
   Comprobación: `curl -sI https://sheep-happens.pages.dev/es/` debe devolver `301` con `Location: https://sheephappens.app/es/`. Las vistas previas (`<rama>.sheep-happens.pages.dev`) no deben redirigir: deja **desactivado** *Include subdomains*.
5. **Publicar** el código con la nueva URL (`SITE_URL` por defecto en `astro.config.mjs`, imágenes sociales y prueba de humo). Si en el proyecto de Cloudflare existe la variable `SITE_URL` con la URL antigua, cámbiala o bórrala.
6. **Buscadores:** hecho el 13 oct con una propiedad de **Prefijo de URL** (`https://sheephappens.app/`), que se verifica con el mismo archivo HTML de Google, y con `https://sheephappens.app/sitemap-index.xml` enviado. Ver el estado en `docs/seo.md`. Una propiedad de tipo **Dominio** (registro TXT en los DNS) cubriría también `www` y `http`, pero no hace falta. Falta Bing. La propiedad antigua de `pages.dev` se mantiene para seguir las redirecciones: la herramienta «Cambio de dirección» no admite subdominios de `pages.dev`, así que el traspaso depende de los 301.

### Seguridad y renovación del dominio

Estado a 13 oct 2026: todo hecho. El dominio caduca el **13 oct 2027** y Cloudflare lo renueva solo; si cambias de tarjeta, actualízala en Cloudflare.

| Tarea | Estado | Dónde |
|---|---|---|
| Renovación automática | **Hecho** (13 oct) | *Domain Registration* → *Manage Domains* → `sheephappens.app` → *Auto renew* activado |
| DNSSEC | **Hecho** (13 oct): DS publicado en `.app` (clave 2371, algoritmo 13) y respuestas validadas | `sheephappens.app` → *DNS* → *Settings* → *DNSSEC*. Con el registrador de Cloudflare, el DS se añade solo |
| Correo falso con el dominio | **Hecho** (13 oct): el dominio no envía correo y los servidores rechazan el que finja venir de `@sheephappens.app` | *DNS* → *Records*: `TXT` en `sheephappens.app` con `v=spf1 -all`, y `TXT` en `_dmarc` con `v=DMARC1; p=reject; sp=reject; adkim=s; aspf=s` |

Si algún día quieres una dirección de contacto (`hola@sheephappens.app`), usa *Email Routing* de Cloudflare: crea sus propios MX y SPF, que sustituyen al `v=spf1 -all`.

Comprobación (DNS sobre HTTPS, sin instalar nada):

```bash
curl -s -H 'accept: application/dns-json' 'https://cloudflare-dns.com/dns-query?name=sheephappens.app&type=DS'
```

Con DNSSEC activo, la respuesta incluye un registro `DS` en `Answer`.
