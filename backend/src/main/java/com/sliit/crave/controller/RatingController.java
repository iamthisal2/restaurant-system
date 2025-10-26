package com.sliit.crave.controller;

import com.sliit.crave.dto.request.rating.RatingRequest;
import com.sliit.crave.dto.response.Response;
import com.sliit.crave.dto.response.rating.AverageRatingResponse;
import com.sliit.crave.dto.response.rating.RatingResponse;
import com.sliit.crave.service.RatingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ratings")
@RequiredArgsConstructor
public class RatingController {

    private final RatingService ratingService;

    // Add or update rating
    @PostMapping
    public ResponseEntity<Response<RatingResponse>> addOrUpdateRating(@RequestBody RatingRequest request) {
        Response<RatingResponse> rating = ratingService.addOrUpdateRating(request);
        return ResponseEntity.status(rating.getStatus()).body(rating);
    }

    // Get user's rating for a specific food
    @GetMapping("/user/{userId}/food/{foodId}")
    public ResponseEntity<Response<RatingResponse>> getUserRatingForFood(
            @PathVariable Long userId,
            @PathVariable Long foodId
    ) {
        Response<RatingResponse> rating = ratingService.getUserRatingForFood(userId, foodId);
        return ResponseEntity.status(rating.getStatus()).body(rating);
    }

    // Get all ratings by a user
    @GetMapping("/user/{userId}")
    public ResponseEntity<Response<List<RatingResponse>>> getUserRatings(@PathVariable Long userId) {
        return ResponseEntity.ok(ratingService.getUserRatings(userId));
    }

    // Get all ratings for a food (Admin)
    @GetMapping("/food/{foodId}")
    public ResponseEntity<Response<List<RatingResponse>>> getAllRatingsForFood(@PathVariable Long foodId) {
        Response<List<RatingResponse>> response = ratingService.getAllRatingsForFood(foodId);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    // Get average rating and total count for a food (Public)
    @GetMapping("/food/{foodId}/average")
    public ResponseEntity<Response<AverageRatingResponse>> getFoodAverageRating(@PathVariable Long foodId) {
        Response<AverageRatingResponse> response = ratingService.getAverageRatingResponse(foodId);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    // Delete user's rating for a food
    @DeleteMapping("/user/{userId}/food/{foodId}")
    public ResponseEntity<Response<Void>> deleteRating(
            @PathVariable Long userId,
            @PathVariable Long foodId
    ) {
        Response<Void> response = ratingService.deleteRating(userId, foodId);
        return ResponseEntity.status(response.getStatus()).body(response);
    }


    // Get all ratings (Admin)
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Response<List<RatingResponse>>> getAllRatings() {
        Response<List<RatingResponse>> response = ratingService.getAllRatings();
        return ResponseEntity.status(response.getStatus()).body(response);
    }
}
