package com.sketchandcoffee.project.controlador;

import com.sketchandcoffee.project.dtos.LoginRequest;
import com.sketchandcoffee.project.dtos.PasswordDto;
import com.sketchandcoffee.project.modelo.Usuario;
import com.sketchandcoffee.project.servicio.UsuarioService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/sketchcoffee/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {

    private final UsuarioService usuarioService;

    // Inyección de dependencias por constructor (Buena práctica en Spring Boot moderno)
    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    // ==========================================
    // SECCIÓN ADMINISTRADOR
    // ==========================================

    @GetMapping
    public ResponseEntity<List<Usuario>> obtenerTodos() {
        return ResponseEntity.ok(usuarioService.obtenerTodos());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarUsuario(@PathVariable Integer id) {
        usuarioService.eliminarUsuario(id);
        return ResponseEntity.noContent().build();
    }

    // ==========================================
    // SECCIÓN USUARIO / GENERAL
    // ==========================================

    @GetMapping("/{id}")
    public ResponseEntity<Usuario> obtenerPorId(@PathVariable Integer id) {
        return ResponseEntity.ok(usuarioService.obtenerPorId(id));
    }

    @PostMapping
    public ResponseEntity<Usuario> crearUsuario(@RequestBody Usuario usuario) {
        return ResponseEntity.status(HttpStatus.CREATED).body(usuarioService.crearUsuario(usuario));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Usuario> actualizarUsuario(@PathVariable Integer id,
                                                     @RequestBody PasswordDto dto) {
        return ResponseEntity.ok(usuarioService.actualizarUsuario(id, dto));
    }

    // ==========================================
    // AUTENTICACIÓN Y REGISTRO
    // ==========================================

    @PostMapping("/registro")
    public ResponseEntity<Usuario> registrar(@RequestBody Usuario usuario) {
        return ResponseEntity.status(HttpStatus.CREATED).body(usuarioService.registrar(usuario));
    }

    @PostMapping("/login")
    public ResponseEntity<Usuario> login(@RequestBody LoginRequest request) {
        // Pasa el objeto LoginRequest directamente al servicio
        Usuario usuarioAutenticado = usuarioService.login(request);
        return ResponseEntity.ok(usuarioAutenticado);
    }
}
