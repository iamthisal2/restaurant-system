package com.example.login.controller;

import com.example.login.dto.response.FoodTag.FoodTagResponse; // ✅ matches folder structure
import com.example.login.service.FoodTagService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/users/food-tags")
@RequiredArgsConstructor
public class FoodTagController {

    private final FoodTagService service;

    // GET /api/users/food-tags?userId=1
    @GetMapping
    public ResponseEntity<List<FoodTagResponse>> getTags(@RequestParam Long userId) {
        return ResponseEntity.ok(service.getTagsByUser(userId));
    }

    // POST /api/users/food-tags
    @PostMapping
    public ResponseEntity<FoodTagResponse> addTag(@RequestBody FoodTagResponse dto) {
        return ResponseEntity.ok(service.addTag(dto));
    }

    // PUT /api/users/food-tags/{id}
    @PutMapping("/{id}")
    public ResponseEntity<FoodTagResponse> updateTag(@PathVariable Long id, @RequestBody FoodTagResponse dto) {
        return ResponseEntity.ok(service.updateTag(id, dto));
    }

    // DELETE /api/users/food-tags/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTag(@PathVariable Long id) {
        service.deleteTag(id);
        return ResponseEntity.ok().build();
    }
}
