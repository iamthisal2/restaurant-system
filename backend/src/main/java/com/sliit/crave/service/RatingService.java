package com.sliit.crave.service;

import com.sliit.crave.dto.request.rating.RatingRequest;
import com.sliit.crave.dto.response.Response;
import com.sliit.crave.dto.response.rating.AverageRatingResponse;
import com.sliit.crave.dto.response.rating.RatingResponse;

import java.util.List;

public interface RatingService {
    
    // Add or update rating (upsert)
    Response<RatingResponse> addOrUpdateRating(RatingRequest request);
    
    // Get user's rating for a specific food
    Response<RatingResponse> getUserRatingForFood(Long userId, Long foodId);
    
    // Get all ratings by a user
    Response<List<RatingResponse>> getUserRatings(Long userId);
    
    // Delete user's rating for a food
    Response<Void> deleteRating(Long userId, Long foodId);
    
    // Get all ratings for a food (Admin)
    Response<List<RatingResponse>> getAllRatingsForFood(Long foodId);
    
    // Get average rating and total count for a food (Public)
    Response<AverageRatingResponse> getAverageRatingResponse(Long foodId);
    
    // Get all ratings (Admin)
    Response<List<RatingResponse>> getAllRatings();

    // Get average rating for a food
    Double getAverageRating(Long foodId);

    // Get total ratings count for a food
    Long getTotalRatings(Long foodId);
}
