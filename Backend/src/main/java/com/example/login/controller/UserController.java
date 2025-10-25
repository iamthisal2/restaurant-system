package com.example.login.controller;

import com.example.login.config.CustomUserDetails;
import com.example.login.dto.request.auth.UpdateRegisterRequest;
import com.example.login.dto.response.Response;
import com.example.login.dto.response.user.UserResponse;
import com.example.login.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // READ - get own account
    @GetMapping("/me")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Response<UserResponse>> getCurrentUser(@AuthenticationPrincipal CustomUserDetails userDetails) {
        Response<UserResponse> response = userService.getMe(userDetails.getUser().getId());
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @DeleteMapping("/disable/me")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Response<UserResponse>> disableUser(@AuthenticationPrincipal CustomUserDetails userDetails) {
        Response<UserResponse> response = userService.disableUser(userDetails.getUser().getId());
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    // UPDATE - update own account
    @PutMapping("/me")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Response<UserResponse>> updateUser(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody UpdateRegisterRequest request
    ) {
        Response<UserResponse> response = userService.updateUser(userDetails.getUser().getId(), request);
        return ResponseEntity.status(response.getStatus()).body(response);
    }
}
