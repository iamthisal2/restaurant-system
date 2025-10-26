package com.sliit.crave.repo;

import com.sliit.crave.entity.FoodTag;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FoodTagRepository extends JpaRepository<FoodTag, Long> {
    List<FoodTag> findByUserId(Long userId);
}
