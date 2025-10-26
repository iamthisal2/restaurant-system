package com.sliit.crave.controller;

import com.sliit.crave.config.CustomUserDetails;
import com.sliit.crave.dto.response.Response;
import com.sliit.crave.dto.response.user.UserResponse;
import com.sliit.crave.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // READ - get own account
    @GetMapping("/me")

    public ResponseEntity<Response<UserResponse>> getCurrentUser(@AuthenticationPrincipal CustomUserDetails userDetails) {
        Response<UserResponse> response = userService.getMe(userDetails.getUser().getId());
        return ResponseEntity.status(response.getStatus()).body(response);
    }

}
