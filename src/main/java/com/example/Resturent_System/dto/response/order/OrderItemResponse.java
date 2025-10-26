package com.example.Resturent_System.dto.response.order;



import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class OrderItemResponse {
    private Long foodId;
    private String foodName;
    private int quantity;
    private double priceAtPurchase;
}
