package com.example.demo.service;

import com.example.demo.dto.AverageRatingResponse;
import com.example.demo.dto.RatingRequest;
import com.example.demo.dto.RatingResponse;
import com.example.demo.dto.Response;
import com.example.demo.entity.Rating;
import com.example.demo.model.Food;
import com.example.demo.repository.FoodRepository;
import com.example.demo.repository.RatingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RatingServiceImpl implements RatingService {

    private final RatingRepository ratingRepository;
    private final FoodRepository foodRepository;

    @Autowired
    public RatingServiceImpl(RatingRepository ratingRepository, FoodRepository foodRepository) {
        this.ratingRepository = ratingRepository;
        this.foodRepository = foodRepository;
    }

    @Override
    @Transactional
    public Response<RatingResponse> addRating(RatingRequest request) {
        try {
            // Validate rating score
            if (request.getRatingScore() < 1 || request.getRatingScore() > 5) {
                throw new RuntimeException("Rating score must be between 1 and 5");
            }

            // Create new rating
            Rating rating = new Rating();

            Food food = foodRepository.findById(request.getFoodId())
                    .orElseThrow(() -> new RuntimeException("Food not found"));

            rating.setFood(food);
            rating.setRatingScore(request.getRatingScore());
            rating.setCustomerName(request.getCustomerName() != null ? request.getCustomerName() : "Anonymous");

            Rating saved = ratingRepository.save(rating);
            return Response.successResponse("Rating saved successfully", toDto(saved));
        } catch (RuntimeException e) {
            return Response.errorResponse(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return Response.errorResponse("Failed to save rating due to unexpected error", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public Response<List<RatingResponse>> getAllRatingsForFood(Long foodId) {
        try {
            List<Rating> ratings = ratingRepository.findAllByFoodId(foodId);
            List<RatingResponse> ratingResponses = ratings.stream()
                    .map(this::toDto)
                    .collect(Collectors.toList());
            return Response.successResponse("Ratings for food retrieved successfully", ratingResponses);
        } catch (Exception e) {
            return Response.errorResponse("Failed to retrieve ratings for food due to unexpected error", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public Response<AverageRatingResponse> getAverageRatingResponse(Long foodId) {
        try {
            Double average = getAverageRating(foodId);
            Long total = getTotalRatings(foodId);

            AverageRatingResponse response = AverageRatingResponse.builder()
                    .averageRating(average)
                    .totalRatings(total)
                    .build();

            return Response.successResponse("Average rating retrieved successfully", response);
        } catch (Exception e) {
            return Response.errorResponse("Failed to retrieve average rating due to unexpected error", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public Response<List<RatingResponse>> getAllRatings() {
        try {
            List<Rating> ratings = ratingRepository.findAll();
            List<RatingResponse> ratingResponses = ratings.stream()
                    .map(this::toDto)
                    .collect(Collectors.toList());
            return Response.successResponse("All ratings retrieved successfully", ratingResponses);
        } catch (Exception e) {
            return Response.errorResponse("Failed to retrieve all ratings due to unexpected error", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    @Transactional
    public Response<Void> deleteRating(Long ratingId) {
        try {
            if (!ratingRepository.existsById(ratingId)) {
                throw new RuntimeException("Rating not found");
            }
            ratingRepository.deleteById(ratingId);
            return Response.successResponse("Rating deleted successfully", null);
        } catch (RuntimeException e) {
            return Response.errorResponse(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return Response.errorResponse("Failed to delete rating due to unexpected error", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public Double getAverageRating(Long foodId) {
        Double average = ratingRepository.getAverageRatingForFood(foodId);
        return average != null ? Math.round(average * 10.0) / 10.0 : 0.0; // Round to 1 decimal
    }

    @Override
    public Long getTotalRatings(Long foodId) {
        Long total = ratingRepository.getTotalRatingsForFood(foodId);
        return total != null ? total : 0L;
    }

    // Helper Methods --------------------------------------------------

    // Convert Entity to DTO
    private RatingResponse toDto(Rating rating) {
        return RatingResponse.builder()
                .id(rating.getId())
                .foodId(rating.getFood() != null && rating.getFood().getId() != null ? rating.getFood().getId() : null)
                .foodName(rating.getFood() != null && rating.getFood().getName() != null ? rating.getFood().getName() : null)
                .customerName(rating.getCustomerName() != null ? rating.getCustomerName() : "Anonymous")
                .ratingScore(rating.getRatingScore())
                .createdAt(rating.getCreatedAt())
                .updatedAt(rating.getUpdatedAt())
                .build();
    }
}
