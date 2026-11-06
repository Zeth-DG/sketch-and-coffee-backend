package com.sketchandcoffee.project.dtos;

public class LoginRequest {

    private String correo;
    private String password;

    // Constructor vacío
    public LoginRequest() {
    }

    // Constructor con parámetros
    public LoginRequest(String correo, String password) {
        this.correo = correo;
        this.password = password;
    }

    // Getters
    public String getCorreo() {
        return correo;
    }

    public String getPassword() {
        return password;
    }

    // Setters
    public void setCorreo(String correo) {
        this.correo = correo;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    @Override
    public String toString() {
        return "LoginRequest{" +
                "correo='" + correo + '\'' +
                ", password='" + password + '\'' +
                '}';
    }
}
