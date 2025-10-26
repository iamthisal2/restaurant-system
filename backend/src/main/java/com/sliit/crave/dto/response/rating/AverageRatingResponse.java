package com.sliit.crave.dto.response.rating;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AverageRatingResponse {
    private Double averageRating;
    private Long totalRatings;

}
