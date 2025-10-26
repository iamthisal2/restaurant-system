package com.sliit.crave.dto.response.reservation;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RestaurantTableResponse {
    private Long id;
    private Integer capacity;
    private String tableNumber;
}
