package com.sliit.crave.dto.request.order;


import lombok.Data;

import java.util.List;

@Data
public class PlaceOrderRequest {
    private Long userId;
    private String deliveryAddress;
    private String contactNumber;
    private List<OrderItemRequest> items;
}
