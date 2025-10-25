package com.example.login.dto.response.FoodTag;


import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class FoodTagResponse {
    private Long id;
    private String tag;
    private Long userId;
}