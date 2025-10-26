package com.sliit.crave.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatus;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class Response<T> {
    private boolean success;
    private String message;
    private T data;
    private HttpStatus status;

    public static <T> Response<T> successResponse(String message , T data) {
        return new Response<>(true, message, data, HttpStatus.OK);
    }

    public static <T> Response<T> successResponse(String message , T data, HttpStatus status) {
        return new Response<>(true, message, data, status);
    }

    public static <T> Response<T> errorResponse(String message ) {
        return new Response<>(false, message, null, HttpStatus.BAD_REQUEST);
    }

    public static <T> Response<T> errorResponse(String message , HttpStatus status) {
        return new Response<>(false, message, null, status);
    }
}
