package com.sliit.crave.dto.request.auth;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UpdateRegisterRequest {
    private String name;
    private String email;
    private String password;
}
