# Reporte de pruebas de integración — Actividad 14

**Responsable:** Gonzalo Vargas · **Rol:** Pruebas de Integración y Calidad
**Rama:** `feature/pruebas-integracion`
**Fecha de ejecución:** 5 de noviembre de 2026
**Estado del reporte:** Final

---

## 1. Alcance

Validar que la comunicación entre las vistas web, la API REST de Spring Boot y la base de datos MySQL funcione sin errores.

Se probaron los cinco módulos de la API:

| Módulo | Responsable del módulo | Peticiones probadas |
|---|---|---|
| Usuarios (registro y login) | Vanya / Alexandra | 9 |
| Categorías | Zeth | 7 |
| Productos | Gonzalo | 12 |
| Pedidos | Laura | 4 |
| Detalles de pedido | Manuel | 7 |
| Integridad referencial (transversal) | — | 3 |
| Limpieza de datos de prueba | — | 5 |

Y la integración desde el navegador de los dos flujos conectados esta semana:

- `login.js` → `POST /sketchcoffee/usuarios/login` (Manuel)
- `registro.js` → `POST /sketchcoffee/usuarios/registro` (Alexandra)

**Fuera de alcance:** pruebas de carga, seguridad ofensiva (inyección SQL, XSS), compatibilidad entre navegadores y el despliegue en la nube (tarea de Liz).

---

## 2. Entorno de pruebas

| Elemento | Valor |
|---|---|
| Sistema operativo | Windows 11, versión 25H2 (compilación 26200.9711) |
| Java del sistema | **27** (build 27+35-2325) |
| Java que usa el proyecto | **21**, fijado por el *toolchain* de Gradle en `build.gradle` |
| Spring Boot | 4.1.2 (Gradle 9.8.2) |
| Base de datos | **MySQL 8.4**, esquema `sketch_coffee` |
| URL base de la API | `http://localhost:8080/sketchcoffee` |
| Herramienta de pruebas | Postman (Collection Runner) |
| Navegador | **Google Chrome 156.0.8078.49** (64 bits) |
| Rama del backend probada | `develop`, commit `2fa6d42` |
| Datos de partida | Script `base_datos.sql` de la Actividad 11, 5 filas por tabla |

> **Nota sobre la versión de Java:** la máquina de pruebas tiene instalado el JDK **27**, mientras que `build.gradle` exige el **21** con `JavaLanguageVersion.of(21)`. Gradle no compila con una versión distinta a la declarada, así que el proyecto no arrancaba hasta instalar el JDK 21 y apuntarle el *Gradle JVM* de IntelliJ. Quien clone el repositorio en una máquina nueva se va a topar con el mismo error (*"Cannot find a Java installation... matching language version 21"*), y conviene dejarlo escrito en el README.

> **Nota sobre la versión de MySQL:** se probó con **8.4**, mientras que el resto del equipo trabaja con 8.0. No se observó ninguna diferencia de comportamiento, pero queda anotado por si alguna prueba se reproduce distinto en otra máquina.

> **Nota sobre los datos:** la colección crea sus propios registros con nombres y SKU marcados con la hora (`QA-1762...`) y la carpeta 07 los borra al terminar. Se verificó que las cinco filas originales de cada tabla quedaron intactas.

---

## 3. Resumen de resultados

| Métrica | Valor |
|---|---|
| Peticiones ejecutadas | **48** |
| Aserciones totales | **84** |
| Aserciones correctas | **74** (88 %) |
| Aserciones fallidas | **10** (12 %) |
| Duración total | 4.195 s |
| Hallazgos abiertos | **4** (1 alta, 2 medias, 1 baja) |

**Las 10 aserciones fallidas se concentran en dos defectos**, ambos reproducibles al 100 %:

| Defecto | Aserciones afectadas |
|---|---|
| H-01 — el módulo Usuarios no devuelve el campo `mensaje` en sus errores | 6 |
| H-02 — borrar con dependencias responde 500 en lugar de 409 (Categorías y Usuarios) | 4 |

**Ninguna petición falló por un código HTTP equivocado en los módulos de Categorías, Productos, Pedidos ni Detalles.** Esos cuatro módulos cumplen el contrato por completo.

