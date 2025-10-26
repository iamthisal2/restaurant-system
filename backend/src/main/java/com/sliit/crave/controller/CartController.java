package com.sliit.crave.controller;

import com.sliit.crave.config.CustomUserDetails;
import com.sliit.crave.dto.response.Response;
import com.sliit.crave.dto.response.cart.CartResponse;
import com.sliit.crave.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping("/me")
    public ResponseEntity<Response<CartResponse>> getCart(@AuthenticationPrincipal CustomUserDetails userDetails) {
        Response<CartResponse> response = cartService.getCartByUserId(userDetails.getUser().getId());
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @PostMapping("/add")
    public ResponseEntity<Response<CartResponse>> addItemToCart(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestParam Long foodId,
            @RequestParam int quantity
    ) {
        Response<CartResponse> response = cartService.addItemToCart(userDetails.getUser().getId(), foodId, quantity);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @DeleteMapping("/remove/{cartItemId}")
    public ResponseEntity<Response<CartResponse>> removeItemFromCart(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long cartItemId
    ) {
        Response<CartResponse> response = cartService.removeItemFromCart(userDetails.getUser().getId(), cartItemId);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @DeleteMapping("/clear")
    public ResponseEntity<Response<String>> clearCart( @AuthenticationPrincipal CustomUserDetails userDetails) {
        Response<String> response = cartService.clearCart(userDetails.getUser().getId());
        return ResponseEntity.status(response.getStatus()).body(response);
    }
}
