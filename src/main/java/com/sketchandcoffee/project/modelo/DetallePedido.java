package com.sketchandcoffee.project.modelo;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "detalles_pedido")
public class DetallePedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "pedido_id", nullable = false)
    private Pedido pedido;

    @ManyToOne
    @JoinColumn(name = "producto_id", nullable = false)
    private Producto producto;

    @Column(nullable = false)
    private Integer cantidad;

    @Column(name = "precio_unitario", nullable = false)
    private BigDecimal precioUnitario;

    // Constructor vacío obligatorio por JPA
    public DetallePedido() {

    }//constructor JPA vacio


    // Constructor con parámetros
    public DetallePedido(Pedido pedido, Producto producto, Integer cantidad, BigDecimal precioUnitario) {
        this.pedido = pedido;
        this.producto = producto;
        this.cantidad = cantidad;
        this.precioUnitario = precioUnitario;

    }//constructor


    // Getters y Setters
    public Integer getId() {
        return id;
    }//getId


    public void setId(Integer id) {
        this.id = id;
    }//setId


    public Pedido getPedido() {
        return pedido;
    }//getPedido


    public void setPedido(Pedido pedido) {
        this.pedido = pedido;
    }//setPedido


    public Producto getProducto() {
        return producto;
    }//getProducto


    public void setProducto(Producto producto) {
        this.producto = producto;
    }// setProducto


    public Integer getCantidad() {
        return cantidad;
    }//getCantidad


    public void setCantidad(Integer cantidad) {
        this.cantidad = cantidad;
    }//setCantidad


    public BigDecimal getPrecioUnitario() {
        return precioUnitario;
    }//getPrecioUnitario


    public void setPrecioUnitario(BigDecimal precioUnitario) {
        this.precioUnitario = precioUnitario;
    }//setPrecioUnitario


}//class DetallePedido