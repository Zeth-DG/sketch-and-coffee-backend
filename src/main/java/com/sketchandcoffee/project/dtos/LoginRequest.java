package com.sketchandcoffee.project.dtos;

public class LoginRequest {

    private String email;
    private String password;

    public LoginRequest(String email, String password) {
        this.email = email;
        this.password = password;
    }// constructor

    public LoginRequest() { }// constructor vacío

    public String getEmail() {
        return email;
    }// getEmail

    public String getPassword() {
        return password;
    }// getPassword

    @Override
    public String toString() {
        return "LoginRequest{" +
                "email='" + email + '\'' +
                ", password='" + password + '\'' +
                '}';
    }// toString
}// class LoginRequest
