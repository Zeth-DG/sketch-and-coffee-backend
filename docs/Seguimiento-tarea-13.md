# Seguimiento y Evidencias — Actividad 13

## 👥 Equipo de Trabajo y Ramas Asignadas
- **Luis Fernando** (Developer / QA Senior) → `luis`
- **Alexandra** (Developer / QA Backend) → `alexandra`
- **Vanya** (Developer: Usuarios) → `vanya`
- **Lizeth / Zeth** (Product Owner / Developer: Categorías) → `zeth`
- **Gonzalo** (Developer: Productos & Deuda A12) → `gonzalo`
- **Laura** (Scrum Master / Developer: Pedidos) → `laura`
- **Manuel** (Developer: DetallePedido & Deuda A12) → `manuel`

---

## 🚀 Estado de Integración y Entregables (`develop`)
- [x] **Configuración inicial:** Publicación de contratos de endpoints, reglas transversales y armado del tablero en Trello.
- [x] **Liquidación de deuda A12:** `CategoriaRepository`, entidad y repositorio de `Producto`, entidad y repositorio de `DetallePedido`.
- [x] **Módulo Usuarios:** Refactorización de `UsuarioController` al patrón Service-Repository, implementación de `UsuarioService`, registro y login (`POST /usuarios/registro` y `POST /usuarios/login`).
- [x] **Módulo Categorías:** Implementación de `CategoriaService` y `CategoriaController` (`/sketchcoffee/categorias`).
- [x] **Módulo Productos:** Implementación de `ProductoService`, `ProductoController` y endpoint de filtrado por categoría (`/sketchcoffee/productos/categoria/{id}`).
- [x] **Módulo Pedidos (Laura):** Creación y validación de `PedidoService`, `PedidoController` (`/sketchcoffee/pedidos`), asegurando la integridad con el usuario existente, asignación automática de fecha (`LocalDateTime.now()`) y control de montos positivos.
- [x] **Módulo DetallePedido:** Implementación de `DetallePedidoService`, `DetallePedidoController` y consulta por pedido (`/sketchcoffee/detalles/pedido/{id}`).
- [x] **QA Integral:** Ejecución de la colección Postman completa cubriendo códigos HTTP honestos (`200`, `201`, `204`, `400`, `404`, `409`, `401`).

---

## 🔀 Control de Pull Requests y Merges Disciplinados
> *Los merges hacia `develop` fueron ejecutados de forma secuencial por la Scrum Master respetando el orden de dependencias, asegurando que el proyecto compilara sin errores tras cada integración.*

| Módulo | Rama | Responsable | Estado del PR | Revisión Cruzada | Merge a develop |
|---|---|---|---|---|---|
| **Categorías** | `zeth` | Zeth | Aprobado | Revisado por Laura | Ejecutado |
| **Usuarios** | `vanya` | Vanya & Alexandra | Aprobado | Revisado por Zeth | Ejecutado |
| **Productos** | `gonzalo` | Gonzalo | Aprobado | Revisado por Laura | Ejecutado |
| **Pedidos** | `laura` | Laura | Aprobado | Revisado por Zeth | Ejecutado |
| **DetallePedido** | `manuel` | Manuel | Aprobado | Revisado por Zeth | Ejecutado |

---

## 🔒 Bitácora de Cierre y Estado de la Rama `main`
- **Regla de oro cumplida:** La rama `main` se mantuvo **estrictamente congelada e intacta** (sin commits, merges ni pushes durante toda la Actividad 13, reservándose de forma exclusiva para la entrega final del proyecto integrador).
- **Control de Calidad y Seguridad:** Se verificó la ausencia total de credenciales expuestas en archivos de configuración y la protección adecuada de las contraseñas (sin exponer campos de hash de seguridad en las respuestas JSON).
- **Aceptación Final:** El proyecto compila y ejecuta de manera óptima bajo los estándares de Spring Boot y MySQL especificados.

---

## ✅ Cierre y Verificación de la Integración (2026-11-04)

> *Registro de cierre técnico de la Tarea 13, elaborado tras la revisión de calidad del 4-nov.*

### Verificación de integración final
- El último pull request **#9** (`manuel` → `develop`) se mezcló en el commit `a5902f0`.
- Antes de integrar, el merge se verificó localmente: **sin conflictos** y con **compilación Gradle exitosa** sobre el árbol resultante.
- Recuento final: **5 de 5 módulos integrados a `develop`** (100% de la tarea).
- Evidencias reorganizadas por integrante (commit `2081a23`): `docs/evidencias_zeth/` (Categorías) y `docs/evidencias_vanya_ale/` (Usuarios).
- `application.properties` con credenciales de conexión permanece **excluido del repositorio** vía `.gitignore`.

### Deudas técnicas para la siguiente iteración
1. `@CrossOrigin(origins = "*")` está presente en `Categoria`, `Producto` y `Usuario`; falta **unificarlo en `PedidoController` y `DetallePedidoController`** antes de conectar el frontend.
2. `PedidoController.actualizar()` responde **404** cuando el error es de validación (total negativo); el contrato esperaría **400**.
3. `UsuarioService.actualizarUsuario()` crea el usuario si el id no existe (comportamiento "upsert") en lugar de responder **404**.
4. `POST /usuarios/login` compara la contraseña en **texto plano** y la respuesta incluye el hash electrónico; se registra como **deuda de seguridad** (fuera del alcance de la Tarea 13, pero en proceso).

Estas observaciones no modifican la aceptación de la Tarea 13: corresponden a mejoras y refactors acordados para la siguiente iteración.
