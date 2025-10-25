package com.example.login.dto.response.auth;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RegisterResponse {
    private String name;
    private String email;
    private String username;
}
