package com.example.login.controller;

import com.example.login.dto.request.FoodTag.FoodTagRequest;
import com.example.login.dto.response.Response;
import com.example.login.dto.response.FoodTag.FoodTagResponse;
import com.example.login.service.FoodTagService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/users/food-tags")
@RequiredArgsConstructor
public class FoodTagController {

    private final FoodTagService foodTagService;

    // POST /api/users/food-tags
    @PostMapping
    public ResponseEntity<Response<FoodTagResponse>> addTag(@RequestBody FoodTagRequest request) {
        Response<FoodTagResponse> response = foodTagService.createFoodTag(request);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    // GET /api/users/food-tags?userId=1
    @GetMapping("{userId}")
    public ResponseEntity<Response<List<FoodTagResponse>>> getTagsForUser(@PathVariable Long userId) {
        Response<List<FoodTagResponse>> response = foodTagService.getAllFoodTagsForUser(userId);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    // PUT /api/users/food-tags/{id}
    @PutMapping("/{foodId}")
    public ResponseEntity<Response<FoodTagResponse>> updateTag(@PathVariable Long foodId, @RequestBody FoodTagRequest request) {
        Response<FoodTagResponse> response = foodTagService.updateFoodTag(foodId, request);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    // DELETE /api/users/food-tags/{id}
    @DeleteMapping("/{foodId}")
    public ResponseEntity<Response<Boolean>> deleteTag(@PathVariable Long foodId) {
        Response<Boolean> response = foodTagService.deleteFoodTag(foodId);
        return ResponseEntity.status(response.getStatus()).body(response);
    }
}
