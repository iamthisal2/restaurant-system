package com.sliit.crave.service;

import com.sliit.crave.dto.request.food.FoodTagRequest;
import com.sliit.crave.dto.response.Response;
import com.sliit.crave.dto.response.food.FoodTagResponse;

import java.util.List;

public interface FoodTagService {

    Response<FoodTagResponse> createFoodTag(FoodTagRequest foodTagRequest);
    Response<FoodTagResponse> updateFoodTag(Long foodTagId, FoodTagRequest foodTagRequest);
    Response<Boolean> deleteFoodTag(Long foodTagId);
    Response<FoodTagResponse> getFoodTagById(Long foodTagId);
    Response<List<FoodTagResponse>> getAllFoodTagsForUser(Long userId);



}
