package com.sketchandcoffee.project.controlador;

import com.sketchandcoffee.project.dtos.ProductoRequest;
import com.sketchandcoffee.project.modelo.Producto;
import com.sketchandcoffee.project.servicio.ProductoService;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Endpoints REST de productos — seccion 4 del contrato de la Actividad 13.
 *
 *   GET    /sketchcoffee/productos                  200
 *   GET    /sketchcoffee/productos/{id}             200 | 404
 *   GET    /sketchcoffee/productos/categoria/{id}   200 | 404
 *   POST   /sketchcoffee/productos                  201 | 400 | 404 | 409
 *   PUT    /sketchcoffee/productos/{id}             200 | 400 | 404 | 409
 *   DELETE /sketchcoffee/productos/{id}             204 | 404 | 409
 *
 * El controlador no decide nada: pregunta al servicio y traduce la
 * respuesta a un codigo HTTP. Toda validacion vive en ProductoService.
 *
 * Responsable: Gonzalo Vargas — Actividad 13
 */
@RestController
@RequestMapping("/sketchcoffee/productos")
@CrossOrigin(origins = "*") // Para Postman y para el frontend
public class ProductoController {

    private final ProductoService service;

    public ProductoController(ProductoService service) {
        this.service = service;
    }// constructor

    // ------------------------------------------------------------------

    @GetMapping
    public ResponseEntity<List<Producto>> listarProductos() {
        return ResponseEntity.ok(service.listarProductos());
    }// GET todos los productos

    @GetMapping("/{id}")
    public ResponseEntity<?> porId(@PathVariable Integer id) {
        Optional<Producto> productoOpt = service.buscarPorId(id);
        if (productoOpt.isPresent()) {
            return ResponseEntity.ok(productoOpt.get());
        }// if
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("mensaje", "Producto con id " + id + " no encontrado"));
    }// GET por id

    /**
     * Productos de una categoria.
     *
     * Si la categoria no existe responde 404 y no una lista vacia: no es lo
     * mismo "esa categoria no existe" que "esa categoria no tiene productos
     * todavia", y el frontend necesita distinguirlos.
     */
    @GetMapping("/categoria/{id}")
    public ResponseEntity<?> porCategoria(@PathVariable Integer id) {
        if (!service.existeCategoria(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("mensaje", "Categoría con id " + id + " no encontrada"));
        }// if
        return ResponseEntity.ok(service.listarPorCategoria(id));
    }// GET por categoría

    // ------------------------------------------------------------------

    @PostMapping
    public ResponseEntity<?> crear(@RequestBody ProductoRequest datos) {

        // 400: campos obligatorios, longitudes y rangos
        Optional<String> error = service.validar(datos);
        if (error.isPresent()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("mensaje", error.get()));
        }// if

        // 404: la llave foránea apunta a una categoría que no existe
        if (!service.existeCategoria(datos.getCategoriaId())) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("mensaje", "Categoría con id " + datos.getCategoriaId() + " no encontrada"));
        }// if

        // 409: el SKU es UNIQUE en la tabla
        if (service.existeSku(datos.getSku())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("mensaje", "Ya existe un producto con el SKU " + datos.getSku().trim()));
        }// if

        Producto guardado = service.guardarProducto(datos);
        return ResponseEntity.status(HttpStatus.CREATED).body(guardado);
    }// POST

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Integer id,
                                        @RequestBody ProductoRequest cambios) {

        Optional<Producto> existenteOpt = service.buscarPorId(id);
        if (existenteOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("mensaje", "Producto con id " + id + " no encontrado"));
        }// if

        Optional<String> error = service.validar(cambios);
        if (error.isPresent()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("mensaje", error.get()));
        }// if

        if (!service.existeCategoria(cambios.getCategoriaId())) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("mensaje", "Categoría con id " + cambios.getCategoriaId() + " no encontrada"));
        }// if

        Producto existente = existenteOpt.get();

        // Solo se revisa el duplicado si de verdad esta cambiando el SKU.
        // Si no, guardar el mismo producto con su propio SKU daria un 409
        // falso contra si mismo.
        boolean cambiaSku = !existente.getSku().equalsIgnoreCase(cambios.getSku().trim());
        if (cambiaSku && service.existeSku(cambios.getSku())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("mensaje", "Ya existe un producto con el SKU " + cambios.getSku().trim()));
        }// if

        return ResponseEntity.ok(service.actualizarProducto(existente, cambios));
    }// PUT

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Integer id) {

        if (service.buscarPorId(id).isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("mensaje", "Producto con id " + id + " no encontrado"));
        }// if

        try {
            service.eliminarProducto(id);
        } catch (DataIntegrityViolationException e) {
            // La tabla detalle_pedido apunta a productos con ON DELETE
            // RESTRICT: si el producto ya aparece en un pedido, MySQL no
            // deja borrarlo. Sin este catch saldria un 500; un 409 explica
            // el motivo real.
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("mensaje", "No se puede eliminar el producto con id " + id
                            + " porque esta referenciado en uno o mas pedidos"));
        }// try

        return ResponseEntity.noContent().build();
    }// DELETE

}// class ProductoController
