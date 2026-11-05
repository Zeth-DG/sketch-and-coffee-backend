package com.sketchandcoffee.project.controlador;

import com.sketchandcoffee.project.modelo.DetallePedido;
import com.sketchandcoffee.project.servicio.DetallePedidoService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/sketchcoffee/detalles")
public class DetallePedidoController {

    @Autowired
    private DetallePedidoService detallePedidoService;

    @GetMapping
    public ResponseEntity<List<DetallePedido>> listarTodos() {
        return ResponseEntity.ok(detallePedidoService.listarTodos());
    }// listarTodos

    @GetMapping("/{id}")
    public ResponseEntity<?> buscarPorId(@PathVariable Integer id) {
        return detallePedidoService.buscarPorId(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("mensaje", "Detalle con id " + id + " no encontrado")));
    }// buscarPorId

    @GetMapping("/pedido/{id}")
    public ResponseEntity<?> buscarPorPedidoId(@PathVariable Integer id) {
        try {
            List<DetallePedido> detalles = detallePedidoService.buscarPorPedidoId(id);
            return ResponseEntity.ok(detalles);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("mensaje", e.getMessage()));
        }// catch

    }//buscarPedidoPorId

    @PostMapping
    public ResponseEntity<?> crear(@RequestBody Map<String, Object> payload) {
        try {
            Integer pedidoId = (Integer) payload.get("pedidoId");
            Integer productoId = (Integer) payload.get("productoId");
            Integer cantidad = (Integer) payload.get("cantidad");
            BigDecimal precioUnitario = new BigDecimal(payload.get("precioUnitario").toString());

            DetallePedido nuevoDetalle = detallePedidoService.guardar(pedidoId, productoId, cantidad, precioUnitario);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevoDetalle);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("mensaje", e.getMessage()));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("mensaje", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("mensaje", "Datos de entrada inválidos"));
        }// catch

    }// crear

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Integer id, @RequestBody Map<String, Object> payload) {
        try {
            Integer cantidad = payload.get("cantidad") != null ? (Integer) payload.get("cantidad") : null;
            BigDecimal precioUnitario = payload.get("precioUnitario") != null ? new BigDecimal(payload.get("precioUnitario").toString()) : null;

            DetallePedido actualizado = detallePedidoService.actualizar(id, cantidad, precioUnitario);
            return ResponseEntity.ok(actualizado);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("mensaje", e.getMessage()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("mensaje", e.getMessage()));
        }//catch

    }//actualizar

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Integer id) {
        try {
            detallePedidoService.eliminar(id);
            return ResponseEntity.noContent().build(); // Código 204 No Content
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("mensaje", e.getMessage()));
        }//catch

    }// eliminar

}// DetallePedidoController