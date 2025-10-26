package com.sliit.crave.dto.request.food;

import lombok.Data;

@Data
public class FoodTagRequest {
    private String tag;
    private Long userId;
}
