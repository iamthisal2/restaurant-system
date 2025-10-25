package com.example.demo.dto;

import lombok.Data;

@Data
public class RatingRequest {
    private Long id;
    private Long foodId;
    private Integer ratingScore;
    private String customerName; // Optional
}
