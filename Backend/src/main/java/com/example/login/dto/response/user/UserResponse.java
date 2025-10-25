package com.example.login.dto.response.user;

import lombok.Builder;
import lombok.Data;


import java.time.LocalDateTime;

@Data
@Builder
public class UserResponse {
    private Long id;
    private String name;
    private String email;
    private String role;
    private boolean enabled;
    private LocalDateTime createdDate;
}

