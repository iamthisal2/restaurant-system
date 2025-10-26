package com.sliit.crave.dto.response.food;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class FoodResponse {
    private Long id;
    private String name;
    private double price;
    private String description;
    private String category;
    private Double averageRating;
    private Long totalRatings;
}
