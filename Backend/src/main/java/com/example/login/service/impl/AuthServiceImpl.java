package com.example.login.service.impl;

import com.example.login.dto.request.auth.LoginRequest;
import com.example.login.dto.request.auth.UpdateRegisterRequest;
import com.example.login.dto.response.Response;
import com.example.login.dto.response.auth.LoginResponse;
import com.example.login.dto.response.auth.RegisterResponse;
import com.example.login.entity.User;
import com.example.login.enums.Role;
import com.example.login.repo.UserRepository;
import com.example.login.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;

    @Override
    public Response<RegisterResponse> register(UpdateRegisterRequest request) {
        try {
            if (userRepository.existsByEmail(request.getEmail())) {
                return Response.errorResponse("Email already exists");
            }

            User user = User.builder()
                    .email(request.getEmail())
                    .password(request.getPassword()) // plain password, no encoding
                    .name(request.getName())
                    .role(Role.USER)
                    .build();

            userRepository.save(user);

            return Response.successResponse(
                    "User Registered Successfully",
                    RegisterResponse.builder()
                            .name(user.getName())
                            .email(user.getEmail())
                            .build());

        } catch (Exception e) {
            log.error(e.getMessage());
            return Response.errorResponse(e.getMessage());
        }
    }

    @Override
    public Response<LoginResponse> login(LoginRequest request) {
        try {
            if(request.getEmail() == null || request.getPassword() == null) {
                return Response.errorResponse("Email or password cannot be null");
            }

            User user = userRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            LoginResponse response = LoginResponse.builder()
                    .user(
                            LoginResponse.UserData.builder()
                                    .id(user.getId())
                                    .name(user.getName())
                                    .email(user.getEmail())
                                    .role(user.getRole().name())
                                    .build()
                    )
                    .build();

            return Response.successResponse("User successfully logged in", response);

        } catch (Exception e) {
            log.error(e.getMessage());
            return Response.errorResponse("Error occurred while logging in: " + e.getMessage());
        }
    }
}

