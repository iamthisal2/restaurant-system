package com.sliit.crave.service;

import com.sliit.crave.dto.request.auth.LoginRequest;
import com.sliit.crave.dto.response.Response;
import com.sliit.crave.dto.response.auth.LoginResponse;

public interface AuthService {
    Response<LoginResponse> login(LoginRequest request);
}
