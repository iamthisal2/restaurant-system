package com.sliit.crave.controller;

import com.sliit.crave.dto.request.food.FoodRequest;
import com.sliit.crave.dto.response.Response;
import com.sliit.crave.dto.response.food.FoodResponse;
import com.sliit.crave.service.FoodService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/foods")
public class FoodController {

    private final FoodService foodService;

    @Autowired
    public FoodController(FoodService foodService) {
        this.foodService = foodService;
    }

    @PostMapping
    public ResponseEntity<Response<FoodResponse>> createFood(@RequestBody FoodRequest request) {
        Response<FoodResponse> response = foodService.createFood(request);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @GetMapping
    public ResponseEntity<Response<List<FoodResponse>>> getAllFoods() {
        Response<List<FoodResponse>> response =  foodService.getAllFoods();
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @GetMapping("/{foodId}")
    public ResponseEntity<Response<FoodResponse>> getFoodById(@PathVariable Long foodId) {
        Response<FoodResponse> response =  foodService.getFoodById(foodId);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @PutMapping("/{foodId}")
    public ResponseEntity<Response<FoodResponse>> updateFood(@PathVariable Long foodId, @RequestBody FoodRequest dto) {
        Response<FoodResponse> response =foodService.updateFood(foodId, dto);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Response<Void>> deleteFood(@PathVariable Long id) {
        Response<Void> response = foodService.deleteFood(id);
        return ResponseEntity.status(response.getStatus()).body(response);
    }
}