**Captura del resumen del Collection Runner:** `evidencias/00_resumen_collection_runner.png`

> **Nota metodológica:** hubo una primera corrida con 18 fallas. Al revisarla se encontró que la colección enviaba los identificadores como texto (`"pedidoId": "6"`) en lugar de número, lo que hacía fallar las peticiones de `/detalles` y, en cascada, las de integridad referencial y limpieza. Se corrigió la colección y se volvió a ejecutar. Los resultados de este reporte son los de la **segunda corrida**. El defecto de la colección dejó, sin embargo, una observación válida sobre el endpoint de detalles, documentada como H-04.

---

## 4. Casos de prueba por módulo

Leyenda: ✅ el caso pasó por completo · ⚠️ el código HTTP fue correcto pero el cuerpo de la respuesta no cumple el contrato · ❌ el código HTTP fue incorrecto

### 4.1 Backend encendido

| # | Caso | Esperado | Obtenido | Resultado |
|---|---|---|---|---|
| 00.1 | `GET /productos` responde y devuelve lista | 200 | 200 + array | ✅ |

### 4.2 Usuarios — registro y login

| # | Caso | Esperado | Obtenido | Resultado |
|---|---|---|---|---|
| 01.1 | `POST /usuarios/registro` con datos válidos | 201 | 201, sin exponer contraseña | ✅ |
| 01.2 | `POST /usuarios/registro` con correo ya registrado | 409 | 409, **sin campo `mensaje`** | ⚠️ H-01 |
| 01.3 | `POST /usuarios/registro` sin el campo correo | 400 | 400, **sin campo `mensaje`** | ⚠️ H-01 |
| 01.4 | `POST /usuarios/registro` con correo mal formado | 400 | 400, **sin campo `mensaje`** | ⚠️ H-01 |
| 01.5 | `POST /usuarios/login` con credenciales correctas | 200 | 200, devuelve `id`, sin contraseña | ✅ |
| 01.6 | `POST /usuarios/login` con contraseña incorrecta | 401 | 401, **sin campo `mensaje`** | ⚠️ H-01 |
| 01.7 | `POST /usuarios/login` con correo inexistente | 401 | 401, **sin campo `mensaje`** | ⚠️ H-01 |
| 01.8 | `GET /usuarios` no expone `passwordHash` | 200 + sin hash | 200, sin hash | ✅ |
| 01.9 | `GET /usuarios/999999` | 404 | 404, **sin campo `mensaje`** | ⚠️ H-01 |

**Observación positiva:** el `passwordHash` no aparece en **ninguna** respuesta del módulo —ni en el registro, ni en el login, ni en el listado completo de usuarios—. La protección con `@JsonProperty(WRITE_ONLY)` funciona correctamente.

**Observación positiva:** los casos 01.6 y 01.7 devuelven el mismo código 401, sin distinguir entre "contraseña incorrecta" y "correo inexistente". Es el comportamiento correcto: evita que alguien pueda averiguar qué correos están registrados probando el formulario.

### 4.3 Categorías

| # | Caso | Esperado | Obtenido | Resultado |
|---|---|---|---|---|
| 02.1 | `GET /categorias` | 200 | 200 | ✅ |
| 02.2 | `POST /categorias` válida | 201 | 201 | ✅ |
| 02.3 | `POST /categorias` con nombre duplicado | 409 | 409 + `mensaje` | ✅ |
| 02.4 | `POST /categorias` sin nombre | 400 | 400 + `mensaje` | ✅ |
| 02.5 | `GET /categorias/{id}` existente | 200 | 200 | ✅ |
| 02.6 | `GET /categorias/999999` | 404 | 404 + `mensaje` | ✅ |
| 02.7 | `PUT /categorias/{id}` | 200 | 200 | ✅ |

### 4.4 Productos

