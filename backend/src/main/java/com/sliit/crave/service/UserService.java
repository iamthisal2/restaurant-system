package com.sliit.crave.service;

import com.sliit.crave.dto.request.auth.UpdateRegisterRequest;
import com.sliit.crave.dto.response.Response;
import com.sliit.crave.dto.response.user.UserResponse;

import java.util.List;

public interface UserService {
    Response<List<UserResponse>> getAllUsers();
    Response<Void> deleteUser(Long userId);
    Response<UserResponse> updateUser(Long userId, UpdateRegisterRequest request);
    Response<UserResponse> getMe(Long userId);
    Response<UserResponse> disableUser(Long userId);
    Response<UserResponse> createUser(UpdateRegisterRequest request);
}
