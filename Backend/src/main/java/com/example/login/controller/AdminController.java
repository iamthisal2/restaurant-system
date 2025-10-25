package com.example.login.controller;
import com.example.login.dto.request.auth.UpdateRegisterRequest;
import com.example.login.dto.response.Response;
import com.example.login.dto.response.user.UserResponse;
import com.example.login.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final UserService userService;

    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Response<List<UserResponse>>> getAllUsers() {
        Response<List<UserResponse>> response = userService.getAllUsers();
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @DeleteMapping("/users/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Response<Void>> deleteUser(@PathVariable Long id) {
        Response<Void> response = userService.deleteUser(id);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @PutMapping("/users/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Response<UserResponse>> updateUser(
            @PathVariable Long userId,
            @RequestBody UpdateRegisterRequest request
    ) {
        Response<UserResponse> response = userService.updateUser(userId, request);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @PostMapping("/users/create")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Response<UserResponse>> createUser(
            @RequestBody UpdateRegisterRequest request
    ) {
        Response<UserResponse> response = userService.createUser(request);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @PutMapping("/users/disable/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Response<UserResponse>> disableUser(
            @PathVariable Long userId
    ) {
        Response<UserResponse> response = userService.disableUser(userId);
        return ResponseEntity.status(response.getStatus()).body(response);
    }
}
