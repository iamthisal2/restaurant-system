package com.sliit.crave.dto.request.feedback;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class FeedbackRequest {
    private String content;
    private int rating;
    private Long userId;
}