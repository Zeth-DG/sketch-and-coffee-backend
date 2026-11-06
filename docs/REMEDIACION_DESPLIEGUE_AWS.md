# Reporte de remediación del despliegue AWS — Sketch & Coffee

**Fecha:** 6 de noviembre de 2026
**Síntomas iniciales:** el catálogo no cargaba productos y el panel de administración era inaccesible.
**Resultado final:** ambos síntomas resueltos; además se agregó edición de productos y subida de imágenes desde el panel. Despliegue verificado en producción (`http://100.53.178.44`).

---

## 1. Diagnóstico (causas raíz de los síntomas)

| # | Problema | Causa raíz | Evidencia |
|---|---|---|---|
| 1 | El catálogo no cargaba | `menu-productos.js` pedía `http://localhost:8080/...` — en el navegador de cada visitante apuntaba a su propia máquina | Error `ERR_CONNECTION_REFUSED` en consola |
| 2 | (falso problema) Base de datos vacía | El backend respondía `[]`, no por nombre de BD equivocado sino **sin datos sembrados** en `sketchcoffee` | `curl /sketchcoffee/productos` → `[]` con backend vivo |
| 3 | Panel de administración inalcanzable | El frontend comparaba `rol === "administrador"` y la BD guarda el ENUM como `'admin'` | `login.js:160`, `header.js:83`, `agregar-producto.js:18` |
| 4 | Login de admin crasheaba | Los usuarios sembrados tenían `password_hash NULL` → `.equals()` sobre null lanzaba NPE → 500 | `UsuarioService.login() línea 138` |
| 5 | "Agregar productos" no los guardaba | El panel solo escribía en `localStorage`; nunca llamaba al API (`POST /sketchcoffee/productos` existía pero estaba desconectado) | Revisión de `agregar-producto.js` original |

## 2. Cambios realizados

### Backend (`Zeth-DG/sketch-and-coffee-backend`, rama `develop`)

**Commit `2e82372` — Remediar despliegue AWS**

| Archivo | Cambio |
|---|---|
| `static/js/menu-productos.js` | Fetch con **ruta relativa** `/sketchcoffee/productos` (funciona igual en local y detrás de nginx en AWS). Imagen de la BD con **prioridad** sobre las hardcodeadas; fallback a un arte que existe (`imagenes/cafeteria/Sketch&Coffee_cuadro1.png`) en lugar de `./img/default.jpg` que nunca existió (ese era el 404 de imágenes) |
| `static/js/login.js` | Redirección al panel cuando `rol === "admin"` (más `toLowerCase()`, tolerante a mayúsculas) |
| `static/js/header.js` | Enlace "Panel Admin" visible con `rol === "admin"` |
| `static/js/agregar-producto.js` | Panel **conectado a la API real**: listar (GET), crear (POST), editar (PUT) y borrar (DELETE, con manejo del 409 "productos en pedidos"); categorías cargadas de `GET /sketchcoffee/categorias` con fallback a los ids del seed; subida de imágenes multipart; **modo edición** que conserva `sku`, `imagen`, `existencias` y `activo` (los PUT del backend los sobre-escriben si no llegan) |
| `controlador/ImagenController.java` | **Nuevo** — `POST /sketchcoffee/imagenes`: multipart, whitelist jpg/jpeg/png/webp/gif, nombre UUID (evita path traversal), guarda en `app.imagenes.ruta` (fuera del jar, configurable con `PROD_IMAGENES`), responde `{"archivo","ruta":"subidas/..."}` |
| `configuracion/ConfiguracionSubidas.java` | **Nuevo** — resource handler `/subidas/**` → carpeta en disco. Prefijo `subidas/` delibera­do: `/imagenes/**` ya lo resuelve el classpath del jar y no se debe tapar |
| `application.properties` | `app.imagenes.ruta=${PROD_IMAGENES:./imagenes-publicadas}` + límites de multipart (con nota: el cap front de 1 MB mantiene consistencia aunque la key cambie de nombre en Spring Boot 4) |
| `.gitignore` | `/imagenes-publicadas/` (artefactos de dev) |

> `application.properties` estaba ya trackeado (placeholders `${PROD_DB_*}` sin secretos, seguro). La pem **no** va al repo: `docs/despliegue/` está en `.gitignore`.

**Commit `469d131` — Corregir `categoriaId` no definido**

- El refactor del submit perdió la declaración `const categoriaId = idDeCategoria(categoria)` mientras el cuerpo del POST/PUT la seguía usando → `ReferenceError` abortando todo guardado.
- Restaurada y movida **antes** de la subida de imagen (no se sube foto si el guardado va a fallar por categoría inexistente).

### Frontend (`Zeth-DG/sketch-and-coffee-frontend`, rama `zeth`)

| Commit | Contenido |
|---|---|
| `a63e68f` | Trabajo propio pendiente: README, .gitignore, GUION-EXPOSICION-FINAL.txt |
| `cd98fb6` | Sincronización de los **5 archivos corregidos** (copias exactas de `back-end/static/`): `js/menu-productos.js`, `js/login.js`, `js/header.js`, `js/agregar-producto.js`, `creacion_de_producto.html` |
| `97f5148` | Mismo fix del `categoriaId` sincronizado |

### Base de datos (en el EC2, aplicado directamente en MariaDB)

