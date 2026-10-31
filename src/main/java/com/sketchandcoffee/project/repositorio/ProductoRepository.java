package com.sketchandcoffee.project.repositorio;

import com.sketchandcoffee.project.modelo.Producto;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

/**
 * Repositorio de Spring Data JPA para la tabla `productos`.
 *
 * No lleva implementacion: Spring la genera sola al arrancar. Al heredar
 * de JpaRepository ya quedan disponibles las cuatro operaciones del CRUD:
 *
 *   save(producto)        crear y actualizar
 *   findById(id)          consultar uno
 *   findAll()             consultar todos
 *   deleteById(id)        eliminar
 *   existsById(id)        comprobar que ya no esta
 *
 * JpaRepository<Producto, Integer>:
 *   Producto  la entidad que representa la tabla
 *   Integer   el tipo del campo id de esa entidad
 *
 * Responsable: Gonzalo Vargas — Actividad 12
 */
public interface ProductoRepository extends JpaRepository<Producto, Integer> {

    /*
     * Los metodos de abajo son opcionales: la actividad no los exige.
     * Se incluyen porque Spring Data los implementa solo a partir del
     * nombre, sin escribir SQL, y sirven para demostrarlo en la revision.
     * Si prefieres entregar lo minimo, borra estas cuatro lineas.
     */

    /** Busca por el SKU, que es unico en la tabla. */
    Optional<Producto> findBySku(String sku);

    /** Lista los productos de una categoria, por el id de la categoria. */
    List<Producto> findByCategoriaId(Integer categoriaId);
}