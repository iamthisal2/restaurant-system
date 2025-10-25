package com.example.login.service.impl;

import com.example.login.dto.request.FoodTag.FoodTagRequest;
import com.example.login.dto.response.FoodTag.FoodTagResponse;
import com.example.login.dto.response.Response;
import com.example.login.entity.FoodTag;
import com.example.login.entity.User;
import com.example.login.repo.FoodTagRepository;
import com.example.login.repo.UserRepository;
import com.example.login.service.FoodTagService;
import lombok.RequiredArgsConstructor;
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
    }

    @Override
    public Response<FoodTagResponse> updateFoodTag(Long foodTagId, FoodTagRequest foodTagRequest) {
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
    }

    @Override
    public Response<Boolean> deleteFoodTag(Long foodTagId) {
        if(!repository.existsById(foodTagId)){
            return Response.errorResponse("Food tag not found");
        }

        repository.deleteById(foodTagId);
        return Response.successResponse("Food tag deleted successfully", true);
    }

    @Override
    public Response<FoodTagResponse> getFoodTagById(Long foodTagId) {
        FoodTag foodTag = repository.findById(foodTagId)
                .orElseThrow(() -> new RuntimeException("Food tag not found"));

        FoodTagResponse response = FoodTagResponse.builder()
                .id(foodTag.getId())
                .tag(foodTag.getTag())
                .userId(foodTag.getUser().getId())
                .build();

        return Response.successResponse("Food tag retrieved successfully", response);
    }

    @Override
    public Response<List<FoodTagResponse>> getAllFoodTagsForUser(Long userId) {
        List<FoodTag> foodTags = repository.findByUser_Id(userId);
        List<FoodTagResponse> responses = foodTags.stream()
                .map(foodTag -> FoodTagResponse.builder()
                        .id(foodTag.getId())
                        .tag(foodTag.getTag())
                        .userId(foodTag.getUser().getId())
                        .build())
                .collect(Collectors.toList());

        return Response.successResponse("Food tags retrieved successfully", responses);
    }
}