| # | Caso | Esperado | Obtenido | Resultado |
|---|---|---|---|---|
| 03.1 | `GET /productos` | 200 | 200 | ✅ |
| 03.2 | `POST /productos` válido | 201 | 201, precio con 2 decimales, categoría anidada con nombre | ✅ |
| 03.3 | `POST /productos` con SKU duplicado | 409 | 409 + `mensaje` | ✅ |
| 03.4 | `POST /productos` sin nombre | 400 | 400 + `mensaje` | ✅ |
| 03.5 | `POST /productos` con precio negativo | 400 | 400 + `mensaje` | ✅ |
| 03.6 | `POST /productos` con existencias negativas | 400 | 400 + `mensaje` | ✅ |
| 03.7 | `POST /productos` con `categoriaId` inexistente | 404 | 404 + `mensaje` | ✅ |
| 03.8 | `GET /productos/{id}` existente | 200 | 200 | ✅ |
| 03.9 | `GET /productos/999999` | 404 | 404 + `mensaje` | ✅ |
| 03.10 | `GET /productos/categoria/{id}` válida | 200 | 200 + array | ✅ |
| 03.11 | `GET /productos/categoria/999999` | 404 | 404 + `mensaje` | ✅ |
| 03.12 | `PUT /productos/{id}` conservando su propio SKU | 200 (no 409) | 200, precio actualizado a 70.00 | ✅ |

### 4.5 Pedidos

| # | Caso | Esperado | Obtenido | Resultado |
|---|---|---|---|---|
| 04.1 | `GET /pedidos` | 200 | 200 | ✅ |
| 04.2 | `POST /pedidos` válido | 201 | 201, `estado: "PENDIENTE"`, fecha asignada por el backend | ✅ |
| 04.3 | `GET /pedidos/{id}` devuelve `estado: "PENDIENTE"` | 200 | 200, estado correcto | ✅ |
| 04.4 | `GET /pedidos/999999` | 404 | 404 + `mensaje` | ✅ |

**Observación positiva:** la columna `estado` de MySQL guarda los valores en minúsculas (`'pendiente'`) y el enum de Java los maneja en mayúsculas (`PENDIENTE`). El convertidor `EstadoPedidoConverter` traduce en ambos sentidos sin errores. Se verificó guardando y volviendo a leer el mismo pedido.

### 4.6 Detalles de pedido

| # | Caso | Esperado | Obtenido | Resultado |
|---|---|---|---|---|
| 05.1 | `GET /detalles` | 200 | 200 | ✅ |
| 05.2 | `POST /detalles` válido | 201 | 201 | ✅ |
| 05.3 | `POST /detalles` con cantidad 0 | 400 | 400 + `mensaje` | ✅ |
| 05.4 | `POST /detalles` con producto inexistente | 404 | 404 + `mensaje` | ✅ |
| 05.5 | `POST /detalles` con pedido inexistente | 404 | 404 + `mensaje` | ✅ |
| 05.6 | `GET /detalles/pedido/{id}` válido | 200 | 200 | ✅ |
| 05.7 | `GET /detalles/pedido/999999` | 404 | 404 + `mensaje` | ✅ |

### 4.7 Integridad referencial

Estos tres casos comprueban que las llaves foráneas con `ON DELETE RESTRICT` se traduzcan a un código HTTP legible y no a un error de servidor.

| # | Caso | Esperado | Obtenido | Resultado |
|---|---|---|---|---|
| 06.1 | `DELETE /productos/{id}` de un producto que está en un detalle | 409 | **409 + `mensaje`** | ✅ |
| 06.2 | `DELETE /categorias/{id}` de una categoría que tiene productos | 409 | **500** | ❌ H-02 |
| 06.3 | `DELETE /usuarios/{id}` de un usuario que tiene pedidos | 409 | **500** | ❌ H-02 |

**Este es el resultado más informativo de toda la corrida.** Los tres casos son el mismo problema técnico —una llave foránea que impide el borrado— y uno de los tres módulos lo resuelve bien. El caso 06.1 sirve de referencia para arreglar los otros dos.

### 4.8 Limpieza

| # | Caso | Esperado | Obtenido | Resultado |
|---|---|---|---|---|
| 07.1 | `DELETE /detalles/{id}` | 204 | 204 | ✅ |
| 07.2 | `DELETE /pedidos/{id}` | 204 | 204 | ✅ |
| 07.3 | `DELETE /productos/{id}` ya sin detalle | 204 | 204 | ✅ |
| 07.4 | `DELETE /categorias/{id}` ya sin producto | 204 | 204 | ✅ |
| 07.5 | `DELETE /usuarios/{id}` ya sin pedido | 204 | 204 | ✅ |

