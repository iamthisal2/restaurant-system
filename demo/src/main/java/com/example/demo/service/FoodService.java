package com.example.demo.service;

import com.example.demo.dto.FoodDTO;
import java.util.List;

public interface FoodService {
    List<FoodDTO> getAllFoods();
    FoodDTO getFoodById(Long id);
    FoodDTO createFood(FoodDTO foodDTO);
    FoodDTO updateFood(Long id, FoodDTO foodDTO);
    void deleteFood(Long id);
}

