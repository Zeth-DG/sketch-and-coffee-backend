package com.sketchandcoffee.project.controlador;
import com.sketchandcoffee.project.modelo.Usuario;
import com.sketchandcoffee.project.repositorio.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/sketchcoffee/usuarios") //http://localhost:8080/sketchcoffee/usuarios
@CrossOrigin(origins = "*") // Postman
public class UsuarioController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    // 1. Obtener todos los usuarios (GET)
    @GetMapping
    public List<Usuario> obtenerTodos() {
        return usuarioRepository.findAll();
    }

    // 2. Obtener un usuario por su ID (GET)
    @GetMapping("/{id}") // http://localhost:8080/sketchcoffee/usuarios/2
    public Optional<Usuario> obtenerPorId(@PathVariable Integer id) {
        return usuarioRepository.findById(id);
    }

    // 3. Crear un nuevo usuario (POST)
    @PostMapping
    public Usuario crearUsuario(@RequestBody Usuario usuario) {
        return usuarioRepository.save(usuario);
    }

    // 4. Actualizar un usuario existente (PUT)
    @PutMapping("/{id}")
    public Usuario actualizarUsuario(@PathVariable Integer id, @RequestBody Usuario usuarioDetalles) {
        return usuarioRepository.findById(id).map(usuario -> {
            usuario.setNombre(usuarioDetalles.getNombre());
            usuario.setApellido(usuarioDetalles.getApellido());
            usuario.setTelefono(usuarioDetalles.getTelefono());
            usuario.setCorreo(usuarioDetalles.getCorreo());
            usuario.setRol(usuarioDetalles.getRol());
            usuario.setActivo(usuarioDetalles.getActivo());
            usuario.setPasswordHash(usuarioDetalles.getPasswordHash());
            return usuarioRepository.save(usuario);
        }).orElseGet(() -> {
            usuarioDetalles.setId(id);
            return usuarioRepository.save(usuarioDetalles);
        });
    }

    // 5. Eliminar un usuario (DELETE)
    @DeleteMapping("/{id}")
    public void eliminarUsuario(@PathVariable Integer id) {
        usuarioRepository.deleteById(id);
    }
}
