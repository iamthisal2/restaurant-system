package com.sliit.crave.repo;

import com.sliit.crave.entity.Rating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RatingRepository extends JpaRepository<Rating, Long> {

    // Find rating by user and food
    Optional<Rating> findByUserIdAndFoodId(Long userId, Long foodId);

    // Find all ratings for a specific food
    List<Rating> findAllByFoodId(Long foodId);

    // Find all ratings by a specific user
    List<Rating> findAllByUserId(Long userId);

    // Delete rating by user and food
    void deleteByUserIdAndFoodId(Long userId, Long foodId);

    // Check if user has rated a food
    boolean existsByUserIdAndFoodId(Long userId, Long foodId);

    // Calculate average rating for a food
    @Query("SELECT AVG(r.ratingScore) FROM Rating r WHERE r.food.id = :foodId")
    Double getAverageRatingForFood(@Param("foodId") Long foodId);

    // Count total ratings for a food
    @Query("SELECT COUNT(r) FROM Rating r WHERE r.food.id = :foodId")
    Long getTotalRatingsForFood(@Param("foodId") Long foodId);
}
