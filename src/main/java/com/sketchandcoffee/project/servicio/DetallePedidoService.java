package com.sketchandcoffee.project.servicio;

import com.sketchandcoffee.project.modelo.DetallePedido;
import com.sketchandcoffee.project.modelo.Pedido;
import com.sketchandcoffee.project.modelo.Producto;
import com.sketchandcoffee.project.repositorio.DetallePedidoRepository;
import com.sketchandcoffee.project.repositorio.PedidoRepository;
import com.sketchandcoffee.project.repositorio.ProductoRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class DetallePedidoService {

    @Autowired
    private DetallePedidoRepository detallePedidoRepository;

    @Autowired
    private PedidoRepository pedidoRepository;

    @Autowired
    private ProductoRepository productoRepository;

    public List<DetallePedido> listarTodos() {
        return detallePedidoRepository.findAll();
    }//listarTodos

    public Optional<DetallePedido> buscarPorId(Integer id) {
        return detallePedidoRepository.findById(id);
    }//buscarPorId

    public List<DetallePedido> buscarPorPedidoId(Integer pedidoId) {
        if (!pedidoRepository.existsById(pedidoId)) {
            throw new EntityNotFoundException("Pedido con id " + pedidoId + " no encontrado");
        }//if !
        return detallePedidoRepository.findByPedidoId(pedidoId);
    }//buscarPorPedidoId

    public DetallePedido guardar(Integer pedidoId, Integer productoId, Integer cantidad, BigDecimal precioUnitario) {

        // Reglas de negocio (código 400 según contrato)
        if (cantidad == null || cantidad <= 0) {
            throw new IllegalArgumentException("La cantidad debe ser mayor a cero.");
        }// if mayor a cero
        if (precioUnitario == null || precioUnitario.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("El precio unitario no puede ser negativo.");
        }// if no debe ser negativo

        // Validación de llaves foráneas (código 404 según contrato)
        Pedido pedido = pedidoRepository.findById(pedidoId)
                .orElseThrow(() -> new EntityNotFoundException("Pedido con id " + pedidoId + " no encontrado"));

        Producto producto = productoRepository.findById(productoId)
                .orElseThrow(() -> new EntityNotFoundException("Producto con id " + productoId + " no encontrado"));

        DetallePedido detalle = new DetallePedido(pedido, producto, cantidad, precioUnitario);
        return detallePedidoRepository.save(detalle);
    }//DetallePedido

    public DetallePedido actualizar(Integer id, Integer cantidad, BigDecimal precioUnitario) {
        DetallePedido detalle = detallePedidoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Detalle con id " + id + " no encontrado"));

        if (cantidad != null) {
            if (cantidad <= 0) throw new IllegalArgumentException("La cantidad debe ser mayor a cero.");
            detalle.setCantidad(cantidad);
        }// if  !=null mayor a cero
        if (precioUnitario != null) {
            if (precioUnitario.compareTo(BigDecimal.ZERO) < 0) throw new IllegalArgumentException("El precio unitario no puede ser negativo.");
            detalle.setPrecioUnitario(precioUnitario);
        }// if !=null no puede ser negativo

        return detallePedidoRepository.save(detalle);
    }// DetallePedido actualizar

    public void eliminar(Integer id) {
        if (!detallePedidoRepository.existsById(id)) {
            throw new EntityNotFoundException("Detalle con id " + id + " no encontrado");
        }// if !detallePedidoRepository
        detallePedidoRepository.deleteById(id);

    }// eliminar

}// DetallePedidoService