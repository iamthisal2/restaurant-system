package com.sliit.crave.dto.request.food;


import lombok.Data;

@Data
public class FoodRequest {
    private String name;
    private double price;
    private String description;
    private String category;
    private Double averageRating;
    private Long totalRatings;
}
