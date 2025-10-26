package com.sliit.crave.service;


import com.sliit.crave.dto.response.Response;
import com.sliit.crave.dto.response.cart.CartResponse;
import com.sliit.crave.entity.Cart;

public interface CartService {
    Response<CartResponse> getCartByUserId(Long userId);
    Response<CartResponse> addItemToCart(Long userId, Long foodId, int quantity);
    Response<CartResponse> removeItemFromCart(Long userId, Long cartItemId);
    Response<String> clearCart(Long userId);
}
