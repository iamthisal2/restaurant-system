package com.sliit.crave.service.impl;

import com.sliit.crave.dto.request.food.FoodTagRequest;
import com.sliit.crave.dto.response.Response;
import com.sliit.crave.dto.response.food.FoodTagResponse;
import com.sliit.crave.entity.FoodTag;
import com.sliit.crave.entity.User;
import com.sliit.crave.repo.FoodTagRepository;
import com.sliit.crave.repo.UserRepository;
import com.sliit.crave.service.FoodTagService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FoodTagServiceImpl implements FoodTagService {

    private final FoodTagRepository repository;
    private final UserRepository userRepository;

    @Override
    public Response<FoodTagResponse> createFoodTag(FoodTagRequest foodTagRequest) {
        try {

            User user = userRepository.findById(foodTagRequest.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            FoodTag foodTag = FoodTag.builder()
                    .tag(foodTagRequest.getTag())
                    .user(user)
                    .build();
            FoodTag savedFoodTag = repository.save(foodTag);

            FoodTagResponse response = FoodTagResponse.builder()
                    .id(savedFoodTag.getId())
                    .tag(savedFoodTag.getTag())
                    .userId(savedFoodTag.getUser().getId())
                    .build();

            return Response.successResponse("Food tag created successfully", response);
        } catch (RuntimeException e) {
            return Response.errorResponse(e.getMessage());
        }catch (Exception e) {
            return Response.errorResponse("Failed to create tag due to unexpected error", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public Response<FoodTagResponse> updateFoodTag(Long foodTagId, FoodTagRequest foodTagRequest) {
        try {
            FoodTag existingFoodTag = repository.findById(foodTagId)
                    .orElseThrow(() -> new RuntimeException("Food tag not found"));


            if(foodTagRequest.getTag() != null && !foodTagRequest.getTag().isEmpty()){
                existingFoodTag.setTag(foodTagRequest.getTag());
            }

            if(foodTagRequest.getUserId() != null){
                User user = userRepository.findById(foodTagRequest.getUserId())
                        .orElseThrow(() -> new RuntimeException("User not found"));
                existingFoodTag.setUser(user);
            }

            FoodTag updatedFoodTag = repository.save(existingFoodTag);
            FoodTagResponse response = FoodTagResponse.builder()
                    .id(updatedFoodTag.getId())
                    .tag(updatedFoodTag.getTag())
                    .userId(updatedFoodTag.getUser().getId())
                    .build();

            return Response.successResponse("Food tag updated successfully", response);
        } catch (RuntimeException e) {
            return Response.errorResponse(e.getMessage());
        }catch (Exception e) {
            return Response.errorResponse("Failed to update tag due to unexpected error", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public Response<Boolean> deleteFoodTag(Long foodTagId) {
        try {
            repository.deleteById(foodTagId);
            return Response.successResponse("Food tag deleted successfully", true);
        } catch (Exception e) {
            return Response.errorResponse("Failed to delete tag due to unexpected error");
        }
    }

    @Override
    public Response<FoodTagResponse> getFoodTagById(Long foodTagId) {
        try {
            FoodTag foodTag = repository.findById(foodTagId)
                    .orElseThrow(() -> new RuntimeException("Food tag not found"));

            FoodTagResponse response = FoodTagResponse.builder()
                    .id(foodTag.getId())
                    .tag(foodTag.getTag())
                    .userId(foodTag.getUser().getId())
                    .build();

            return Response.successResponse("Food tag retrieved successfully", response);
        } catch (RuntimeException e) {
            return Response.errorResponse(e.getMessage());
        }catch (Exception e) {
            return Response.errorResponse("Failed to retrieve tag due to unexpected error", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public Response<List<FoodTagResponse>> getAllFoodTagsForUser(Long userId) {
        try {
            List<FoodTag> foodTags = repository.findByUserId(userId);
            List<FoodTagResponse> responses = foodTags.stream()
                    .map(foodTag -> FoodTagResponse.builder()
                            .id(foodTag.getId())
                            .tag(foodTag.getTag())
                            .userId(foodTag.getUser().getId())
                            .build())
                    .collect(Collectors.toList());

            return Response.successResponse("Food tags retrieved successfully", responses);
        } catch (Exception e) {
            return Response.errorResponse("Failed to retrieve tags due to unexpected error", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
