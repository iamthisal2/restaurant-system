package com.example.login.service.impl;



import com.example.login.dto.request.auth.UpdateRegisterRequest;
import com.example.login.dto.response.Response;
import com.example.login.dto.response.user.UserResponse;
import com.example.login.entity.User;
import com.example.login.enums.Role;
import com.example.login.repo.UserRepository;
import com.example.login.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public Response<List<UserResponse>> getAllUsers() {
        try {
            List<UserResponse> users = userRepository.findAll().stream()
                    .map(user -> UserResponse.builder()
                            .id(user.getId())
                            .name(user.getName())
                            .email(user.getEmail())
                            .role(user.getRole().name())
                            .enabled(!user.isDisabled())
                            .createdDate(user.getCreatedDate())
                            .build())
                    .toList();

            if(users.isEmpty()) {
                return Response.successResponse("No users found", users);
            }
            return Response.successResponse("Users retrieved successfully", users);
        } catch (Exception e) {
            return Response.errorResponse("Failed to retrieve users: " + e.getMessage());
        }
    }

    @Override
    public Response<Void> deleteUser(Long userId) {
        try {
            User user = userRepository.findById(userId).orElse(null);
            if (user == null) {
                return Response.errorResponse("User not found");
            }

            userRepository.delete(user);
            return Response.successResponse("User deleted successfully", null);
        } catch (Exception e) {
            return Response.errorResponse("Failed to delete user: " + e.getMessage());
        }
    }

    @Override
    public Response<UserResponse> updateUser(Long userId, UpdateRegisterRequest request) {
        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            if(request.getName() != null && !request.getName().isEmpty()) {
                user.setName(request.getName());
            }

            if (request.getEmail() != null && !request.getEmail().isEmpty()) {
                user.setEmail(request.getEmail());
            }

            if (request.getPassword() != null && !request.getPassword().isEmpty()) {
                user.setPassword(passwordEncoder.encode(request.getPassword()));
            }

            User updatedUser = userRepository.save(user);

            UserResponse userResponse = UserResponse.builder()
                    .id(updatedUser.getId())
                    .name(updatedUser.getName())
                    .email(updatedUser.getEmail())
                    .role(updatedUser.getRole().name())
                    .enabled(!updatedUser.isDisabled())
                    .createdDate(updatedUser.getCreatedDate())
                    .build();

            return Response.successResponse("User updated successfully", userResponse);
        } catch (Exception e) {
            return Response.errorResponse("Failed to update user: " + e.getMessage());
        }
    }

    @Override
    public Response<UserResponse> getMe(Long userId) {
        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            UserResponse userResponse = UserResponse.builder()
                    .id(user.getId())
                    .name(user.getName())
                    .email(user.getEmail())
                    .role(user.getRole().name())
                    .build();

            return Response.successResponse("User retrieved successfully", userResponse);
        } catch (Exception e) {
            return Response.errorResponse("Failed to retrieve user: " + e.getMessage());
        }
    }

    @Override
    public Response<UserResponse> disableUser(Long userId) {
        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            user.setDisabled(!user.isDisabled());
            User disabledUser = userRepository.save(user);

            UserResponse userResponse = UserResponse.builder()
                    .id(disabledUser.getId())
                    .name(disabledUser.getName())
                    .email(disabledUser.getEmail())
                    .role(disabledUser.getRole().name())
                    .enabled(!disabledUser.isDisabled())
                    .createdDate(disabledUser.getCreatedDate())
                    .build();

            return Response.successResponse("User disabled successfully", userResponse);
        } catch (Exception e) {
            return Response.errorResponse("Failed to disable user: " + e.getMessage());
        }
    }

    @Override
    public Response<UserResponse> createUser(UpdateRegisterRequest request) {
        try {

            if(request.getEmail() != null && !request.getEmail().isEmpty()) {
                if (userRepository.existsByEmail(request.getEmail())) {
                    return Response.errorResponse("Email is already in use");
                }
            }

            User newUser = User.builder()
                    .name(request.getName())
                    .email(request.getEmail())
                    .password(passwordEncoder.encode(request.getPassword()))
                    .role(Role.USER)
                    .isDisabled(false)
                    .build();

            User savedUser = userRepository.save(newUser);

            UserResponse userResponse = UserResponse.builder()
                    .id(savedUser.getId())
                    .name(savedUser.getName())
                    .email(savedUser.getEmail())
                    .role(savedUser.getRole().name())
                    .build();

            return Response.successResponse("User created successfully", userResponse);
        } catch (Exception e) {
            return Response.errorResponse("Failed to create user: " + e.getMessage());
        }
    }
}
