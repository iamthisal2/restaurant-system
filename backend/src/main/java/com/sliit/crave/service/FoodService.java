package com.sliit.crave.service;

import com.sliit.crave.dto.request.food.FoodRequest;
import com.sliit.crave.dto.response.Response;
import com.sliit.crave.dto.response.food.FoodResponse;

import java.util.List;

public interface FoodService {
    Response<List<FoodResponse>> getAllFoods();
    Response<FoodResponse> getFoodById(Long id);
    Response<FoodResponse> createFood(FoodRequest foodDTO);
    Response<FoodResponse> updateFood(Long id, FoodRequest foodDTO);
    Response<Void> deleteFood(Long id);
}

