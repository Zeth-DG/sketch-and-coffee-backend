-- ============================================================================
-- Proyecto:   Sketch & Coffee
-- Entregable: Script unificado DDL + DML
-- Fecha:      2026-10-23
-- Probado en: base limpia (DROP DATABASE al inicio) — 27/27 sentencias OK
-- ============================================================================

SET NAMES utf8mb4;

-- ----------------------------------------------------------------------------
-- 0. Limpieza total para prueba en base limpia
-- ----------------------------------------------------------------------------
SET FOREIGN_KEY_CHECKS = 0;
DROP DATABASE IF EXISTS sketch_coffee;
SET FOREIGN_KEY_CHECKS = 1;

CREATE DATABASE sketch_coffee
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE sketch_coffee;

-- ----------------------------------------------------------------------------
-- 1. DDL — Tablas en orden de dependencias
-- ----------------------------------------------------------------------------
CREATE TABLE categorias (
  id          INT          NOT NULL AUTO_INCREMENT,
  nombre      VARCHAR(50)  NOT NULL,
  descripcion VARCHAR(255) NULL,
  PRIMARY KEY (id),
  CONSTRAINT uq_categorias_nombre UNIQUE (nombre)
)
ENGINE = InnoDB
DEFAULT CHARSET = utf8mb4
COLLATE = utf8mb4_unicode_ci;

CREATE TABLE usuarios (
  id            INT          NOT NULL AUTO_INCREMENT,
  nombre        VARCHAR(50)  NOT NULL,
  apellido      VARCHAR(50)  NOT NULL,
  telefono      VARCHAR(20)  NULL,
  correo        VARCHAR(100) NOT NULL,
  rol           ENUM('cliente','admin') NOT NULL DEFAULT 'cliente',
  activo        BOOLEAN      NOT NULL DEFAULT TRUE,
  password_hash VARCHAR(255) NULL,
  PRIMARY KEY (id),
  CONSTRAINT uq_usuarios_correo UNIQUE (correo)
)
ENGINE = InnoDB
DEFAULT CHARSET = utf8mb4
COLLATE = utf8mb4_unicode_ci;

CREATE TABLE productos (
  id           INT           NOT NULL AUTO_INCREMENT,
  categoria_id INT           NOT NULL,
  sku          VARCHAR(30)   NOT NULL,
  nombre       VARCHAR(100)  NOT NULL,
  descripcion  TEXT          NULL,
  precio       DECIMAL(10,2) NOT NULL,
  imagen       VARCHAR(255)  NULL,
  existencias  INT           NOT NULL DEFAULT 0,
  activo       BOOLEAN       NOT NULL DEFAULT TRUE,
  PRIMARY KEY (id),
  CONSTRAINT uq_productos_sku UNIQUE (sku),
  CONSTRAINT fk_productos_categoria
    FOREIGN KEY (categoria_id) REFERENCES categorias(id)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT chk_productos_precio      CHECK (precio >= 0),
  CONSTRAINT chk_productos_existencias CHECK (existencias >= 0)
)
ENGINE = InnoDB
DEFAULT CHARSET = utf8mb4
COLLATE = utf8mb4_unicode_ci;

CREATE INDEX idx_productos_categoria_activo ON productos (categoria_id, activo);

CREATE TABLE pedidos (
  id         INT           NOT NULL AUTO_INCREMENT,
  usuario_id INT           NOT NULL,
  fecha      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  estado     ENUM('pendiente','pagado','en_preparacion','entregado','cancelado')
             NOT NULL DEFAULT 'pendiente',
  total      DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  PRIMARY KEY (id),
  CONSTRAINT fk_pedidos_usuario
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT chk_pedidos_total CHECK (total >= 0)
)
ENGINE = InnoDB
DEFAULT CHARSET = utf8mb4
COLLATE = utf8mb4_unicode_ci;

CREATE TABLE detalles_pedido (
  id              INT           NOT NULL AUTO_INCREMENT,
  pedido_id       INT           NOT NULL,
  producto_id     INT           NOT NULL,
  cantidad        INT           NOT NULL,
  precio_unitario DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (id),
  CONSTRAINT fk_detalles_pedido
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_detalles_producto
    FOREIGN KEY (producto_id) REFERENCES productos(id)
    ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT uq_detalles_pedido_producto UNIQUE (pedido_id, producto_id),
  CONSTRAINT chk_detalles_cantidad CHECK (cantidad > 0),
  CONSTRAINT chk_detalles_precio   CHECK (precio_unitario >= 0)
)
ENGINE = InnoDB
DEFAULT CHARSET = utf8mb4
COLLATE = utf8mb4_unicode_ci;

-- ----------------------------------------------------------------------------
-- 2. DML — Datos de muestra (padres primero)
-- ----------------------------------------------------------------------------
START TRANSACTION;

