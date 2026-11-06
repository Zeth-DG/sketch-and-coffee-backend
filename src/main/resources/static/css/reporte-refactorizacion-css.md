
# DOCUMENTACIÓN — CSS consolidado y parchado (versión 1)

**Archivo de referencia:** `styles.css` basado en `styles-cloude.css` + parches P1–P7  
**Objetivo:** dejar una base mantenible, sin duplicaciones seguras, sin variables rotas y **sin cambios obligatorios en HTML ni JS**.  
**Principio:** no renombrar clases, no borrar selectores necesarios y no mezclar contextos visuales distintos.

---

## 1. ¿Por qué es esta versión?

Esta versión parte de `styles-cloude.css`, que fue la mejor de las versiones revisadas porque:

- Consolida selectores duplicados **sin cambiar clases ni IDs**.
- Conserva la cascada y el aspecto visual.
- No obliga a tocar HTML ni JavaScript.
- Corrige errores de sintaxis y comentarios mal cerrados.

Sobre esa base se aplicaron **7 parches** para corregir variables inexistentes y limpiar duplicados seguros.

**No es una minificación.** No busca reducir líneas a toda costa. Busca que el CSS sea predecible, mantenible y seguro para seguir trabajando.

---

## 2. Qué hace exactamente el CSS consolidado y parchado

### 2.1. Consolida selectores repetidos

Se unificaron selectores que estaban declarados 2 o 3 veces en distintas partes de la hoja, conservando el valor que ganaba la cascada.

Ejemplos:

- `body`
- `*, *::before, *::after`
- `img` / `img, video`
- `:focus-visible`
- `.section-newsletter` y sus hijos
- `.newsletter-input`
- `.btn-custom-magenta`
- `.tarjeta-producto`
- `.contenedor-imagen-producto`
- `.main-image-box`, `.thumbnails-grid`, `.thumb-item`
- `.enlace-salto`
- `#btnSubir`
- `.footer-global`, `#pie-pagina`, `#footer-global`

### 2.2. Elimina propiedades repetidas dentro de una misma regla

Se quitaron declaraciones duplicadas o anuladas por la cascada, por ejemplo:

- Fondos repetidos en `body`.
- Reglas de `img` repetidas.
- Reglas de foco duplicadas.
- Propiedades repetidas en tarjetas y botones.

### 2.3. Corrige errores reales

- Corrige una barra suelta (`; /`).
- Corrige un comentario de sección sin cerrar.
- Corrige referencias a variables que no existían.
- Añade alias de compatibilidad para no tocar HTML.

### 2.4. Mantiene la apariencia visual

No se cambiaron valores de diseño salvo cuando la variable referenciada no existía y el navegador estaba usando un fallback o ignorando la propiedad.

**Riesgo visual esperado:** prácticamente nulo, salvo el caso de `#btnWhatsapp` (ver P7 y advertencias).

---

## 3. Parches aplicados

| Parche | Qué hace | Dónde | Motivo |
|---|---|---|---|
| **P1** | Añade `--color-blanco` y `--sombra-boton` al `:root` | Variables globales | Había referencias a variables inexistentes. |
| **P2** | `.card`, `.card-body` y `.card-footer` usan `--color-blanco-puro` | Tarjetas | `var(--color-blanco)` no estaba definida. |
| **P3** | `.titulo-seccion-modal` usa `--fuente-titulo-principal` | Modales | `var(--fuente-titulos)` no existía. |
| **P4** | Regla global `img` consolidada en `img, video` | Base global | Evita dos reglas para lo mismo. |
| **P5** | Elimina `*:focus-visible` duplicado | Base global | Se conserva solo `:focus-visible`. |
| **P6** | `body` sin `background: #f5f5f5` redundante | Base global | Esa propiedad quedaba anulada por `background-color`. |
| **P7** | `#btnWhatsapp` con `display: inline-flex` | Botones flotantes | Centra el icono si el JS no controla `display`. |

### Detalle de P1

Se añadieron estos alias:

```css
--color-blanco: var(--color-blanco-puro);
--sombra-boton: 0 4px 12px rgba(158, 30, 76, .30);
```

`--color-blanco` evita romper HTML o CSS que aún use la variable antigua.  
`--sombra-boton` era usada por varios botones, pero no estaba definida.

### Detalle de P7 — advertencia importante

`#btnWhatsapp` ahora tiene `display: inline-flex`.

Esto es seguro si el botón siempre está visible o si el JS lo oculta/muestra con `style.display`.

**Puede romper el ocultamiento si el JS usa una clase** (por ejemplo, `.d-none` de Bootstrap) para esconderlo, porque el selector `#btnWhatsapp` tiene más especificidad que la clase.

