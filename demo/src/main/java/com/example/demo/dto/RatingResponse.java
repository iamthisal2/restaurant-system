package com.example.demo.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class RatingResponse {
    private Long id;
    private String customerName;
    private Long foodId;
    private String foodName;
    private Integer ratingScore;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
