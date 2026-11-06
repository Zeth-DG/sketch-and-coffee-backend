package com.sketchandcoffee.project.servicio;

import com.sketchandcoffee.project.dtos.LoginRequest;
import com.sketchandcoffee.project.dtos.PasswordDto;
import com.sketchandcoffee.project.modelo.Usuario;
import com.sketchandcoffee.project.repositorio.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;

    // Inyección de dependencias limpia por constructor (Spring Boot moderno)
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

    // --- ACTUALIZAR CONTRASEÑA ---
    public Usuario actualizarUsuario(Integer id, PasswordDto dto) {
        Usuario usuarioExistente = obtenerPorId(id);
        usuarioExistente.setPasswordHash(dto.getPasswordNuevo());
        return usuarioRepository.save(usuarioExistente);
    }

    // Eliminar usuario
    public void eliminarUsuario(Integer id) {
        if (!usuarioRepository.existsById(id)) {
            throw new RuntimeException("No se puede eliminar, el usuario no existe con el id: " + id);
        }
        usuarioRepository.deleteById(id);
    }

    // --- REGISTRO Y LOGIN ---
    public Usuario registrar(Usuario usuario) {
        return usuarioRepository.save(usuario);
    }

    public Usuario login(LoginRequest request) {
        // Buscamos directamente el correo en la base de datos (Nota: asegúrate de tener findByCorreo en tu UsuarioRepository)
        Usuario usuario = usuarioRepository.findAll().stream()
                .filter(u -> u.getCorreo().equals(request.getCorreo()) && u.getPasswordHash().equals(request.getPassword()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Credenciales inválidas o usuario no encontrado"));

        return usuario;
    }
}