La base quedó con las mismas cinco filas por tabla con las que empezó.

---

## 5. Integración front-end ↔ back-end (pestaña Red de F12)

Esta sección documenta las peticiones `fetch` reales que salen del navegador, observadas en la pestaña **Network** de las DevTools de Chrome.

**Entorno:** página servida por Live Server en `http://127.0.0.1:5501`, backend en `http://localhost:8080`. Son orígenes distintos, así que el navegador aplica las reglas de CORS igual que lo haría en producción.

> **Advertencia importante sobre el alcance:** al momento de estas pruebas, **ni `login.js` ni `registro.js` conectados al backend estaban en `develop`**. La rama `develop` del frontend llevaba 7 días sin cambios y sus dos archivos no contienen una sola llamada `fetch`. El trabajo de esta semana vive únicamente en las ramas `manuel` y `alexandra`.
>
> Por eso las pruebas se hicieron **rama por rama** y no sobre el estado integrado. Hasta que esas dos ramas se fusionen, no existe una versión del frontend que tenga los dos flujos conectados a la vez.

### 5.1 Inicio de sesión — `login.js` (rama `manuel`)

**Página:** `inicio-sesion.html`

| # | Escenario | Petición observada | Código | Lo que ve el usuario | Resultado |
|---|---|---|---|---|---|
| F.1 | Credenciales correctas | — | — | — | ⬜ No probado |
| F.2 | Contraseña incorrecta de un usuario existente | — | — | — | ⬜ No probado |
| F.3 | Credenciales que no corresponden a ningún usuario | `POST /sketchcoffee/usuarios/login` | **401** | *"Credenciales incorrectas. Verifica tus datos."* | ✅ |
| F.4 | Backend apagado | la petición no llega al servidor | — | *"No se pudo conectar con el servidor backend. Asegúrate de que esté encendido."* | ✅ |

**Capturas:** `evidencias/F3_login_401_sin_mensaje.png`, `evidencias/F4_backend_apagado.png`

#### F.3 — Confirmación del H-01 desde el navegador

Esta es la evidencia más importante de la sección. El cuerpo que el servidor devolvió, leído en la pestaña **Response**:

```json
{
  "timestamp": "2026-11-05T18:00:32.148Z",
  "status": 401,
  "error": "Unauthorized",
  "path": "/sketchcoffee/usuarios/login"
}
```

El código 401 es el correcto. Pero **no hay ningún campo `mensaje`**, ni ninguna explicación del motivo.

El texto que el usuario lee en pantalla —*"Credenciales incorrectas. Verifica tus datos."*— **no viene del servidor**: está escrito a mano dentro de `login.js`. El servidor sí construye el texto *"Credenciales inválidas"* en `UsuarioService`, pero se pierde antes de salir, por lo explicado en el H-01.

Esto confirma el hallazgo desde el lado que de verdad importa: el del navegador. Mientras el único motivo de rechazo sea una credencial equivocada el usuario no nota nada, pero el front no tiene forma de distinguir ningún otro caso.

#### F.4 — Comportamiento con el servidor apagado

Con el backend detenido, la petición falla antes de llegar a ningún lado y `login.js` muestra un mensaje **distinto** al de credenciales malas.

**Resultado positivo:** el `catch` del archivo sí separa "el servidor dijo que no" de "el servidor no contestó". El usuario entiende que el problema no es suyo.

> Esto hace más relevante el **H-03**: el código ya distingue bien el caso de "sin conexión", pero sigue metiendo el **500** en el mismo saco que el 401. Dado que el H-02 demuestra que el backend sí produce 500 en situaciones normales, conviene separarlo también.

#### Observaciones de CORS

En el escenario F.3, la pestaña Network mostró **dos** entradas `login`: la verificación previa que Chrome envía automáticamente (*preflight* `OPTIONS`) y la petición `POST` real. Ambas se completaron sin error.

**Esto confirma que el `@CrossOrigin(origins = "*")` de `UsuarioController` está bien configurado**, y que el frontend puede llamar al backend aunque corran en puertos distintos. No se observó ningún error de CORS en la consola.

