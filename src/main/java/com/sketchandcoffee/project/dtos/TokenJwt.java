package com.sketchandcoffee.project.dtos;

public class TokenJwt {

    private String token;

    public TokenJwt(String token) {
        this.token = token;
    }// constructor

    public TokenJwt() { }// constructor vacío

    public String getToken() {
        return token;
    }// getToken

    @Override
    public String toString() {
        return "TokenJwt{" +
                "token='" + token + '\'' +
                '}';
    }// toString
}// class TokenJwt
