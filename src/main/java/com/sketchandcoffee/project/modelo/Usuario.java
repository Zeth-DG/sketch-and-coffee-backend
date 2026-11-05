package com.sketchandcoffee.project.modelo;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;

@Entity
@Table(name = "usuarios")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "nombre", nullable = false, length = 50)
    private String nombre;

    @Column(name = "apellido", nullable = false, length = 50)
    private String apellido;

    @Column(name = "telefono", length = 20)
    private String telefono;

    @Column(name = "correo", nullable = false, length = 100)
    private String correo;

    @Column(name = "rol", nullable = false, length = 20)
    private String rol;

    @Column(name = "activo", length = 20)
    private Boolean activo;

    @Column(name = "password_hash", length = 255)
    private String password_hash;

    // --- CONSTRUCTOR VACÍO ---
    public Usuario() {
    }

    // --- CONSTRUCTOR CON PARÁMETROS ---
    public Usuario(String nombre, String apellido, String telefono, String correo, String rol, Boolean activo, String password_hash) {
        this.nombre = nombre;
        this.apellido = apellido;
        this.telefono = telefono;
        this.correo = correo;
        this.rol = rol;
        this.activo = activo;
        this.password_hash = password_hash;
    }

    // --- GETTERS Y SETTERS ---
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre.toUpperCase();
    }

    public String getApellido() {
        return apellido;
    }

    public void setApellido(String apellido) {
        this.apellido = apellido.toUpperCase();
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public String getCorreo() {
        return correo;
    }

    public void setCorreo(String correo) {
        this.correo = correo.toLowerCase();
    }

    public String getRol() {
        return rol;
    }

    public void setRol(String rol) {
        this.rol = rol;
    }

    public Boolean getActivo() {
        return activo;
    }

    public void setActivo(Boolean activo) {
        this.activo = activo;
    }

    // JSON (Seguridad)
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    public String getPasswordHash() {
        return password_hash;
    }

    public void setPasswordHash(String passwordHash) {
        this.password_hash = passwordHash;
    }
}
