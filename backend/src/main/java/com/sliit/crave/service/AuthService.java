package com.sliit.crave.service;

import com.sliit.crave.dto.request.auth.LoginRequest;
import com.sliit.crave.dto.request.auth.UpdateRegisterRequest;
import com.sliit.crave.dto.response.Response;
import com.sliit.crave.dto.response.auth.LoginResponse;
import com.sliit.crave.dto.response.auth.RegisterResponse;

public interface AuthService {
    Response<LoginResponse> login(LoginRequest request);
    Response<RegisterResponse> register(UpdateRegisterRequest request);
}
