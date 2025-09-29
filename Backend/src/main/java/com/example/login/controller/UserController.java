package com.example.login.controller;

import com.example.login.dto.*;
import com.example.login.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    private final UserService userService;

    // Register endpoint
    @PostMapping("/register")
    public ResponseEntity<UserResponse> registerUser(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(userService.register(request));
    }

    // Login endpoint
    @PostMapping("/login")
    public ResponseEntity<UserResponse> loginUser(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(userService.login(request));
    }

    // READ - get own account
    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUser(
            @PathVariable Long id,
            @RequestParam Long loggedInUserId // pass from frontend after login
    ) {
        return ResponseEntity.ok(userService.getUserById(id, loggedInUserId));
    }

    // UPDATE - update own account
    @PutMapping("/{id}")
    public ResponseEntity<UserResponse> updateUser(
            @PathVariable Long id,
            @RequestParam Long loggedInUserId, // pass from frontend after login
            @RequestBody RegisterRequest request
    ) {
        return ResponseEntity.ok(userService.updateUser(id, loggedInUserId, request));
    }

    // DELETE - delete own account
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(
            @PathVariable Long id,
            @RequestParam Long loggedInUserId // pass from frontend after login
    ) {
        userService.deleteUser(id, loggedInUserId);
        return ResponseEntity.noContent().build();
    }
}
