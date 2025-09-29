package com.example.login.service;

import com.example.login.dto.FoodTagDTO;
import com.example.login.entity.FoodTag;
import com.example.login.repo.FoodTagRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FoodTagService {

    private final FoodTagRepository repository;
    private final ModelMapper mapper;

    // Get all tags for a user
    public List<FoodTagDTO> getTagsByUser(Long userId) {
        return repository.findByUserId(userId)
                .stream()
                .map(tag -> mapper.map(tag, FoodTagDTO.class))
                .collect(Collectors.toList());
    }

    // Add a new tag
    public FoodTagDTO addTag(FoodTagDTO dto) {
        FoodTag tag = mapper.map(dto, FoodTag.class);
        FoodTag saved = repository.save(tag);
        return mapper.map(saved, FoodTagDTO.class);
    }

    // Update a tag
    public FoodTagDTO updateTag(Long id, FoodTagDTO dto) {
        FoodTag existing = repository.findById(id).orElseThrow(() -> new RuntimeException("Tag not found"));
        existing.setTag(dto.getTag());
        FoodTag updated = repository.save(existing);
        return mapper.map(updated, FoodTagDTO.class);
    }

    // Delete a tag
    public void deleteTag(Long id) {
        repository.deleteById(id);
    }
}
