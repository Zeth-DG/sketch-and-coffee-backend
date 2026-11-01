package com.sketchandcoffee.project.controlador;

import com.sketchandcoffee.project.modelo.Pedido;
import com.sketchandcoffee.project.servicio.PedidoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/sketchcoffee/pedidos")
public class PedidoController {

    @Autowired
    private PedidoService pedidoService;

    @GetMapping
    public ResponseEntity<List<Pedido>> listarTodos() {
        List<Pedido> pedidos = pedidoService.listarTodos();
        return ResponseEntity.ok(pedidos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> buscarPorId(@PathVariable Integer id) {
        Optional<Pedido> pedido = pedidoService.buscarPorId(id);
        if (pedido.isPresent()) {
            return ResponseEntity.ok(pedido.get());
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Collections.singletonMap("mensaje", "Pedido con id " + id + " no encontrado"));
    }

    @PostMapping
    public ResponseEntity<?> guardar(@RequestBody Pedido pedido) {
        try {
            Pedido nuevoPedido = pedidoService.guardar(pedido);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevoPedido);
        } catch (RuntimeException e) {
            if (e.getMessage() != null && e.getMessage().contains("no encontrado")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Collections.singletonMap("mensaje", e.getMessage()));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Collections.singletonMap("mensaje", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Integer id, @RequestBody Pedido pedidoDetalles) {
        try {
            Pedido pedidoActualizado = pedidoService.actualizar(id, pedidoDetalles);
            return ResponseEntity.ok(pedidoActualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Collections.singletonMap("mensaje", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Integer id) {
        boolean eliminado = pedidoService.eliminar(id);
        if (eliminado) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Collections.singletonMap("mensaje", "Pedido con id " + id + " no encontrado"));
    }
}
