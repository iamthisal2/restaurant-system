package com.sliit.crave.controller;

import com.sliit.crave.dto.request.auth.UpdateRegisterRequest;
import com.sliit.crave.dto.request.reservation.AdminReservationRequest;
import com.sliit.crave.dto.response.Response;
import com.sliit.crave.dto.response.order.OrderResponse;
import com.sliit.crave.dto.response.reservation.ReservationResponse;
import com.sliit.crave.dto.response.user.UserResponse;

import com.sliit.crave.enums.OrderStatus;
import com.sliit.crave.service.OrderService;
import com.sliit.crave.service.ReservationService;
import com.sliit.crave.service.UserService;
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
    private final OrderService orderService;
    private final ReservationService reservationService;

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
            @PathVariable  Long userId,
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

    @GetMapping("/orders")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Response<List<OrderResponse>>> getAllOrders() {
        Response<List<OrderResponse>> response = orderService.getAllOrders();
        return new ResponseEntity<>(response, response.getStatus());
    }

    @PutMapping("/orders/{orderId}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Response<OrderResponse>> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestParam String status
    ) {
        Response<OrderResponse> response = orderService.updateStatus(orderId, OrderStatus.valueOf(status));
        return new ResponseEntity<>(response, response.getStatus());
    }

    @PostMapping("/reservations")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Response<ReservationResponse>> createReservationByAdmin(
            @RequestBody AdminReservationRequest request
    ) {
        Response<ReservationResponse> response = reservationService.createReservationByAdmin(request);
        return new ResponseEntity<>(response, response.getStatus());
    }
}
