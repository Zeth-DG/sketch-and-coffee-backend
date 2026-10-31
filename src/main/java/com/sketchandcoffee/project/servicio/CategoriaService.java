package com.sketchandcoffee.project.servicio;

import com.sketchandcoffee.project.modelo.Categoria;
import com.sketchandcoffee.project.repositorio.CategoriaRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CategoriaService {
    private final CategoriaRepository repository;

    public CategoriaService(CategoriaRepository repository) {
        this.repository = repository;
    }//constructor

    //public CategoriaService() {}//constructor vacío

    public List<Categoria> listarCategorias() {
        return repository.findAll();
    }//listarCategorias

    public Optional<Categoria> buscarPorId(Integer id) {
        return repository.findById(id);
    }//buscarPorId

    public Categoria guardarCategoria(Categoria categoria) {
        return repository.save(categoria);
    }//guardarCategoria

    public boolean existeNombre(String nombre) {
        return repository.existsByNombre(nombre.trim());
    }//existeNombre

    //Optional<String> validar(Categoria c) {};

    public Categoria actualizaCategoria(Categoria existente, Categoria cambios) {
        existente.setNombre(cambios.getNombre().trim());
        existente.setDescripcion(cambios.getDescripcion());
        return repository.save(existente);
    }//actualizarCategoria

    public void eliminarCategoria(Integer id) {
        repository.deleteById(id);
    }//eliminarCategoria
}