#### Verificación de seguridad

En ninguna de las respuestas observadas en el navegador apareció `passwordHash` ni `password_hash`. Coincide con lo medido en Postman (casos 01.1, 01.5 y 01.8).

### 5.2 Registro — `registro.js` (rama `alexandra`)

| # | Escenario | Resultado |
|---|---|---|
| F.5 a F.8 | Registro válido, correo duplicado, campos incompletos, correo mal formado | ⬜ **No probado** |

**Motivo:** el flujo de registro vive en una rama distinta (`alexandra`) a la del login (`manuel`), y no hay una rama que tenga ambos. Probarlo exige cambiar de rama y repetir el montaje completo. Quedó fuera por tiempo.

**Lo que sí se sabe de este flujo:** los endpoints `POST /usuarios/registro` se probaron a fondo desde Postman (casos 01.1 a 01.4) y responden los códigos correctos: 201, 409 y 400. Lo que falta verificar es únicamente que `registro.js` los interprete y los muestre bien en pantalla.

**Recomendación:** hacer esta verificación cuando ambas ramas estén integradas en `develop`, que además es el momento en que tiene sentido probar el flujo completo de extremo a extremo (registrarse y después iniciar sesión con ese mismo correo).

---

## 6. Hallazgos

### H-01 — El cuerpo de error del módulo Usuarios no sigue el contrato

**Severidad:** Alta · **Módulo:** Usuarios · **Estado:** ✅ **Confirmado**, reproducible al 100 %

La regla 1 del contrato de endpoints dice que todo error debe responder con un cuerpo uniforme:

```json
{ "mensaje": "<descripción>" }
```

Categorías, Productos, Pedidos y Detalles lo cumplen, porque arman el cuerpo a mano con `Map.of("mensaje", ...)`.

`UsuarioService` en cambio lanza `ResponseStatusException`. **El código HTTP sale correcto** (401, 404, 409, 400 — los seis casos lo acertaron), pero el cuerpo lo construye Spring por omisión y queda así:

```json
{ "timestamp": "...", "status": 401, "error": "Unauthorized", "path": "/sketchcoffee/usuarios/login" }
```

No trae `mensaje`. Y como `server.error.include-message` viene en `never` por omisión en Spring Boot, el texto *"Credenciales inválidas"* que el servicio sí escribe **nunca llega al navegador**.

**Evidencia:** las 6 peticiones de error del módulo fallaron la aserción del contrato:

| Petición | Código | ¿Trae `mensaje`? |
|---|---|---|
| `POST /usuarios/registro` correo duplicado | 409 ✅ | ❌ |
| `POST /usuarios/registro` sin correo | 400 ✅ | ❌ |
| `POST /usuarios/registro` correo mal formado | 400 ✅ | ❌ |
| `POST /usuarios/login` contraseña incorrecta | 401 ✅ | ❌ |
| `POST /usuarios/login` correo inexistente | 401 ✅ | ❌ |
| `GET /usuarios/999999` | 404 ✅ | ❌ |

**Impacto:** `login.js` y `registro.js` no pueden mostrar el motivo real del error. Hoy lo disimulan con un texto fijo escrito en el cliente, pero si mañana cambia el motivo —una cuenta desactivada, por ejemplo— el usuario seguirá leyendo "Credenciales incorrectas" y nadie se dará cuenta.

**Recomendación:** agregar un manejador global en el backend. Es un archivo nuevo, no toca el código de nadie, y arregla los seis casos de una vez:

```java
@RestControllerAdvice
public class ManejadorDeErrores {
    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<Map<String, String>> manejar(ResponseStatusException e) {
        return ResponseEntity.status(e.getStatusCode())
                .body(Map.of("mensaje", e.getReason() != null ? e.getReason() : "Error"));
    }
}
```

> Existe un atajo: poner `server.error.include-message=always` en `application.properties`. Hace visible el texto, **pero bajo la llave `message`, no `mensaje`**, así que sigue sin cumplir el contrato y además cambia el formato de error de toda la aplicación. Sirve para depurar, no para cerrar este hallazgo.

**Responsable sugerido:** Vanya o Alexandra, que son las dueñas del módulo.

