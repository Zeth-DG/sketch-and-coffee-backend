package com.sketchandcoffee.project.servicio;

import com.sketchandcoffee.project.modelo.Usuario;
import com.sketchandcoffee.project.repositorio.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;

    @Autowired
    public UsuarioService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    public List<Usuario> obtenerTodos() {
        return usuarioRepository.findAll();
    }

    public Usuario obtenerPorId(Integer id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "El usuario con el id [" + id + "] no existe"));
    }

    /**
     * Reglas de rol/activo compartidas por crear y registrar. El ENUM de la
     * tabla solo acepta 'cliente' y 'admin' (NOT NULL), asi que sin valor se
     * usa el default del CREATE TABLE ("cliente") y un valor raro responde
     * 400, no 500 de violacion de llave.
     */
    private void aplicarDefaultsRolActivo(Usuario usuario) {
        if (usuario.getRol() == null || usuario.getRol().isBlank()) {
            usuario.setRol("cliente");
        } else if (!usuario.getRol().equalsIgnoreCase("cliente")
                && !usuario.getRol().equalsIgnoreCase("admin")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "El rol solo puede ser 'cliente' o 'admin'");
        }// if rol

        if (usuario.getActivo() == null) {
            usuario.setActivo(Boolean.TRUE);
        }// if activo
    }// aplicarDefaultsRolActivo

    public Usuario crearUsuario(Usuario usuario) {
        if (usuario.getCorreo() != null) {
            String correoLimpio = usuario.getCorreo().trim().toLowerCase();
            if (usuarioRepository.findByCorreo(correoLimpio).isPresent()) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "El correo " + correoLimpio + " ya está registrado");
            }
            usuario.setCorreo(correoLimpio);
        }
        aplicarDefaultsRolActivo(usuario);
        return usuarioRepository.save(usuario);
    }

    public Usuario actualizarUsuario(Integer id, Usuario usuarioDetalles) {
        return usuarioRepository.findById(id).map(usuario -> {
            usuario.setNombre(usuarioDetalles.getNombre());
            usuario.setApellido(usuarioDetalles.getApellido());
            usuario.setTelefono(usuarioDetalles.getTelefono());
            usuario.setCorreo(usuarioDetalles.getCorreo());
            // rol y activo son NOT NULL en la tabla: si el cuerpo no los
            // trae se conserva el valor actual para no provocar un 500; si
            // trae un rol raro, la validacion de abajo responde 400.
            if (usuarioDetalles.getRol() != null) {
                usuario.setRol(usuarioDetalles.getRol());
            }
            if (usuarioDetalles.getActivo() != null) {
                usuario.setActivo(usuarioDetalles.getActivo());
            }
            if (!"cliente".equalsIgnoreCase(usuario.getRol())
                    && !"admin".equalsIgnoreCase(usuario.getRol())) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "El rol solo puede ser 'cliente' o 'admin'");
            }
            usuario.setPasswordHash(usuarioDetalles.getPasswordHash());
            return usuarioRepository.save(usuario);
        }).orElseGet(() -> {
            usuarioDetalles.setId(id);
            return usuarioRepository.save(usuarioDetalles);
        });
    }

    public void eliminarUsuario(Integer id) {
        if (!usuarioRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "El usuario con el id [" + id + "] no existe");
        }
        usuarioRepository.deleteById(id);
    }

    public Usuario registrar(Usuario usuario) {
        if (usuario.getNombre() == null || usuario.getNombre().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El campo nombre es obligatorio");
        }
        if (usuario.getApellido() == null || usuario.getApellido().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El campo apellido es obligatorio");
        }
        if (usuario.getCorreo() == null || usuario.getCorreo().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El campo correo es obligatorio");
        }
        if (usuario.getPasswordHash() == null || usuario.getPasswordHash().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El campo contraseña es obligatorio");
        }

        String correoLimpio = usuario.getCorreo().trim().toLowerCase();
        if (!correoLimpio.contains("@") || !correoLimpio.contains(".")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El formato del correo es inválido");
        }

        Optional<Usuario> existente = usuarioRepository.findByCorreo(correoLimpio);
        if (existente.isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "El correo " + correoLimpio + " ya está registrado");
        }

        usuario.setCorreo(correoLimpio);
        aplicarDefaultsRolActivo(usuario);
        return usuarioRepository.save(usuario);
    }

    public Usuario login(String correo, String passwordHash) {
        if (correo == null || correo.trim().isEmpty() || passwordHash == null || passwordHash.trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciales inválidas");
        }

        String correoLimpio = correo.trim().toLowerCase();
        Usuario usuario = usuarioRepository.findByCorreo(correoLimpio)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciales inválidas"));

        if (!usuario.getPasswordHash().equals(passwordHash)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciales inválidas");
        }

        return usuario;
    }
}