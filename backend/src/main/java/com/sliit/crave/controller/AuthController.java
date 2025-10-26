package com.sliit.crave.controller;


import com.sliit.crave.dto.request.auth.LoginRequest;
import com.sliit.crave.dto.request.auth.UpdateRegisterRequest;
import com.sliit.crave.dto.response.Response;
import com.sliit.crave.dto.response.auth.LoginResponse;
import com.sliit.crave.dto.response.auth.RegisterResponse;
import com.sliit.crave.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<Response<RegisterResponse>> register(@RequestBody UpdateRegisterRequest request) {
        Response<RegisterResponse> response = authService.register(request);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<Response<LoginResponse>> login(@RequestBody LoginRequest loginRequest) {
        Response<LoginResponse> response = authService.login(loginRequest);
        return ResponseEntity.status(response.getStatus()).body(response);
    }
}
