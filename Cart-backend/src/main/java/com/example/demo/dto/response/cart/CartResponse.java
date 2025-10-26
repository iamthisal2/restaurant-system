package com.sliit.crave.dto.response.cart;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class CartResponse {
    private Long id;
    private Long userId;
    private double totalPrice;
    private List<CartItemResponse> items;
}