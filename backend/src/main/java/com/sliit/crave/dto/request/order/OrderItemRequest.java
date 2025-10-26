package com.sliit.crave.dto.request.order;

import lombok.Data;


@Data
public class OrderItemRequest {
    private Long foodId;
    private int quantity;
}