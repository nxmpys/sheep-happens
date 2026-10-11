# Publicación en Cloudflare Pages (gratis)

URL de producción prevista: **https://sheep-happens.pages.dev**

Coste: 0 €. Cloudflare Pages (plan gratuito) ofrece ancho de banda ilimitado, HTTPS, CDN global y 500 compilaciones al mes. GitHub (repositorio y Actions) también es gratuito para repositorios públicos.

## Arquitectura

```
push a main ──► GitHub ──► Cloudflare Pages ejecuta `npm run check` ──► publica dist/
                  │                (si algo falla, NO publica)
                  ├── CI (Actions): mismas comprobaciones + datos documentados
                  └── Revisión semanal (Actions): issue con las novedades de las fuentes
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
3. **Project name: `sheep-happens`.** Es el subdominio: `sheep-happens.pages.dev`. Si está ocupado, Cloudflare propondrá otro. En ese caso, pon el definitivo en la variable `SITE_URL` (paso 4).
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
   | `SITE_URL` | `https://sheep-happens.pages.dev` | Solo si el subdominio es otro |
   | `PUBLIC_GOOGLE_SITE_VERIFICATION` | código de Search Console | Opcional (ver `docs/seo.md`) |
   | `PUBLIC_BING_SITE_VERIFICATION` | código de Bing Webmaster | Opcional |

6. **Save and Deploy.** La primera compilación tarda unos 2 minutos.

### 3. Comprobación tras publicar

- `https://sheep-happens.pages.dev/` redirige a `/es/` o `/en/` según el idioma del navegador.
- Pulsa `/` y busca «Lanza de hielo»: aparecen resultados por sección.
- `/es/cambios/?tree=frost&kind=new` muestra 2 cambios.
- `/sitemap-index.xml`, `/robots.txt` y `/es/novedades/rss.xml` responden.
- Las cabeceras de seguridad están activas: comprueba la URL en https://securityheaders.com.
- Las vistas previas (`<rama>.sheep-happens.pages.dev`) devuelven `X-Robots-Tag: noindex` y no se indexan.

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
| `.github/workflows/weekly-sources.yml` | Informe semanal de fuentes (issue) |
| `.github/workflows/smoke.yml` | Tras cada despliegue y cada mañana, comprueba la web publicada desde GitHub: páginas clave, 404, cabeceras, canónica, sitemap y robots |
| `src/pages/build.json.ts` | Publica `/build.json` con el commit desplegado (lo usa la prueba de humo) |

## Si la web no carga desde España

Los fines de semana con partidos de fútbol, varios operadores españoles bloquean rangos de IP de Cloudflare por orden judicial de LaLiga, entre ellos los de `*.pages.dev`. La web sigue en línea para el resto del mundo y para Google, pero no carga desde esas conexiones mientras dura el bloqueo. Para comprobarlo:

- Revisa la ejecución más reciente de **Production smoke test** en la pestaña *Actions* de GitHub (se hace desde fuera de España).
- Prueba con los datos móviles de otro operador o con una VPN.

No se puede evitar sin salir de Cloudflare. Un dominio propio en Cloudflare usa las mismas IP. Ver `docs/seo.md` para el impacto.

## Dominio propio (opcional, de pago)

Si algún día compras un dominio (unos 10 €/año), añádelo en *Custom domains* del proyecto. Después cambia `SITE_URL`. La URL `pages.dev` seguirá funcionando; las etiquetas `canonical` indican a los buscadores qué dirección es la principal.
