package com.example.login.exception;

public class UserAlreadyExistException extends RuntimeException {
    public UserAlreadyExistException(String email) {
        super(
                "User already exists with email: " + email
        );
    }
}
