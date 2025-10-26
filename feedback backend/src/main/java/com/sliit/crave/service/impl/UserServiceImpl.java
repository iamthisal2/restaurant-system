package com.sliit.crave.service.impl;

import com.sliit.crave.dto.response.Response;
import com.sliit.crave.dto.response.user.UserResponse;
import com.sliit.crave.entity.User;

import com.sliit.crave.repo.UserRepository;
import com.sliit.crave.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

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
}
