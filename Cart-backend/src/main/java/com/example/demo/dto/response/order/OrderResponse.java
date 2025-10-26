package com.sliit.crave.dto.response.order;


import com.sliit.crave.enums.ReservationStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class OrderResponse {
    private Long id;
    private LocalDateTime orderDateTime;
    private LocalDateTime createdAt;
    private Double totalAmount;
    private ReservationStatus status;
    private String deliveryAddress;
    private String contactNumber;
    private String customerName;
    private String customerEmail;
    private List<OrderItemResponse> items;
}
