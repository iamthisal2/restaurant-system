package com.sliit.crave.dto.response.cart;



import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CartItemResponse {
    private Long id;
    private Long foodId;
    private String foodName;
    private double priceAtOrderTime;
    private int quantity;
    //private String imageUrl; // optional, if your Food has one
}
