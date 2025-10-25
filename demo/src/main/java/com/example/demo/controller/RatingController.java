package com.example.demo.controller;

import com.example.demo.dto.AverageRatingResponse;
import com.example.demo.dto.RatingRequest;
import com.example.demo.dto.RatingResponse;
import com.example.demo.dto.Response;
import com.example.demo.service.RatingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ratings")
@RequiredArgsConstructor
public class RatingController {

    private final RatingService ratingService;

    // Add rating
    @PostMapping
    public ResponseEntity<Response<RatingResponse>> addRating(@RequestBody RatingRequest request) {
        Response<RatingResponse> rating = ratingService.addRating(request);
        return ResponseEntity.status(rating.getStatus()).body(rating);
    }

    // Get all ratings for a food
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

    // Get all ratings (Admin)
    @GetMapping
    public ResponseEntity<Response<List<RatingResponse>>> getAllRatings() {
        Response<List<RatingResponse>> response = ratingService.getAllRatings();
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    // Delete rating
    @DeleteMapping("/{ratingId}")
    public ResponseEntity<Response<Void>> deleteRating(@PathVariable Long ratingId) {
        Response<Void> response = ratingService.deleteRating(ratingId);
        return ResponseEntity.status(response.getStatus()).body(response);
    }
}
