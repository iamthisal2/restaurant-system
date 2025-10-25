package com.example.login.service;

import com.example.login.dto.request.auth.UpdateRegisterRequest;
import com.example.login.dto.response.Response;
import com.example.login.dto.response.user.UserResponse;

import java.util.List;

public interface UserService {
    Response<List<UserResponse>> getAllUsers();
    Response<Void> deleteUser(Long userId);
    Response<UserResponse> updateUser(Long userId, UpdateRegisterRequest request);

    Response<UserResponse> getMe(Long userId);
    Response<UserResponse> disableUser(Long userId);
    Response<UserResponse> createUser(UpdateRegisterRequest request);
}
