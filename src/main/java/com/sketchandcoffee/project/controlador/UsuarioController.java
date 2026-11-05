package com.sketchandcoffee.project.controlador;

import com.sketchandcoffee.project.dtos.PasswordDto;
import com.sketchandcoffee.project.modelo.Usuario;
import com.sketchandcoffee.project.servicio.UsuarioService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/sketchcoffee/usuarios") // http://localhost:8080/sketchcoffee/usuarios
@CrossOrigin(origins = "*")
public class UsuarioController {

    private final UsuarioService usuarioService;

    @Autowired
    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @GetMapping
    public List<Usuario> obtenerTodos() {
        return usuarioService.obtenerTodos();
    }

    @GetMapping("/{id}")
    public Usuario obtenerPorId(@PathVariable Integer id) {
        return usuarioService.obtenerPorId(id);
    }

    @PostMapping
    public ResponseEntity<Usuario> crearUsuario(@RequestBody Usuario usuario) {
        Usuario nuevo = usuarioService.crearUsuario(usuario);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevo);
    }

    // --- Actualización contraseña) ---
    @PutMapping("/{id}")
    public Usuario actualizarUsuario(@PathVariable Integer id,
                                     @RequestBody PasswordDto dto) {
        return usuarioService.actualizarUsuario(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminarUsuario(@PathVariable Integer id) {
        usuarioService.eliminarUsuario(id);
    }

    // --- MÉTODOS DE AUTENTICACIÓN Y SEGURIDAD (Alexandra) ---

    @PostMapping("/registro")
    public ResponseEntity<Usuario> registrar(@RequestBody Usuario usuario) {
        Usuario creado = usuarioService.registrar(usuario);
        return ResponseEntity.status(HttpStatus.CREATED).body(creado);
    }

    @PostMapping("/login")
    public ResponseEntity<Usuario> login(@RequestBody Map<String, String> credenciales) {
        String correo = credenciales.get("correo");
        String passwordHash = credenciales.get("passwordHash");

        Usuario usuarioAutenticado = usuarioService.login(correo, passwordHash);
        return ResponseEntity.ok(usuarioAutenticado);
    }
}
