# Reporte de revisión y optimización CSS

## Resumen de líneas

La hoja revisada es `css/styles.css`. Se compara el archivo inicial del repositorio con la versión actual:

| Medida | Resultado |
|---|---:|
| Líneas iniciales | 3,202 |
| Líneas actuales | 2,820 |
| Reducción neta | **382 líneas (11.9 %)** |
| Diferencia del diff frente a la versión inicial | 583 eliminadas y 201 añadidas |

La reducción neta se calcula con los saltos de línea de ambos archivos. Git también cuenta como eliminación y adición los bloques que se movieron o reorganizaron; por eso 583 eliminadas menos 201 añadidas da la reducción efectiva de 382 líneas.

### Resultado de esta revisión

En esta revisión de diagnóstico final se quitaron **0 líneas CSS adicionales**: no se encontraron duplicaciones seguras pendientes que justificaran otra consolidación. La nota explicativa del hover se actualizó sin cambiar el total de líneas. La reducción acumulada de las revisiones anteriores permanece en **382 líneas netas** frente al CSS inicial.

## Qué se añadió o reorganizó

- **Base global al inicio:** se reunieron el reinicio de caja, ancho del documento, tipografía base y encabezados, herencia de fuente para controles, imágenes responsivas, foco visible y altura táctil.
- **Botones compartidos:** el bloque de transiciones y hover se colocó antes de los estilos de página para identificar rápidamente qué botones siguen esa interacción. Los colores, fondos y estados particulares permanecen en sus secciones.
- **Consolidación de componentes:** las reglas base de newsletter, botones magenta, tarjetas e imágenes de producto y galería se reunieron cuando compartían el mismo resultado visual.
- **Explicaciones breves:** se añadieron rótulos para la base compartida, la interacción común de botones y las excepciones del carrusel.

## Qué se quitó o consolidó

- Declaraciones duplicadas o anuladas por la cascada, incluyendo reglas repetidas de tipografía y componentes.
- Un segundo bloque `:root`; sus seis variables se conservaron dentro del bloque principal.
- Definiciones repetidas de `.section-newsletter`, `.newsletter-input`, `.btn-custom-magenta`, `.tarjeta-producto` y `.contenedor-imagen-producto`.
- Segundas reglas de `.main-image-box`, su imagen, `.thumbnails-grid` y `.thumb-item`; sus propiedades no repetidas se integraron en la definición base.
- La segunda definición del enlace de salto y la transición duplicada de la tarjeta del carrusel.
- La transición local de los botones del componente de productos, que sobrescribía la interacción común.
- La sombra de texto exclusiva de `.titulo-equipo`, para igualarlo visualmente con los demás títulos de sección.
- Se integró el encabezado repetido de newsletter con el rótulo de esa sección. La nota del efecto de trazo se conserva y ahora aclara que ese efecto se retiró al unificar el hover.
- Se añadieron comentarios breves para explicar la base compartida, la interacción común y las excepciones del carrusel.

## Diagnóstico final de redundancias

Se revisaron las reglas de `styles.css` y su uso en las diez páginas HTML. El navegador interpreta 351 reglas de estilo y se encontraron 25 bloques `@media`, que corresponden a 13 condiciones distintas. No quedan bloques con el mismo selector repetido dentro de la misma condición responsive.

Las apariciones que aún comparten nombre de selector son complementos necesarios, no copias idénticas: corresponden a estados como `:hover` y `:focus`, a ajustes de tamaño de pantalla, o a propiedades específicas que amplían la regla base. Por ejemplo:

- `.section-newsletter`, `.newsletter-input` y `.btn-custom-magenta` conservan estilos base y reglas distintas para sus campos, foco, hover y pantallas pequeñas.
- `.tarjeta-producto` tiene su presentación base, un estado hover y ajustes para dispositivos táctiles.
- `.contenedor-imagen-producto` y su imagen tienen reglas distintas para el marco y el contenido.
- Los títulos de contacto comparten tipografía, color y peso, pero solo los títulos dentro de `.tarjeta-boceto` reciben el margen adicional; incluir `.seccion-mapa h2` en esa regla cambiaría su apariencia.