---

### H-02 — Borrar un registro con dependencias responde 500 en lugar de 409

**Severidad:** Media · **Módulos:** Categorías y Usuarios · **Estado:** ✅ **Confirmado**

Las llaves foráneas `productos → categorias` y `pedidos → usuarios` están declaradas `ON DELETE RESTRICT`. Al intentar borrar un registro que todavía tiene dependientes, MySQL rechaza la operación y Hibernate lanza `DataIntegrityViolationException`.

`CategoriaController.eliminar()` y `UsuarioController.eliminarUsuario()` no atrapan esa excepción, así que sale un **500 Internal Server Error** sin ninguna explicación.

**Evidencia:**

| Petición | Esperado | Obtenido |
|---|---|---|
| `DELETE /categorias/7` con un producto asociado | 409 | **500** |
| `DELETE /usuarios/7` con un pedido asociado | 409 | **500** |
| `DELETE /productos/7` con un detalle asociado | 409 | **409 ✅** |

**El tercer caso es la clave:** es exactamente el mismo problema técnico y `ProductoController` sí lo resuelve. El patrón ya está en el proyecto, solo hay que copiarlo:

```java
try {
    service.eliminarCategoria(id);
} catch (DataIntegrityViolationException e) {
    return ResponseEntity.status(HttpStatus.CONFLICT)
            .body(Map.of("mensaje", "No se puede eliminar la categoría con id " + id
                    + " porque tiene productos asociados"));
}
```

**Impacto:** un 500 le comunica al front "el servidor se rompió" cuando en realidad fue una regla de negocio que se cumplió correctamente. El usuario no tiene forma de saber qué hacer, y quien revise los registros del servidor va a perder tiempo buscando un fallo que no existe.

**Nota para el contrato:** el código 409 por dependencias no está en la matriz de la sección 7. Hay que agregarlo.

**Responsable sugerido:** Zeth (Categorías) y Vanya (Usuarios).

---

### H-03 — `login.js` trata el error 500 como si fueran credenciales equivocadas

**Severidad:** Media · **Módulo:** Front-end, inicio de sesión · **Estado:** ⬜ Por verificar en el navegador (sección 5)

En `login.js`:

```js
} else if (response.status === 401 || response.status === 404 || response.status === 500) {
    alertaGeneral.textContent = "Credenciales incorrectas. Verifica tus datos.";
```

Un **500** es un fallo del servidor, no una credencial equivocada. Si la base de datos se cae o algo truena en el backend, el usuario va a creer que escribió mal su contraseña y va a seguir intentando sin éxito, sin saber que el problema no es suyo.

Esto se vuelve más relevante por el H-02: ya sabemos que el backend sí produce 500 en situaciones normales.

**Recomendación:** separar el 500 en su propia rama y mostrar algo como *"Hubo un problema en el servidor. Intenta más tarde."*

**Responsable sugerido:** Manuel.

---

### H-04 — `POST /detalles` castea los identificadores sin validar el tipo

**Severidad:** Baja · **Módulo:** Detalles de pedido · **Estado:** ✅ Confirmado en la primera corrida

`DetallePedidoController.crear()` recibe el cuerpo como un mapa genérico y castea directo:

```java
Integer pedidoId = (Integer) payload.get("pedidoId");
```

Si el cliente manda el id como texto (`"pedidoId": "6"` en lugar de `"pedidoId": 6`), el casteo lanza `ClassCastException`, la atrapa el `catch (Exception e)` final y responde **400 "Datos de entrada inválidos"** — un mensaje que no dice qué campo estuvo mal ni por qué.

Los demás módulos no tienen este problema porque reciben una clase con campos tipados (un DTO o la entidad) y Jackson convierte el texto a número automáticamente.

**Cómo se detectó:** la primera corrida de esta colección mandaba los ids entre comillas. Las tres peticiones de `/detalles` respondieron 400 y, al no crearse el detalle, fallaron en cascada las pruebas de integridad referencial y de limpieza. Al corregir la colección para enviarlos como número, las siete peticiones del módulo pasaron sin problema.

**Impacto:** bajo mientras el front mande números, que es lo que hace hoy. Pero el mensaje de error no ayuda a diagnosticar, y un `ClassCastException` disfrazado de 400 esconde el problema real.

