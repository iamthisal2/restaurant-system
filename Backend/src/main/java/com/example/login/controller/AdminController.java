package com.example.login.controller;

import com.example.login.dto.request.auth.UpdateRegisterRequest;
import com.example.login.dto.response.Response;
import com.example.login.dto.response.UserResponse;
import com.example.login.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController{

    private final UserService userService;

    // Get all users
    @GetMapping("/users")
    public ResponseEntity<Response<List<UserResponse>>> getAllUsers() {
        Response<List<UserResponse>> response = userService.getAllUsers();
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    // Delete a user
    @DeleteMapping("/users/{id}")
    public ResponseEntity<Response<Void>> deleteUser(@PathVariable Long id) {
        Response<Void> response = userService.deleteUser(id);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    // Update a user
    @PutMapping("/users/{userId}")
    public ResponseEntity<Response<UserResponse>> updateUser(
            @PathVariable Long userId,
            @RequestBody UpdateRegisterRequest request
    ) {
        Response<UserResponse> response = userService.updateUser(userId, request);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    // Create a new user
    @PostMapping("/users/create")
    public ResponseEntity<Response<UserResponse>> createUser(
            @RequestBody UpdateRegisterRequest request
    ) {
        Response<UserResponse> response = userService.createUser(request);
        return ResponseEntity.status(response.getStatus()).body(response);
    }
}