```sql
-- Seed mínimo en sketchcoffee (solo DML; el DDL ya lo creaba Hibernate con PROD_DDL=update):
INSERT INTO categorias ... -- 5 categorías con ids 1–5
INSERT INTO productos  ... -- 5 productos con sus skus del script de la tablet

-- Administrador sin password_hash tenía NPE en login:
UPDATE usuarios SET password_hash='…' WHERE rol='admin';  -- contraseñaelegida ≥6 caracteres
```

### Archivos de imágenes correctas puestos en la BD

```sql
UPDATE productos SET imagen='imagenes/alimentos-menu/capuchino.jpeg' WHERE sku='520015364';
UPDATE productos SET imagen='imagenes/alimentos-menu/chai-latte.jpeg'  WHERE sku='1052001536134';
UPDATE productos SET imagen='imagenes/alimentos-menu/chilaquiles.jpeg' WHERE sku='1052001536174';
UPDATE productos SET imagen='imagenes/alimentos-menu/cafepayn.jpg'     WHERE sku='1052001536165';
UPDATE productos SET imagen='imagenes/cafeteria/Sketch&Coffee_cuadro1.png' WHERE sku='52001536118';
```

Con la nueva prioridad "imagen de la BD manda", cuando el admin suba de verdad la foto del panel, será ella la que se muestre (p. ej., por fin haber una foto real de panqué de limón).

## 3. Procedimiento de depliegue aplicado

```powershell
# 1. Compilar
cd back-end
.\gradlew.bat bootJar
Copy-Item "build\libs\*.jar" ".\app.jar" -Force

# 2. Subir (la pem está en docs\despliegue\AWS\)
scp -i aws.sketchcoffee.pem app.jar ubuntu@100.53.178.44:app.jar
```

```bash
# 3. En el servidor:
sudo service ecommerce stop          # nunca reemplazar en caliente
mv ~/app.jar ~/src/app.jar
sudo service ecommerce start
sudo service ecommerce status        # esperar ● active (running)
sudo journalctl -u ecommerce.service -n 50 --no-pager   # si no arranca

# Ajustes en /etc/systemd/system/ecommerce.service ([Service]):
#   WorkingDirectory=/home/ubuntu     <- el default de systemd es "/" y ahí ubuntu no puede crear carpetas
#   Environment="PROD_IMAGENES=/home/ubuntu/imagenes-publicadas"
# tras editar: sudo systemctl daemon-reload

# 4. Smoke tests:
curl -s http://localhost:8080/sketchcoffee/productos | head -c 200   # → JSON con productos
curl -s http://localhost:8080/js/agregar-producto.js | grep "const categoriaId"  # → se ve el fix
```

## 4. Verificación de producción (evidencia)

| Prueba | Resultado |
|---|---|
| `curl http://100.53.178.44/sketchcoffee/productos` desde fuera | ✅ `200` con los 5 productos |
| `grep const categoriaId` en el JS servido por nginx | ✅ línea 366 presente — jar nuevo desplegado |
| Login admin por API | ✅ `200` con `rol:"admin"` y sin `passwordHash` expuesto |
| Catálogo en navegador | ✅ 5 productos, sin errores de consola |
| Filtros por categoría | ✅ funcionan |
| Login admin → panel | ✅ redirige a `creacion_de_producto.html` |
| Enlace "Panel Admin" en header | ✅ visible |
| Publicar productos desde el panel | ✅ (tras fix `469d131`) con categoría seleccionada, mensaje verde con SKU |
| Subir imagen por API (`curl -F archivo=@foto.jpg .../imagenes`) | ⚠️ Tras deploy pendiente de verificar con `WorkingDirectory`/`PROD_IMAGENES` fijados |

## 5. Lista de deuda técnica (para cuando el proyecto salga de ser demo)

1. **Autenticación real en el backend** — no hay Spring Security; los endpoints de admin y la subida de imágenes son abiertos (`@CrossOrigin(origins="*")`). La "sesión" es solo `localStorage` del navegador, jugador de curl.
2. **HTTPS** — nginx solo escucha puerto 80; contraseñas viajan en texto plano.
3. **BCrypt** — la contraseña se guarda cruda en `password_hash` (así vivimos la prueba del login): al migrar, los usuarios sembrados y el admin compartían la misma clave `Admin2026*`, que hay que personalizar.
4. **Cleanup del script SQL** — `base_datos.sql` hace `DROP DATABASE`, tiene usuarios demo con claves `NULL` (el NPE original) y convive dentro de `static/` (se sirve como recurso del jar).
5. **Usuarios de prueba de la BD** — `admin@ejemplo.com`, `admin.prueba@`, `admin2.prueba@` recibieron `Admin2026*` por el `UPDATE WHERE rol='admin'`; habiendo más de un admin los puestos pueden confundirse a la hora de probar el login.
6. **Property multipart** — confirmar el nombre exacto de `spring.servlet.multipart.max-file-size` en Spring Boot 4; hoy el cap de 1 MB del frontend hace la función pero bloquea las imágenes grandes.
7. **SKU** autogenerado (`SC-<millis>`) — agregar campo al formulario (≈15 min de trabajo).
8. **Rotación de llave SSH y credenciales de BD** — aunque el repo no tiene la pem ya trackeada, la credencial `Pa$$w0rd` queda en los comandos del despliegue; rotar si se extiende la vida útil en AWS.
9. **Límite de subida** — el tope real vive en el cap de 1 MB del frontend (el default de multipart); el check de 5 MB del controlador solo aplica cuando la key de configuración de Spring Boot 4 esté confirmada.

---

Documentación relacionada: `docs/despliegue/AWS/comandos_despliegue.txt`

_Generado con los cambios de la sesión de remediación del 2026-11-06._
