package com.sketchandcoffee.project.controlador;

import com.sketchandcoffee.project.modelo.Categoria;
import com.sketchandcoffee.project.servicio.CategoriaService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/sketchcoffee/categorias")
@CrossOrigin(origins = "*") // Para postman
public class CategoriaController {
    private final CategoriaService service;

    public CategoriaController(CategoriaService service) {
        this.service = service;
    }//constructor

    @GetMapping
    public ResponseEntity<List<Categoria>> listarCategorias() {
        return ResponseEntity.ok(service.listarCategorias());
    }//GET todas las categorías

    @GetMapping("/{id}")
    public ResponseEntity<Categoria> porId(@PathVariable Integer id) {
        return service.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }//GET por id

    @PostMapping
    public ResponseEntity<?> crear(@RequestBody Categoria categoria) {
        if (categoria.getNombre() == null || categoria.getNombre().isBlank()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("mensaeje", "El campo nombre es obligatorio"));
        }//if
        if (service.existeNombre(categoria.getNombre())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("mensaje", "Ya existe un categoría con el nombre" + categoria.getNombre()));
        }//if
        Categoria guardada = service.guardarCategoria(categoria);
        return ResponseEntity.status(HttpStatus.CREATED).body(guardada);
    }//POST

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarCategoria(@PathVariable Integer id, @RequestBody Categoria cambios) {
        Optional<Categoria> existenteOpt = service.buscarPorId(id);
        if(existenteOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }//if
        Categoria existente = existenteOpt.get();
        boolean cambiarNombre = !existente.getNombre().equalsIgnoreCase(cambios.getNombre());
        if (cambiarNombre && service.existeNombre(cambios.getNombre())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("mensaje", "Ya existe una categoría con el nombre " + cambios.getNombre()));
        }//if
        return ResponseEntity.ok(service.actualizaCategoria(existente,cambios));
    }//PUT

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        if (service.buscarPorId(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }//if
        service.eliminarCategoria(id);
        return ResponseEntity.noContent().build();
    }//DELETE

}//class