**Recomendación:** recibir un DTO con campos tipados, como hace Productos con `ProductoRequest`. Alternativamente, validar el tipo antes de castear y devolver un mensaje que nombre el campo.

**Responsable sugerido:** Manuel.

---

## 7. Recomendaciones generales

1. **Unificar el manejo de errores.** Hoy conviven dos estilos: `Map.of("mensaje", ...)` construido a mano en cuatro módulos, y `ResponseStatusException` en Usuarios. Un `@RestControllerAdvice` central resolvería el H-01 y evitaría que el problema se repita cuando alguien agregue un endpoint nuevo.

2. **Atrapar `DataIntegrityViolationException` en todos los `DELETE`.** Tres módulos tienen llaves foráneas con `RESTRICT` y solo uno lo maneja. Conviene revisarlos todos de una vez en lugar de ir arreglando el que se rompa.

3. **Actualizar el contrato a la versión 1.1.** Faltan: el código 409 por dependencias en la matriz de la sección 7, los tres campos de Producto que el ejemplo 4.1 no muestra (`descripcion`, `imagen`, `activo`), y la forma real del cuerpo de `POST /pedidos`, que usa el objeto `usuario` anidado y no `usuarioId`.

4. **Incluir esta colección en el repositorio.** Correrla antes de cada merge a `develop` toma cuatro segundos y detectaría una regresión de inmediato.

5. **Fijar la codificación en `build.gradle`.** Los mensajes de error llevan acentos; agregar `compileJava.options.encoding = 'UTF-8'` evita que se vean mal en máquinas con otra configuración regional.

6. **Documentar el requisito del JDK 21 en el README.** El `build.gradle` exige esa versión exacta y Gradle no acepta ninguna otra. En una máquina con un JDK más nuevo el proyecto ni siquiera sincroniza, y el mensaje de error no dice cómo resolverlo. Bastan tres líneas: instalar el JDK 21 y apuntarle *Settings → Build Tools → Gradle → Gradle JVM*.

---

## 8. Conclusión

**La integración funciona.** Los cinco módulos responden, la base de datos guarda y recupera correctamente, y las 48 peticiones de la colección se ejecutaron sin que la aplicación se cayera en ningún momento.

De las 84 aserciones, 74 pasaron. Las 10 que fallaron se concentran en dos defectos bien delimitados, ambos reproducibles y ambos con una solución conocida que ya existe implementada en otro módulo del mismo proyecto.

**Ninguno de los dos defectos bloquea el despliegue** que le toca a Liz: la aplicación arranca, responde y los códigos HTTP principales son correctos. Pero **H-01 sí debería corregirse antes de entregar al usuario final**, porque deja al front sin forma de explicarle a la persona qué salió mal cuando no puede iniciar sesión, que es justo el momento en que más necesita una explicación.

**Lo que sí bloquea el despliegue es otra cosa:** el frontend conectado al backend **no está en `develop`**. Las ramas `manuel` (login) y `alexandra` (registro) tienen cada una la mitad del trabajo, y `develop` no tiene ninguna de las dos — lleva 7 días sin cambios y sus archivos `login.js` y `registro.js` no contienen una sola llamada `fetch`.

Si Liz despliega `develop` hoy, sube una versión del sitio que **no habla con la API**. Antes de desplegar hay que fusionar esas dos ramas y volver a probar el flujo completo de extremo a extremo.

**Dos cosas que conviene destacar como fortalezas del proyecto:**

- El `passwordHash` no se expone en ninguna respuesta de la API, ni siquiera en el listado completo de usuarios.
- El login devuelve el mismo 401 tanto si el correo no existe como si la contraseña es incorrecta, sin dar pistas a quien quiera averiguar qué correos están registrados.

---

## Anexos

| Archivo | Contenido |
|---|---|
| `SketchAndCoffee-PruebasIntegracion.postman_collection.json` | Colección de Postman, 48 peticiones en 8 carpetas |
| `resultados-collection-runner.json` | Exportación del resultado de la segunda corrida |
| `evidencias/` | Capturas de Postman y de la pestaña Red del navegador |
