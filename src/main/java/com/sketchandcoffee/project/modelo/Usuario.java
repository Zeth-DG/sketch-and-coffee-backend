package com.sketchandcoffee.project.modelo;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.*;

@Entity
@Table(name = "usuarios") // nombre de la tabla
public class Usuario {

    @Id // Primary Key del Usuario
    @GeneratedValue(strategy = GenerationType.IDENTITY) //AUTO_INCREMENT
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

    @Column(name = "password", length = 255)
    private String password;


    // --- CONSTRUCTOR VACÍO
    public Usuario() {
    }

    // --- CONSTRUCTOR CON PARÁMETROS ---
    public Usuario(String nombre, String apellido, String telefono, String correo, String rol, Boolean activo, String password) {
        this.nombre = nombre;
        this.apellido = apellido;
        this.telefono = telefono;
        this.correo = correo;
        this.rol = rol;
        this.activo = activo;
        this.password = password;
    }

    // --- GETTERS Y SETTERS ID ---
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }// id

    // --- GETTERS Y SETTERS NOMBRE ---
    public String getNombre() {return nombre;}

    public void setNombre(String nombre) {
        this.nombre = nombre.toUpperCase();
    }

    // --- GETTERS Y SETTERS APELLIDO ---
    public String getApellido() {
        return apellido;
    }

    public void setApellido(String apellido) {
        this.apellido = apellido.toUpperCase();
    }

    // --- GETTERS Y SETTERS TELEFONO ---
    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    // --- GETTERS Y SETTERS CORREO ---
    public String getCorreo() {
        return correo;
    }

    public void setCorreo(String correo) {
        this.correo = correo.toLowerCase();
    }

    // --- GETTERS Y SETTERS ROL ---
    public String getRol() {
        return rol;
    }

    public void setRol(String rol) {
        this.rol = rol;
    }

    // --- GETTERS Y SETTERS ACTIVO/INACTIVO ---
    public Boolean getActivo() {
        return activo;
    }

    public void setActivo(Boolean activo) {
        this.activo = activo;
    }

    // --- GETTERS Y SETTERS PASSWORD ---
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}// class Usuario