package com.example.login.service;

import com.example.login.dto.response.FoodTag.FoodTagResponse; // ✅ updated to match folder structure
import com.example.login.entity.FoodTag;
import com.example.login.repo.FoodTagRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FoodTagServiceImpl {

    private final FoodTagRepository repository;
    private final ModelMapper mapper;

    // Get all tags for a user
    public List<FoodTagResponse> getTagsByUser(Long userId) {
        return repository.findByUserId(userId)
                .stream()
                .map(tag -> mapper.map(tag, FoodTagResponse.class))
                .collect(Collectors.toList());
    }

    // Add a new tag
    public FoodTagResponse addTag(FoodTagResponse dto) {
        FoodTag tag = mapper.map(dto, FoodTag.class);
        FoodTag saved = repository.save(tag);
        return mapper.map(saved, FoodTagResponse.class);
    }

    // Update a tag
    public FoodTagResponse updateTag(Long id, FoodTagResponse dto) {
        FoodTag existing = repository.findById(id).orElseThrow(() -> new RuntimeException("Tag not found"));
        existing.setTag(dto.getTag());
        FoodTag updated = repository.save(existing);
        return mapper.map(updated, FoodTagResponse.class);
    }

    // Delete a tag
    public void deleteTag(Long id) {
        repository.deleteById(id);
    }
}
