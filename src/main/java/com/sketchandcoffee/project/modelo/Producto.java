package com.sketchandcoffee.project.modelo;

import jakarta.persistence.*;
import java.math.BigDecimal;

/**
 * Entidad que representa la tabla `productos` de la base sketch_coffee.
 *
 * Los nombres y tipos de abajo estan tomados del CREATE TABLE real del
 * equipo. Importa que coincidan exactamente: application.properties usa
 * ddl-auto=validate, asi que si una columna no cuadra, la aplicacion no
 * arranca y Hibernate dice cual es.
 *
 * Responsable: Gonzalo Vargas — Actividad 12
 */
@Entity
@Table(name = "productos")
public class Producto {

    /** id INT NOT NULL AUTO_INCREMENT */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    /**
     * categoria_id INT NOT NULL, FK -> categorias(id)
     *
     * Se mapea como objeto Categoria y no como un Integer suelto: asi
     * producto.getCategoria().getNombre() funciona sin escribir el JOIN.
     *
     * No se declara fetch: @ManyToOne es EAGER por defecto, y eso es lo que
     * conviene aqui. Con LAZY, leer la categoria fuera de una transaccion
     * lanza LazyInitializationException, que es el error con el que todos
     * se atoran en esta practica. En produccion se usaria LAZY.
     */
    @ManyToOne(optional = false)
    @JoinColumn(name = "categoria_id", nullable = false)
    private Categoria categoria;

    /** sku VARCHAR(30) NOT NULL UNIQUE */
    @Column(name = "sku", nullable = false, unique = true, length = 30)
    private String sku;

    /** nombre VARCHAR(100) NOT NULL */
    @Column(name = "nombre", nullable = false, length = 100)
    private String nombre;

    /** descripcion TEXT NULL */
    @Column(name = "descripcion", columnDefinition = "TEXT")
    private String descripcion;

    /**
     * precio DECIMAL(10,2) NOT NULL
     *
     * BigDecimal y no double: con double, 70.00 puede quedar como
     * 69.99999 y las sumas del carrito salen mal.
     */
    @Column(name = "precio", nullable = false, precision = 10, scale = 2)
    private BigDecimal precio;

    /** imagen VARCHAR(255) NULL */
    @Column(name = "imagen", length = 255)
    private String imagen;

    /** existencias INT NOT NULL DEFAULT 0 */
    @Column(name = "existencias", nullable = false)
    private Integer existencias;

    /** activo BOOLEAN NOT NULL DEFAULT TRUE */
    @Column(name = "activo", nullable = false)
    private Boolean activo;

    // ---------------------------------------------------------------
    // Constructores
    // ---------------------------------------------------------------

    /** JPA necesita un constructor vacio. No se borra. */
    public Producto() {
    }

    public Producto(Categoria categoria, String sku, String nombre,
                    String descripcion, BigDecimal precio,
                    Integer existencias, Boolean activo) {
        this.categoria = categoria;
        this.sku = sku;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.precio = precio;
        this.existencias = existencias;
        this.activo = activo;
    }

    // ---------------------------------------------------------------
    // Getters y setters
    // ---------------------------------------------------------------

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public Categoria getCategoria() { return categoria; }
    public void setCategoria(Categoria categoria) { this.categoria = categoria; }

    public String getSku() { return sku; }
    public void setSku(String sku) { this.sku = sku; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public BigDecimal getPrecio() { return precio; }
    public void setPrecio(BigDecimal precio) { this.precio = precio; }

    public String getImagen() { return imagen; }
    public void setImagen(String imagen) { this.imagen = imagen; }

    public Integer getExistencias() { return existencias; }
    public void setExistencias(Integer existencias) { this.existencias = existencias; }

    public Boolean getActivo() { return activo; }
    public void setActivo(Boolean activo) { this.activo = activo; }

    // ---------------------------------------------------------------

    @Override
    public String toString() {
        return "Producto{id=" + id
                + ", sku='" + sku + '\''
                + ", nombre='" + nombre + '\''
                + ", precio=" + precio
                + ", existencias=" + existencias
                + ", activo=" + activo
                + ", categoria=" + (categoria != null ? categoria.getNombre() : "null")
                + '}';
    }
}