Antes de producción:

- Revisar el JS que controla `#btnWhatsapp`.
- Si el JS usa clases para ocultar, cambiar P7 a:
  ```css
  #btnWhatsapp.is-visible {
    display: inline-flex;
  }
  ```
  o asegurar que el JS use `style.display`.

---

## 4. Estructura funcional del CSS

El archivo mantiene una organización por zonas. El orden exacto puede variar ligeramente respecto a `styles-cloude.css`, pero la lógica es esta:

| Zona | Contenido |
|---|---|
| Variables globales | `:root` con colores, tipografía, tamaños, espaciados, sombras, transiciones y alias. |
| Base global consolidada | `box-sizing`, `body`, `img/video`, enlace de salto, foco visible, altura táctil. |
| Header / navbar | `.navbar`, `.navbar-brand`, `.nav-link`, `.btn`, buscador y responsive. |
| Hero | `.hero-section`, tipografía, botones, imagen y carrusel. |
| Productos destacados | `.gv-scope`, tarjetas, botones `gv-btn`, promoción y responsive. |
| Equipo / tarjetas | `.titulo-equipo`, `.card`, `.card-body`, `.card-footer`. |
| Variables y pilares | `.pilares-grid`, `.pilar-card`, secciones de proyecto, misión, visión y valores. |
| Sobre Sketch & Coffee | `.lf-sobre-sketch`, modal boceto, listas. |
| Newsletter | `.section-newsletter`, `.newsletter-input`, `.btn-custom-magenta`. |
| Footer | `.footer-global`, `#pie-pagina`, `#footer-global`, footer landing. |
| Botones flotantes | `#btnWhatsapp`, `#btnSubir`. |
| Contacto | Tarjetas, formularios, horarios, mapa, mensajes de error/éxito. |
| Menú / catálogo | Filtros, botones píldora, tarjetas de producto, paginación. |
| FAQ | `.faq-btn`. |
| Detalle de producto | Galería, opciones, cantidad, tabs, relacionados, carrusel TOP 10. |
| Creación de productos | Formulario, vista previa, listado, responsive. |
| Landing de promociones | Hero de promos, filtros, insignias, newsletter y footer. |
| Utilidades responsive | Ajustes táctiles y de ancho. |

---

## 5. Qué se conserva a propósito

No todo selector repetido es redundante. Se conservaron estos casos porque cumplen funciones distintas:

- **`.section-newsletter`**: hay una regla para el contenedor y otra para `h2`/`p`. No es duplicado.
- **`.newsletter-input`**: base y estado `:focus` son reglas distintas.
- **`.btn-custom-magenta`**: base, `:hover`, `:active` y responsive son estados/contextos distintos.
- **`.tarjeta-producto`**: base y `:hover` no son duplicados.
- **`.contenedor-imagen-producto`**: el contenedor y la imagen tienen reglas distintas.
- **Footer**: `.footer-global`, `#pie-pagina` y `#footer-global` se mantienen como alias para no tocar HTML.
- **Alias de variables**: `--color-blanco-formularios`, `--color-blanco-secciones`, etc. se conservan para compatibilidad.
- **`.boton-magenta`, `.boton-esquema`, `.btn-custom-magenta`**: comparten estilo visual, pero se conservan como clases separadas para no tocar HTML.
- **`.gv-btn--primario` y `.gv-btn--secundario`**: no se migraron a `.btn-magenta` ni `.btn-outline-magenta`.

---

## 6. Mapeo para HTML

**Acción obligatoria en HTML: ninguna.**

No hay que renombrar clases, cambiar IDs ni añadir clases nuevas.

| Selector en HTML | Acción | Nuevo selector | Explicación |
|---|---|---|---|
| `.card`, `.card-body`, `.card-footer` | Sin cambios | Los mismos | Se corrigió el CSS, no el HTML. |
| `.titulo-seccion-modal` | Sin cambios | El mismo | Se corrigió la variable de fuente. |
| `.boton-magenta` | Sin cambios | El mismo | No migrar a `.btn-magenta`. |
| `.boton-esquema` | Sin cambios | El mismo | Se conserva por compatibilidad. |
| `.btn-custom-magenta` | Sin cambios | El mismo | Ahora usa `--sombra-boton`. |
| `.gv-btn--primario` | Sin cambios | El mismo | No reemplazar por `.btn-magenta`. |
| `.gv-btn--secundario` | Sin cambios | El mismo | No reemplazar por `.btn-outline-magenta`. |
| `.tarjeta-producto` | Sin cambios | El mismo | No añadir `.promo`. |
| `#btnWhatsapp` | Sin cambios en HTML; revisar JS | `#btnWhatsapp` | Ver advertencia P7. |
| Footer (`#pie-pagina`, `#footer-global`, `.footer-global`) | Sin cambios | Los mismos | Los alias siguen funcionando. |

