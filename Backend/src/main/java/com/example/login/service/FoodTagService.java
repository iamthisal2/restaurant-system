package com.example.login.service;

import com.example.login.dto.request.FoodTag.FoodTagRequest;
import com.example.login.dto.response.Response;
import com.example.login.dto.response.FoodTag.FoodTagResponse;

import java.util.List;

public interface FoodTagService {

    Response<FoodTagResponse> createFoodTag(FoodTagRequest foodTagRequest);
    Response<FoodTagResponse> updateFoodTag(Long foodTagId, FoodTagRequest foodTagRequest);
    Response<Boolean> deleteFoodTag(Long foodTagId);
    Response<FoodTagResponse> getFoodTagById(Long foodTagId);
    Response<List<FoodTagResponse>> getAllFoodTagsForUser(Long userId);



}
