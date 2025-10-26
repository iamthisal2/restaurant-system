package com.sliit.crave.service.impl;

import com.sliit.crave.dto.request.rating.RatingRequest;
import com.sliit.crave.dto.response.Response;
import com.sliit.crave.dto.response.rating.AverageRatingResponse;
import com.sliit.crave.dto.response.rating.RatingResponse;
import com.sliit.crave.entity.Food;
import com.sliit.crave.entity.Rating;
import com.sliit.crave.entity.User;
import com.sliit.crave.repo.FoodRepository;
import com.sliit.crave.repo.RatingRepository;
import com.sliit.crave.repo.UserRepository;
import com.sliit.crave.service.RatingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RatingServiceImpl implements RatingService {

    private final RatingRepository ratingRepository;
    private final UserRepository userRepository;
    private final FoodRepository foodRepository;

    @Autowired
    public RatingServiceImpl(RatingRepository ratingRepository, UserRepository userRepository, FoodRepository foodRepository) {
        this.ratingRepository = ratingRepository;
        this.userRepository = userRepository;
        this.foodRepository = foodRepository;
    }

    @Override
    @Transactional
    public Response<RatingResponse> addOrUpdateRating(RatingRequest request) {
        try {
            // Validate rating score
            if (request.getRatingScore() < 1 || request.getRatingScore() > 5) {
                throw new RuntimeException("Rating score must be between 1 and 5");
            }

            // Check if rating already exists
            var existingRating = ratingRepository.findByUserIdAndFoodId(request.getUserId(), request.getFoodId());

            Rating rating;
            if (existingRating.isPresent()) {
                // Update existing rating
                rating = existingRating.get();

                if(rating.getRatingScore().equals(request.getRatingScore())) {
                    // No change in rating score
                    return Response.successResponse("Rating unchanged", toDto(rating));
                }
                rating.setRatingScore(request.getRatingScore());
            } else {
                // Create new rating
                rating = new Rating();

                User user = userRepository.findById(request.getUserId())
                        .orElseThrow(() -> new RuntimeException( "User not found"));

                Food food = foodRepository.findById(request.getFoodId())
                        .orElseThrow(() -> new RuntimeException( "Food not found"));

                rating.setUser(user);
                rating.setFood(food);
                rating.setRatingScore(request.getRatingScore());
            }
            Rating saved = ratingRepository.save(rating);
            return Response.successResponse("Rating saved successfully", toDto(saved));
        } catch (RuntimeException e) {
            return Response.errorResponse(e.getMessage(), HttpStatus.BAD_REQUEST);
        }catch (Exception e) {
            return Response.errorResponse("Failed to save rating due to unexpected error" , HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public Response<RatingResponse> getUserRatingForFood(Long userId, Long foodId) {
       try {
           var ratingOpt = ratingRepository.findByUserIdAndFoodId(userId, foodId);
           return ratingOpt.map(rating -> Response.successResponse("Rating found", toDto(rating)))
                   .orElseGet(() -> Response.successResponse("No rating found", null));

       } catch (Exception e) {
              return Response.errorResponse("Failed to retrieve rating due to unexpected error" , HttpStatus.INTERNAL_SERVER_ERROR);
       }
    }

    @Override
    public Response<List<RatingResponse>> getUserRatings(Long userId) {
        try {
            List<Rating> ratings = ratingRepository.findAllByUserId(userId);
            List<RatingResponse> ratingResponses = ratings.stream()
                    .map(this::toDto)
                    .collect(Collectors.toList());
            return Response.successResponse("User ratings retrieved successfully", ratingResponses);
        } catch (Exception e) {
            return Response.errorResponse("Failed to retrieve user ratings due to unexpected error" , HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    @Transactional
    public Response<Void> deleteRating(Long userId, Long foodId) {
        try {
            if (!ratingRepository.existsByUserIdAndFoodId(userId, foodId)) {
                throw new RuntimeException("Rating not found for the given user and food");
            }
            ratingRepository.deleteByUserIdAndFoodId(userId, foodId);
            return Response.successResponse("Rating deleted successfully", null);
        } catch (RuntimeException e) {
            return Response.errorResponse(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return Response.errorResponse("Failed to delete rating due to unexpected error" , HttpStatus.INTERNAL_SERVER_ERROR);
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
            return Response.errorResponse("Failed to retrieve ratings for food due to unexpected error" , HttpStatus.INTERNAL_SERVER_ERROR);
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
            return Response.errorResponse("Failed to retrieve average rating due to unexpected error" , HttpStatus.INTERNAL_SERVER_ERROR);
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
            return Response.errorResponse("Failed to retrieve all ratings due to unexpected error" , HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public Double getAverageRating(Long foodId) {
        Double average = ratingRepository.getAverageRatingForFood(foodId);
        return average != null ? Math.round(average * 10.0) / 10.0 : 0.0; // Round to 1 decimal
    }

    @Override
    public Long getTotalRatings(Long foodId) {
        return ratingRepository.getTotalRatingsForFood(foodId);
    }


    //Helper Methods --------------------------------------------------

    // Convert Entity to DTO
    private RatingResponse toDto(Rating rating) {
        return RatingResponse.builder()
                .id(rating.getId())
                .userId(rating.getUser().getId() != null ? rating.getUser().getId() : null)
                .foodId(rating.getFood().getId() != null ? rating.getFood().getId() : null)
                .foodName(rating.getFood().getName() != null ? rating.getFood().getName() : null)
                .userName(rating.getUser().getName() != null ? rating.getUser().getName() : "Anonymous")
                .ratingScore(rating.getRatingScore())
                .createdAt(rating.getCreatedAt())
                .updatedAt(rating.getUpdatedAt())
                .build();
    }
}
