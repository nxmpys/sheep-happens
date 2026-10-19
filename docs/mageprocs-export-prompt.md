# Prompt para el proyecto MageProcs: exportar el personaje

> Creado: 2026-10-19 · Para pegar en una sesión de Claude Code abierta en `arcane_flare` (el proyecto del addon MageProcs).
> Contexto: un lector de Sheep Happens pidió poder «importar su personaje» en la web y que esta le sugiera qué mejorar. La API de Blizzard no está confirmada para Forever, así que la vía más segura es que el addon genere un texto que el jugador copie y pegue en la web. Ver la sección 9 de [content-roadmap.md](content-roadmap.md).

---

## Prompt

Quiero añadir a MageProcs un comando **`/mp export`** que genere un texto con el personaje (nivel, talentos y equipo) para pegarlo en la web Sheep Happens (sheephappens.app). La web lo leerá para mostrar el personaje en su calculadora de talentos y, más adelante, compararlo con las builds y sugerir mejoras. Es una **prueba de concepto**: primero quiero saber qué se puede leer en el cliente de Forever y qué no.

### Qué tiene que hacer

1. **`/mp export`** abre una ventanita (el mismo estilo que la ventana de opciones) con un `EditBox` de varias líneas, de solo lectura, con el texto ya seleccionado, y una línea de ayuda: «Pulsa Ctrl+C para copiar y pégalo en sheephappens.app». Los addons no pueden escribir en el portapapeles: el jugador copia a mano. Escape la cierra.
2. **Solo fuera de combate.** En combate, una línea en el chat: «MageProcs: el export solo funciona fuera de combate». En Forever muchos datos del jugador son secretos en combate.
3. **Nada de datos personales por defecto**: ni nombre, ni reino, ni gremio. El texto se puede pegar en sitios públicos.
4. Si no eres Mago, lo dice y no exporta.

### Formato del texto (contrato con la web, no lo cambies sin avisar)

Una sola línea, campos separados por `;`, clave `=` valor, con prefijo de versión y marca de fin para detectar textos cortados:

```text
SHEEP1;lvl=30;race=Gnome;fac=A;tal=--05050033010003001;gear=1:12345:0:0,3:23456:1883:0,…;prof=Tailoring:150,Enchanting:120;END
```

| Campo | Contenido | Cómo leerlo |
|---|---|---|
| `SHEEP1` | Versión del formato | Fijo. Si algún día cambia el formato, `SHEEP2`. |
| `lvl` | Nivel del personaje | `UnitLevel("player")` |
| `race` | Raza en inglés, sin espacios | segundo valor de `UnitRace("player")` (el token, no el nombre traducido) |
| `fac` | `A` o `H` | `UnitFactionGroup("player")` |
| `tal` | Talentos en el **formato de la calculadora de Wowhead Forever**, sin el `v2` | Ver abajo |
| `gear` | Lista `ranura:itemId:enchantId:suffixId` separada por comas, solo ranuras con objeto | `GetInventoryItemLink("player", slot)` para las ranuras 1 a 19, y sacar los números del enlace (`item:ID:ENCHANT:…`). |
| `prof` | `Nombre:nivel` de las profesiones principales y secundarias, en inglés si se puede | API de habilidades del cliente; si no se puede leer de forma fiable, omite el campo |
| `talented` | Rango del perk de Legado Talented (0–5), **solo si se puede leer** | Investigar; si no se puede, omite el campo y anótalo |
| `END` | Marca de fin | Fijo, siempre el último. |

**El campo `tal` es lo más delicado.** La web ya lee y escribe este código (`parseWowheadBuild` y `wowheadBuildUrl` en `sheep_happens/src/lib/talents.ts`):

- Tres segmentos, uno por rama, en el orden **Arcano, Fuego, Escarcha**, unidos por `-`.
- Cada segmento es un dígito por talento con los puntos gastados, con los talentos de esa rama ordenados **de arriba abajo y de izquierda a derecha** (fila y después columna, como en la calculadora).
- Se quitan los ceros del final de cada segmento y los segmentos vacíos del final. Ejemplos: solo Escarcha con Descarga de Escarcha mejorada 5/5 y Fragmentos de hielo 3/5 es `--0503`; Enfoque Arcano 1 + el talento 1 de Fuego a 1 + Descarga de Escarcha mejorada 5/5 es `01-1-05`.
- **Ojo**: `GetTalentInfo(tab, index)` no devuelve los talentos en orden de fila y columna. Lee `tier` y `column` de cada talento, ordena por (`tier`, `column`) y después escribe los dígitos. Comprueba también que las pestañas (`tab` 1, 2, 3) son Arcano, Fuego y Escarcha en este cliente y no lo des por hecho.
- Referencia para comprobarlo: en la web, la build «Escarcha para leveo en solitario» a nivel 30 da `--05050033010003001`. Si haces esa build en el juego, `/mp export` tiene que dar exactamente ese `tal`.

### Lo que quiero saber (investigación, apúntalo en docs/RESEARCH.md)

- ¿Se pueden leer los talentos fuera de combate con `GetTalentInfo` en Forever 1.60.1? ¿Devuelve `tier`, `column` y el rango?
- ¿Se puede leer el perk Talented del Legado (o cuántos puntos de talento extra hay)? `UnitCharacterPoints`, `GetUnspentTalentPoints` o lo que exista en este cliente.
- ¿`GetInventoryItemLink` funciona con todas las ranuras fuera de combate? ¿Los enlaces llevan encantamiento y sufijo («of the Owl»)?
- ¿Hay datos de Forever (los pergaminos de Comprensión, el Legado) que se puedan exportar y que sirvan para recomendar algo?
- Cualquier dato que sea «secreto» o devuelva valores raros: anótalo tal cual.

### Cómo probarlo

- Tests en `tests/tests.lua` con el mock (`wowmock.lua`): el codificador de `tal` con los dos ejemplos de arriba, un personaje sin talentos (`tal=` vacío), ranuras vacías y la negativa en combate.
- En el juego: hacer la build de referencia y comparar el `tal` con el de la web. Pegarlo en <https://sheephappens.app/es/herramientas/calculadora-talentos/> (campo «O pega un enlace de Wowhead», con `v2` delante del código) y comprobar que sale la misma build.

### Fuera de alcance por ahora

- Nada de enviar datos a internet (los addons no pueden, y no queremos).
- Ni recomendaciones ni lógica de equipo en el addon: eso lo hará la web.
- No subas versión a CurseForge hasta que hayamos probado el formato con la web.

Cuando termines, dime qué campos se pueden leer y cuáles no, y pásame un ejemplo real de `/mp export` sacado del juego.
