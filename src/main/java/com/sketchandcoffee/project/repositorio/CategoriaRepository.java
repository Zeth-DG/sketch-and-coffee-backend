package com.sketchandcoffee.project.repositorio;

import com.sketchandcoffee.project.modelo.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoriaRepository extends JpaRepository<Categoria, Integer> {
    boolean existsByNombre(String nombre);
}//interface