El objetivo de 1,000 líneas implicaría retirar aproximadamente 1,820 líneas adicionales (cerca del 65 % del CSS actual). No se encontraron duplicados seguros suficientes para alcanzar esa cifra. Lograrla exigiría eliminar estilos todavía activos, reducir comentarios o cambiar la presentación. Minificar el archivo puede reducir su número de líneas físicas, pero no la cantidad de reglas que hay que mantener y dificultaría el trabajo del equipo; separar el CSS por página lo organizaría, pero no reduciría el total de líneas.

## Distribución actual de `styles.css`

Las líneas son aproximadas y sirven como guía de navegación; pueden desplazarse al editar el archivo.

| Zona aproximada | Contenido |
|---|---|
| 1–138 | Variables de color, tipografía, tamaños, espaciado, radios, sombras y transiciones (`:root`). |
| 140–224 | Base global, accesibilidad y transición/hover común de botones. |
| 226–352 | Navbar, navegación, buscador y comportamiento responsive del encabezado. |
| 354–458 | Hero de inicio y carrusel de imágenes. |
| 460–800 | Productos destacados, promociones estacionales y componentes `.gv-scope`. |
| 802–916 | Tarjetas y presentación del equipo. |
| 918–1266 | Proyecto, misión, visión, valores y contenido relacionado de la página «Acerca de nosotros». |
| 1268–1415 | Newsletter y footer compartido. |
| 1417–1465 | Botones flotantes para subir y abrir WhatsApp. |
| 1467–1688 | Contacto, formularios, horarios, mapa y preguntas frecuentes. |
| 1690–2008 | Menú, filtros, catálogo y tarjetas de productos. |
| 2009–2436 | Detalle de producto, galería, opciones de compra y productos relacionados. |
| 2437–2676 | Formulario de creación y listado de productos, incluidos sus ajustes responsive. |
| 2678–2820 | Landing de promociones, tarjetas dinámicas, footer y ajustes para dispositivos táctiles. |

La base y el hover común están arriba porque son reglas transversales. Las reglas específicas continúan agrupadas por página o componente para que sea claro dónde ajustar cada diseño.

## Por qué se conservaron otras reglas

No toda repetición aparente es redundancia. Se conservaron reglas cuando quitarlas podría cambiar el diseño, la función o la accesibilidad:

- **Variantes de componentes:** tarjetas, footers, botones y formularios comparten algunas propiedades, pero también tienen dimensiones, colores, fondos, bordes o interacciones diferentes.
- **Cascada y estados:** una regla `:hover`, `:focus`, `.active` o `:active` complementa el estilo base; no es un duplicado aunque comparta selector.
- **Responsive (`@media`):** cada breakpoint adapta el diseño a un ancho o capacidad diferente. Se combinaron consultas solo cuando coincidían en condición y comportamiento.
- **Interacción y accesibilidad:** se mantienen el foco visible, las áreas táctiles, el movimiento reducido y las excepciones de los indicadores del carrusel.
- **Variables y fallbacks:** algunos alias tienen usos existentes y algunos colores grises son distintos. Eliminarlos o igualarlos sin revisar cada uso podría modificar páginas.
- **Comentarios:** se conservaron los que explican secciones o decisiones del equipo; los rótulos repetidos se integraron y la nota del efecto retirado se mantuvo con una aclaración.

El objetivo fue reducir repetición sin borrar selectores necesarios, cambiar la estructura HTML ni convertir contextos visuales distintos en una regla genérica.

## Revisión de estilos calculados
- Los archivos JavaScript y JSON no se modificaron. En `aviso.html` y `terminos.html` se añadieron las etiquetas `<body>` y cierres `</html>` que faltaban; se verificó que las diez páginas HTML enlacen a `css/styles.css`.

## Comprobaciones

- `git diff --check`: correcto.
- Llaves CSS: balanceadas.
- Se comprobó en navegador la tipografía y dimensiones de los componentes indicados.
- Algunos recursos externos pueden no cargar al abrir las páginas desde el sistema de archivos local.
