package com.sketchandcoffee.project.repositorio;

import com.sketchandcoffee.project.modelo.DetallePedido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DetallePedidoRepositorio extends JpaRepository<DetallePedido, Integer> {

    // Metodo de consulta derivado para buscar detalles por el ID del pedido
    List<DetallePedido> findByPedidoId(Integer pedidoId);

}//DetallePedidoRepository