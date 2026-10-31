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
    public ResponseEntity<?> porId(@PathVariable Integer id) {
        Optional<Categoria> categoriaOpt = service.buscarPorId(id);
        if (categoriaOpt.isPresent()) {
            return ResponseEntity.ok(categoriaOpt.get());
        }//if
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("mensaje", "Categoría con id " + id + " no encontrada"));
    }//GET por id

    @PostMapping
    public ResponseEntity<?> crear(@RequestBody Categoria categoria) {
        if (categoria.getNombre() == null || categoria.getNombre().isBlank()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("mensaje", "El campo nombre es obligatorio"));
        }//if
        if (service.existeNombre(categoria.getNombre())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("mensaje", "Ya existe una categoría con el nombre " + categoria.getNombre()));
        }//if
        Categoria guardada = service.guardarCategoria(categoria);
        return ResponseEntity.status(HttpStatus.CREATED).body(guardada);
    }//POST

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarCategoria(@PathVariable Integer id, @RequestBody Categoria cambios) {
        Optional<Categoria> existenteOpt = service.buscarPorId(id);
        if(existenteOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("mensaje", "Categoria con id " + id + " no encontrada"));
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
    public ResponseEntity<?> eliminar(@PathVariable Integer id) {
        if (service.buscarPorId(id).isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("mensaje", "Categoria con id " + id + " no encontrada"));
        }//if
        service.eliminarCategoria(id);
        return ResponseEntity.noContent().build();
    }//DELETE

}//class
