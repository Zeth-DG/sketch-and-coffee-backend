package com.sketchandcoffee.project.servicio;

import com.sketchandcoffee.project.modelo.EstadoPedido;
import com.sketchandcoffee.project.modelo.Pedido;
import com.sketchandcoffee.project.modelo.Usuario;
import com.sketchandcoffee.project.repositorio.PedidoRepository;
import com.sketchandcoffee.project.repositorio.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class PedidoService {

    @Autowired
    private PedidoRepository pedidoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    public List<Pedido> listarTodos() {
        return pedidoRepository.findAll();
    }

    public Optional<Pedido> buscarPorId(Integer id) {
        return pedidoRepository.findById(id);
    }

    public Pedido guardar(Pedido pedido) {
        // Validar que el usuario exista
        if (pedido.getUsuario() == null || pedido.getUsuario().getId() == null) {
            throw new IllegalArgumentException("El usuario asociado es obligatorio");
        }
        
        Usuario usuario = usuarioRepository.findById(pedido.getUsuario().getId())
                .orElseThrow(() -> new RuntimeException("Usuario con id " + pedido.getUsuario().getId() + " no encontrado"));
        
        pedido.setUsuario(usuario);

        // Fecha asignada por el backend automáticamente si viene nula
        if (pedido.getFecha() == null) {
            pedido.setFecha(LocalDateTime.now());
        }

        // Validar estado por defecto si no viene especificado
        if (pedido.getEstado() == null) {
            pedido.setEstado(EstadoPedido.PENDIENTE);
        }

        // Validar total positivo
        if (pedido.getTotal() == null || pedido.getTotal().signum() < 0) {
            throw new IllegalArgumentException("El total del pedido no puede ser negativo");
        }

        return pedidoRepository.save(pedido);
    }

    public Pedido actualizar(Integer id, Pedido pedidoDetalles) {
        Pedido pedidoExistente = pedidoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido con id " + id + " no encontrado"));

        if (pedidoDetalles.getEstado() != null) {
            pedidoExistente.setEstado(pedidoDetalles.getEstado());
        }
        if (pedidoDetalles.getTotal() != null) {
            if (pedidoDetalles.getTotal().signum() < 0) {
                throw new IllegalArgumentException("El total del pedido no puede ser negativo");
            }
            pedidoExistente.setTotal(pedidoDetalles.getTotal());
        }

        return pedidoRepository.save(pedidoExistente);
    }

    public boolean eliminar(Integer id) {
        if (pedidoRepository.existsById(id)) {
            pedidoRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
