package com.example.demo.controller;

import com.example.demo.dto.FoodDTO;
import com.example.demo.service.FoodService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/foods")
public class FoodController {

    @Autowired
    private FoodService foodService;

    @GetMapping
    public List<FoodDTO> getAllFoods() {
        return foodService.getAllFoods();
    }

    @GetMapping("/{id}")
    public FoodDTO getFoodById(@PathVariable Long id) {
        return foodService.getFoodById(id);
    }

    @PostMapping
    public ResponseEntity<FoodDTO> createFood(@RequestBody FoodDTO dto) {
        FoodDTO created = foodService.createFood(dto);
        return ResponseEntity.status(201).body(created);
    }

    @PutMapping("/{id}")
    public FoodDTO updateFood(@PathVariable Long id, @RequestBody FoodDTO dto) {
        return foodService.updateFood(id, dto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFood(@PathVariable Long id) {
        foodService.deleteFood(id);
        return ResponseEntity.noContent().build();
    }
}

