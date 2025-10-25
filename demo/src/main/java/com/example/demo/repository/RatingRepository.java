package com.example.demo.repository;

import com.example.demo.entity.Rating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RatingRepository extends JpaRepository<Rating, Long> {

    // Find all ratings for a specific food
    List<Rating> findAllByFoodId(Long foodId);

    // Calculate average rating for a food
    @Query("SELECT AVG(r.ratingScore) FROM Rating r WHERE r.food.id = :foodId")
    Double getAverageRatingForFood(@Param("foodId") Long foodId);

    // Count total ratings for a food
    @Query("SELECT COUNT(r) FROM Rating r WHERE r.food.id = :foodId")
    Long getTotalRatingsForFood(@Param("foodId") Long foodId);
}
