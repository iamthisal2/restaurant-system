package com.example.demo.service;

import com.example.demo.dto.AverageRatingResponse;
import com.example.demo.dto.RatingRequest;
import com.example.demo.dto.RatingResponse;
import com.example.demo.dto.Response;

import java.util.List;

public interface RatingService {
    
    // Add rating
    Response<RatingResponse> addRating(RatingRequest request);
    
    // Get all ratings for a food
    Response<List<RatingResponse>> getAllRatingsForFood(Long foodId);
    
    // Get average rating and total count for a food (Public)
    Response<AverageRatingResponse> getAverageRatingResponse(Long foodId);
    
    // Get all ratings (Admin)
    Response<List<RatingResponse>> getAllRatings();

    // Delete rating by ID
    Response<Void> deleteRating(Long ratingId);

    // Get average rating for a food
    Double getAverageRating(Long foodId);

    // Get total ratings count for a food
    Long getTotalRatings(Long foodId);
}
