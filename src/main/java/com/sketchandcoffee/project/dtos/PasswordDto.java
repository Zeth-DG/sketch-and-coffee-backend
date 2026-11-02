package com.sketchandcoffee.project.dtos;

public class PasswordDto {

    private String passwordActual;
    private String passwordNuevo;

    public PasswordDto(String passwordActual, String passwordNuevo) {
        this.passwordActual = passwordActual;
        this.passwordNuevo = passwordNuevo;
    }// constructor

    public PasswordDto(){ }// constructor vacío

    public String getPasswordActual() {
        return passwordActual;
    }// getPasswordActual

    public String getPasswordNuevo() {
        return passwordNuevo;
    }// getPasswordNuevo

}// class PasswordDto
