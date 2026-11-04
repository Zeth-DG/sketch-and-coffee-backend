package com.sketchandcoffee.project.dtos;

import java.math.BigDecimal;

/**
 * Cuerpo JSON que se recibe en POST y PUT de /sketchcoffee/productos.
 *
 * ¿Por qué un DTO y no la entidad Producto directa?
 *
 * El contrato de la Actividad 13 (seccion 4.2) dice que la categoria se
 * manda como un numero suelto:
 *
 *     { "nombre": "Latte", "sku": "CAF-001", "categoriaId": 1 }
 *
 * Si el controlador recibiera la entidad Producto, Jackson exigiria un
 * objeto anidado ("categoria": { "id": 1 }), que no es lo que acordamos.
 * Ademas, recibir la entidad completa dejaria que cualquiera mandara una
 * categoria con nombre y descripcion y terminara modificando la tabla
 * `categorias` sin querer. El DTO corta eso: solo entra el id.
 *
 * Responsable: Gonzalo Vargas — Actividad 13
 */
public class ProductoRequest {

    private String sku;
    private String nombre;
    private String descripcion;
    private BigDecimal precio;
    private String imagen;
    private Integer existencias;
    private Boolean activo;

    /** Id de la categoria a la que pertenece. Obligatorio y debe existir. */
    private Integer categoriaId;

    /** Jackson necesita el constructor vacio para armar el objeto. */
    public ProductoRequest() {
    }// constructor vacío

    public ProductoRequest(String sku, String nombre, String descripcion,
                           BigDecimal precio, String imagen,
                           Integer existencias, Boolean activo,
                           Integer categoriaId) {
        this.sku = sku;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.precio = precio;
        this.imagen = imagen;
        this.existencias = existencias;
        this.activo = activo;
        this.categoriaId = categoriaId;
    }// constructor

    public String getSku() {
        return sku;
    }// getSku

    public void setSku(String sku) {
        this.sku = sku;
    }// setSku

    public String getNombre() {
        return nombre;
    }// getNombre

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }// setNombre

    public String getDescripcion() {
        return descripcion;
    }// getDescripcion

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }// setDescripcion

    public BigDecimal getPrecio() {
        return precio;
    }// getPrecio

    public void setPrecio(BigDecimal precio) {
        this.precio = precio;
    }// setPrecio

    public String getImagen() {
        return imagen;
    }// getImagen

    public void setImagen(String imagen) {
        this.imagen = imagen;
    }// setImagen

    public Integer getExistencias() {
        return existencias;
    }// getExistencias

    public void setExistencias(Integer existencias) {
        this.existencias = existencias;
    }// setExistencias

    public Boolean getActivo() {
        return activo;
    }// getActivo

    public void setActivo(Boolean activo) {
        this.activo = activo;
    }// setActivo

    public Integer getCategoriaId() {
        return categoriaId;
    }// getCategoriaId

    public void setCategoriaId(Integer categoriaId) {
        this.categoriaId = categoriaId;
    }// setCategoriaId

    @Override
    public String toString() {
        return "ProductoRequest{" +
                "sku='" + sku + '\'' +
                ", nombre='" + nombre + '\'' +
                ", precio=" + precio +
                ", existencias=" + existencias +
                ", categoriaId=" + categoriaId +
                '}';
    }// toString
}// class ProductoRequest
