package com.example.login.dto.request.FoodTag;

import lombok.Data;

@Data
public class FoodTagRequest {
    private String tag;
    private Long userId;
}
