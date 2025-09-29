package com.example.login.repo;

import com.example.login.entity.FoodTag;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FoodTagRepository extends JpaRepository<FoodTag, Long> {
    List<FoodTag> findByUserId(Long userId);
}
