package com.sliit.crave.exception;

public class InvalidFoodException extends RuntimeException {
    public InvalidFoodException(String message) {
        super("Food Is Not Available: " + message);
    }
}
