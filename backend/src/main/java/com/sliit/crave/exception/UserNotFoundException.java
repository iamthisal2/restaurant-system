package com.sliit.crave.exception;

public class UserNotFoundException extends RuntimeException {
    public UserNotFoundException(String email) {
        super(
                "User not found with email: " + email
        );
    }
}
