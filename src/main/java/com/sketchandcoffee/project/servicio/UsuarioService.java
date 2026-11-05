package com.sketchandcoffee.project.servicio;

import com.sketchandcoffee.project.dtos.PasswordDto;
import com.sketchandcoffee.project.modelo.Usuario;
import com.sketchandcoffee.project.repositorio.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;

    @Autowired
    public UsuarioService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    // Obtener todos los usuarios
    public List<Usuario> obtenerTodos() {
        return usuarioRepository.findAll();
    }

    // Obtener usuario por ID
    public Usuario obtenerPorId(Integer id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con el id: " + id));
    }

    // Crear un usuario nuevo
    public Usuario crearUsuario(Usuario usuario) {
        return usuarioRepository.save(usuario);
    }

    // --- MÉTODO ACTUALIZADO ---
    public Usuario actualizarUsuario(Integer id, PasswordDto dto) {
        // 1. Buscamos si el usuario existe en la base de datos
        Usuario usuarioExistente = obtenerPorId(id);

        // 2. Actualizamos el password_hash utilizando la nueva contraseña del DTO
        usuarioExistente.setPasswordHash(dto.getPasswordNuevo());

        // 3. Guardamos los cambios actualizados en la base de datos MySQL
        return usuarioRepository.save(usuarioExistente);
    }

    // Eliminar usuario
    public void eliminarUsuario(Integer id) {
        if (!usuarioRepository.existsById(id)) {
            throw new RuntimeException("No se puede eliminar, el usuario no existe con el id: " + id);
        }
        usuarioRepository.deleteById(id);
    }

    // --- MÉTODOS DE REGISTRO Y LOGIN ---
    public Usuario registrar(Usuario usuario) {
        return usuarioRepository.save(usuario);
    }

    public Usuario login(String correo, String passwordHash) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findAll().stream()
                .filter(u -> u.getCorreo().equals(correo) && u.getPasswordHash().equals(passwordHash))
                .findFirst();

        if (usuarioOpt.isPresent()) {
            return usuarioOpt.get();
        } else {
            throw new RuntimeException("Credenciales inválidas o usuario no encontrado");
        }
    }
}