---

## 7. Qué NO se hizo y por qué

No se aplicaron estas propuestas de otras versiones:

- Reemplazar `.navbar .btn`, `.hero-section button`, `.gv-btn--primario`, `.boton-magenta`, `.btn-guardar`, etc. por `.btn-magenta`.
- Unificar `.card`, `.tarjeta-boceto`, `.pilar-card`, `.tarjeta-producto`, `.product-card`, `.gv-producto` y `.producto-item` en una sola regla base.
- Añadir `.promo` a `.tarjeta-producto`.
- Eliminar alias de variables sin revisar todos los HTML.
- Bajar el archivo a 500 líneas.

Motivo: esas acciones reducen líneas, pero **mezclan contextos visuales distintos** y obligan a tocar HTML. En un sitio con 10 páginas y estilos por contexto, eso aumenta el riesgo de regresiones.

---

## 8. Cómo seguir trabajando con este CSS

### Reglas de mantenimiento

1. **No renombrar clases existentes** sin revisar las 10 páginas HTML y el JS.
2. **No añadir estilos genéricos nuevos** tipo `.btn` o `.card` que puedan chocar con Bootstrap.
3. **Usar las variables existentes** antes de crear colores, sombras o tamaños nuevos.
4. **No eliminar alias de variables** hasta hacer un `grep` en HTML, CSS y JS.
5. **No unificar contextos distintos** solo para reducir líneas.
6. **Mantener los estados** `:hover`, `:focus`, `.active` y `:active` junto a su componente.
7. **Respetar `prefers-reduced-motion`** y el foco visible.
8. **Evitar nuevos `!important`** salvo para sobrescribir Bootstrap o estados muy específicos.

### Si necesitas reducir más el archivo

Opciones seguras:

- **Minificar para producción** con una herramienta. Reduce líneas físicas, no reglas.
- **Separar por páginas o componentes** si el equipo lo necesita. No reduce el total, pero organiza.
- **Purgar CSS no usado** con una herramienta, revisando antes los HTML y el JS.
- **Mover `:root` al inicio** del archivo. Es cosmético, no cambia el render.
- **Sustituir literales por tokens** de forma gradual (`#9E1E4C` → `var(--color-magenta)`).

Opciones que no recomiendo:

- Unificar botones de contextos distintos.
- Unificar tarjetas de páginas distintas.
- Eliminar alias sin revisar usos.
- Convertir todo a una sola clase genérica.

---

## 9. Checklist de validación antes de dar por cerrado

- [ ] El archivo CSS carga sin errores de sintaxis en DevTools.
- [ ] Las 10 páginas HTML enlazan correctamente a `styles.css`.
- [ ] `.card`, `.card-body` y `.card-footer` tienen fondo blanco.
- [ ] `.titulo-seccion-modal` usa la fuente correcta.
- [ ] Los botones que usan `--sombra-boton` muestran sombra en `:hover`.
- [ ] `#btnWhatsapp` se ve centrado y se oculta/muestra correctamente según el JS.
- [ ] `#btnSubir` sigue funcionando.
- [ ] Newsletter, footer y formularios mantienen su apariencia.
- [ ] No hay diferencias visuales en las 10 páginas respecto a la versión anterior.
- [ ] `:focus-visible` sigue siendo visible al navegar con teclado.
- [ ] En móvil, los botones y campos mantienen altura táctil de 44px.

---

## 10. Trabajo futuro recomendado

1. **Mover `:root` al inicio** del archivo para facilitar lectura.
2. **Documentar los alias de variables** y marcar cuáles son legacy.
3. **Revisar `#btnWhatsapp`** y decidir si P7 se queda o se cambia a `.is-visible`.
4. **Sustituir literales de color** por variables de forma gradual.
5. **Añadir Stylelint** con reglas básicas para evitar duplicados y errores.
6. **Separar CSS por página** solo si el equipo lo necesita; no como excusa para reducir líneas.
7. **Hacer una prueba visual** en las 10 páginas antes de cualquier nueva consolidación.

---

## 11. Resumen ejecutivo

- **Mejor versión:** `styles-cloude.css` + parches P1–P7.
- **Cambios obligatorios en HTML:** ninguno.
- **Cambios en JS:** ninguno obligatorio, pero revisar `#btnWhatsapp`.
- **Riesgo visual:** bajo, salvo el caso P7.
- **Objetivo realista:** CSS mantenible y sin duplicados seguros, no un archivo de 500 líneas.
- **Regla de oro:** no unificar contextos distintos solo para reducir líneas.