INSERT INTO categorias (id, nombre, descripcion) VALUES
  (1, 'Bebidas frías',     'Frappés, sodas italianas, tisanas heladas y bubble tea.'),
  (2, 'Bebidas calientes', 'Cafés, tés y tisanas preparados al momento.'),
  (3, 'Postres',           'Panqués, flanes, gelatinas y panadería dulce.'),
  (4, 'Platillos',         'Molletes, chapatas, chilaquiles y alimentos salados.'),
  (5, 'Café en grano',     'Café de especialidad en bolsa, molido o en grano.');

INSERT INTO usuarios (id, nombre, apellido, telefono, correo, rol, activo, password_hash) VALUES
  (1, 'Ana',     'Ramírez',   '7641000001', 'ana.ramirez@ejemplo.com',      'cliente', TRUE,  NULL),
  (2, 'Carlos',  'Mendoza',   '7641000002', 'carlos.mendoza@ejemplo.com',   'cliente', TRUE,  NULL),
  (3, 'Daniela', 'Ortiz',     '7641000003', 'daniela.ortiz@ejemplo.com',    'cliente', TRUE,  NULL),
  (4, 'Miguel',  'Hernández', '7641000004', 'miguel.hernandez@ejemplo.com', 'cliente', FALSE, NULL),
  (5, 'Sketch',  'Admin',     '7641000005', 'admin@sketchandcoffee.mx',     'admin',   TRUE,  NULL);

INSERT INTO productos (id, categoria_id, sku, nombre, descripcion, precio, existencias, activo) VALUES
  (1, 2, '520015364',     'Capuchino caliente', 'Espresso con leche vaporizada y espuma cremosa.', 70.00, 40, TRUE),
  (2, 1, '1052001536134', 'Chai latte frío',    'Té chai con leche y hielo, con canela y cardamomo.', 80.00, 25, TRUE),
  (3, 3, '52001536118',   'Panqué de limón',    'Panqué casero de limón con glaseado.', 65.00, 12, TRUE),
  (4, 4, '1052001536174', 'Chilaquiles',        'Totopos bañados en salsa de la casa, con crema y queso.', 130.00, 18, TRUE),
  (5, 5, '1052001536165', 'Veracruz bolsa de café en grano', 'Café de altura de Veracruz, tostado medio, bolsa de 1 kg.', 320.00, 8, TRUE);

INSERT INTO pedidos (id, usuario_id, fecha, estado, total) VALUES
  (1, 1, '2026-10-20 09:15:00', 'entregado',      140.00),
  (2, 2, '2026-10-21 11:40:00', 'pagado',         320.00),
  (3, 3, '2026-10-22 16:05:00', 'en_preparacion', 130.00),
  (4, 1, '2026-10-23 08:30:00', 'pendiente',      160.00),
  (5, 4, '2026-10-23 10:00:00', 'cancelado',       65.00);

INSERT INTO detalles_pedido (id, pedido_id, producto_id, cantidad, precio_unitario) VALUES
  (1, 1, 1, 2,  70.00),
  (2, 2, 5, 1, 320.00),
  (3, 3, 4, 1, 130.00),
  (4, 4, 2, 2,  80.00),
  (5, 5, 3, 1,  65.00);

COMMIT;

-- ----------------------------------------------------------------------------
-- 3. Validación — debe devolver 5 filas por tabla y "OK" en cuadra
-- ----------------------------------------------------------------------------
SELECT 'categorias' AS tabla, COUNT(*) AS filas FROM categorias
UNION ALL SELECT 'usuarios',        COUNT(*) FROM usuarios
UNION ALL SELECT 'productos',       COUNT(*) FROM productos
UNION ALL SELECT 'pedidos',         COUNT(*) FROM pedidos
UNION ALL SELECT 'detalles_pedido', COUNT(*) FROM detalles_pedido;

SELECT * FROM categorias;
SELECT id, nombre, apellido, correo, rol, activo FROM usuarios;
SELECT * FROM productos;
SELECT * FROM pedidos;
SELECT * FROM detalles_pedido;

SELECT
  pe.id AS pedido,
  CONCAT(u.nombre, ' ', u.apellido) AS cliente,
  pr.nombre AS producto,
  c.nombre AS categoria,
  d.cantidad,
  d.precio_unitario,
  (d.cantidad * d.precio_unitario) AS importe,
  pe.estado
FROM detalles_pedido d
INNER JOIN pedidos    pe ON pe.id = d.pedido_id
INNER JOIN usuarios   u  ON u.id  = pe.usuario_id
INNER JOIN productos  pr ON pr.id = d.producto_id
INNER JOIN categorias c  ON c.id  = pr.categoria_id
ORDER BY pe.id, d.id;

SELECT
  pe.id AS pedido,
  pe.total AS total_guardado,
  SUM(d.cantidad * d.precio_unitario) AS suma_renglones,
  CASE WHEN pe.total = SUM(d.cantidad * d.precio_unitario)
       THEN 'OK' ELSE 'NO CUADRA' END AS cuadra
FROM pedidos pe
INNER JOIN detalles_pedido d ON d.pedido_id = pe.id
GROUP BY pe.id, pe.total
ORDER BY pe.id;
