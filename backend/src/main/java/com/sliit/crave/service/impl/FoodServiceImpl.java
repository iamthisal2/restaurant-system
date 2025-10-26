package com.sliit.crave.service.impl;

import com.sliit.crave.dto.request.food.FoodRequest;
import com.sliit.crave.dto.response.Response;
import com.sliit.crave.dto.response.food.FoodResponse;
import com.sliit.crave.entity.Food;
import com.sliit.crave.exception.InvalidFoodException;
import com.sliit.crave.repo.FoodRepository;
import com.sliit.crave.repo.RatingRepository;
import com.sliit.crave.service.FoodService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FoodServiceImpl implements FoodService {

    private final FoodRepository foodRepository;
    private final RatingRepository ratingRepository;

    @Autowired
    public FoodServiceImpl(FoodRepository foodRepository, RatingRepository ratingRepository) {
        this.foodRepository = foodRepository;
        this.ratingRepository = ratingRepository;
    }

    @Override
    public Response<FoodResponse> createFood(FoodRequest foodDTO) {
        try {
            Food food = toEntity(foodDTO);
            Food saved = foodRepository.save(food);
            return Response.successResponse("Food created successfully", toFoodResponseDTO(saved), HttpStatus.CREATED);
        } catch (Exception e) {
            return Response.errorResponse(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public Response<List<FoodResponse>> getAllFoods() {
        try{
            List<Food> foods = foodRepository.findAll();
            List<FoodResponse> foodResponses = foods.stream()
                    .map(this::toFoodResponseDTO)
                    .collect(Collectors.toList());
            return Response.successResponse("Foods retrieved successfully", foodResponses);
        } catch (Exception e) {
            return Response.errorResponse(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @Override
    public Response<FoodResponse> getFoodById(Long id) {
        try {
            Food food = foodRepository.findById(id)
                    .orElseThrow(() -> new InvalidFoodException("Food not found"));
            return Response.successResponse("Food retrieved successfully", toFoodResponseDTO(food));
        } catch (RuntimeException e) {
            return Response.errorResponse(e.getMessage(), HttpStatus.BAD_REQUEST);
        }catch (Exception e) {
            return Response.errorResponse(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @Override
    public Response<FoodResponse> updateFood(Long id, FoodRequest request) {
        try {
            Food existing = foodRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Food not found"));

           if(request.getName() != null && !request.getName().isEmpty()){
               existing.setName(request.getName());
           }

           if(request.getDescription() != null && !request.getDescription().isEmpty()){
                existing.setDescription(request.getDescription());
           }

            if(request.getPrice() != 0){
                existing.setPrice(request.getPrice());
            }

            if(request.getCategory() != null && !request.getCategory().isEmpty()){
                existing.setCategory(request.getCategory());
            }

            Food updated = foodRepository.save(existing);
            return Response.successResponse("Food updated successfully", toFoodResponseDTO(updated));
        } catch (RuntimeException e) {
            return Response.errorResponse(e.getMessage(), HttpStatus.BAD_REQUEST);
        }catch (Exception e) {
            return Response.errorResponse(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public Response<Void> deleteFood(Long id) {
        try {
            if (!foodRepository.existsById(id)) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Food not found");
            }
            foodRepository.deleteById(id);
            return Response.successResponse("Food deleted successfully", null);
        } catch (Exception e) {
            return Response.errorResponse(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    // Helper Methods -----------------------------------------------
    // Convert DTO to entity
    private Food toEntity(FoodRequest dto) {
        Food food = new Food();
        food.setName(dto.getName());
        food.setPrice(dto.getPrice());
        food.setDescription(dto.getDescription());
        food.setCategory(dto.getCategory()); // include category
        return food;
    }

    // Convert entity to DTO
    private FoodResponse toFoodResponseDTO(Food food) {
        Double avgRating = ratingRepository.getAverageRatingForFood(food.getId());
        Long totalRatings = ratingRepository.getTotalRatingsForFood(food.getId());

        return FoodResponse.builder()
                .id(food.getId())
                .name(food.getName())
                .price(food.getPrice())
                .description(food.getDescription())
                .category(food.getCategory())
                .averageRating(avgRating != null ? Math.round(avgRating * 10.0) / 10.0 : 0.0)
                .totalRatings(totalRatings != null ? totalRatings : 0L)
                .build();
    }
}


