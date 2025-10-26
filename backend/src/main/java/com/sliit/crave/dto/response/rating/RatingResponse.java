package com.sliit.crave.dto.response.rating;


import lombok.Builder;
import lombok.Data;


import java.time.LocalDateTime;

@Data
@Builder
public class RatingResponse {
    private Long id;
    private Long userId;
    private String userName;
    private Long foodId;
    private String foodName;
    private Integer ratingScore;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
