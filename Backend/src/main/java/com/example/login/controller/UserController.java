package com.example.login.controller;

import com.example.login.entity.User; // ✅ used for responses
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

    // Updated to send clear error messages back to frontend
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User request) {
        try {
            return ResponseEntity.ok(userService.register(request));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    // Login endpoint
    @PostMapping("/login")
    public ResponseEntity<UserResponse> loginUser(@RequestBody User request) {
        return ResponseEntity.ok(userService.login(request));
    }

    // READ - get own account
    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUser(
            @PathVariable Long id,
            @RequestParam Long loggedInUserId
    ) {
        return ResponseEntity.ok(userService.getUserById(id, loggedInUserId));
    }

    // UPDATE - update own account
    @PutMapping("/{id}")
    public ResponseEntity<UserResponse> updateUser(
            @PathVariable Long id,
            @RequestParam Long loggedInUserId,
            @RequestBody RegisterRequest request
    ) {
        return ResponseEntity.ok(userService.updateUser(id, loggedInUserId, request));
    }

    // DELETE - delete own account
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(
            @PathVariable Long id,
            @RequestParam Long loggedInUserId
    ) {
        userService.deleteUser(id, loggedInUserId);
        return ResponseEntity.noContent().build();
    }

    // Added helper class for clean error responses
    record ErrorResponse(String message) {}
}
