package com.example.Resturent_System.controller;


import com.sliit.crave.config.CustomUserDetails;
import com.sliit.crave.dto.request.order.PlaceOrderRequest;
import com.sliit.crave.dto.response.Response;
import com.sliit.crave.dto.response.order.OrderResponse;
import com.sliit.crave.enums.ReservationStatus;
import com.sliit.crave.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping("/place")
    public ResponseEntity<Response<OrderResponse>> placeOrder(@RequestBody PlaceOrderRequest request) {
        Response<OrderResponse> response = orderService.placeOrder(request);
        return new ResponseEntity<>(response, response.getStatus());
    }

    @GetMapping("/me")
    public ResponseEntity<Response<List<OrderResponse>>> getMyOrders(@AuthenticationPrincipal CustomUserDetails userDetails) {
        Response<List<OrderResponse>> response = orderService.getOrdersByUserId(userDetails.getUser().getId());
        return new ResponseEntity<>(response, response.getStatus());
    }

    @PutMapping("/{orderId}/status")
    public ResponseEntity<Response<OrderResponse>> updateStatus(
            @PathVariable Long orderId,
            @RequestParam ReservationStatus status
    ) {
        Response<OrderResponse> response = orderService.updateStatus(orderId, status);
        return new ResponseEntity<>(response, response.getStatus());
    }

}
