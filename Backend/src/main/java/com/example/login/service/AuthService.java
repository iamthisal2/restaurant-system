package com.example.login.service;

import com.example.login.dto.request.auth.LoginRequest;
import com.example.login.dto.request.auth.UpdateRegisterRequest;
import com.example.login.dto.response.auth.LoginResponse;
import com.example.login.dto.response.auth.RegisterResponse;
import com.example.login.dto.response.Response;

public interface AuthService {
    Response<LoginResponse> login(LoginRequest request);
    Response<RegisterResponse> register(UpdateRegisterRequest request);
}
