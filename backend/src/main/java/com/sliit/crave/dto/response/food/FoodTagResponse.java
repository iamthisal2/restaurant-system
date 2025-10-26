package com.sliit.crave.dto.response.food;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class FoodTagResponse {
    private Long id;
    private String tag;
    private Long userId;
}
