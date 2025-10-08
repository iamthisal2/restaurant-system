package com.example.demo.service;

import com.example.demo.dto.FoodDTO;
import com.example.demo.model.Food;
import com.example.demo.repository.FoodRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class FoodServiceImpl implements FoodService {

    @Autowired
    private FoodRepository foodRepository;

    // Convert entity to DTO
    private FoodDTO toDto(Food food) {
        return new FoodDTO(
                food.getId(),
                food.getName(),
                food.getPrice(),
                food.getDescription(),
                food.getCategory() // include category
        );
    }

    // Convert DTO to entity
    private Food toEntity(FoodDTO dto) {
        Food food = new Food();
        food.setId(dto.getId());
        food.setName(dto.getName());
        food.setPrice(dto.getPrice());
        food.setDescription(dto.getDescription());
        food.setCategory(dto.getCategory()); // include category
        return food;
    }

    @Override
    public List<FoodDTO> getAllFoods() {
        return foodRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public FoodDTO getFoodById(Long id) {
        Food food = foodRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Food not found"));
        return toDto(food);
    }

    @Override
    public FoodDTO createFood(FoodDTO foodDTO) {
        Food food = toEntity(foodDTO);
        food.setId(null); // ensure ID is null so it auto-generates
        Food saved = foodRepository.save(food);
        return toDto(saved);
    }

    @Override
    public FoodDTO updateFood(Long id, FoodDTO foodDTO) {
        Food existing = foodRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Food not found"));
        existing.setName(foodDTO.getName());
        existing.setPrice(foodDTO.getPrice());
        existing.setDescription(foodDTO.getDescription());
        existing.setCategory(foodDTO.getCategory()); // update category
        Food updated = foodRepository.save(existing);
        return toDto(updated);
    }

    @Override
    public void deleteFood(Long id) {
        if (!foodRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Food not found");
        }
        foodRepository.deleteById(id);
    }
}


