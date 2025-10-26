package com.sliit.crave.dto.request.rating;

import lombok.Data;

@Data
public class RatingRequest {
    private Long id;
    private Long userId;
    private Long foodId;
    private Integer ratingScore;
}
