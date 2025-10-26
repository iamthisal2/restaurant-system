package com.sliit.crave.dto.response.feedback;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class FeedbackDTO {
    private Long id;
    private Long authorId;
    private String authorName;
    private String authorEmail;
    private String content;
    private int rating;
    private LocalDate createdAt;
    private Boolean isResponded;

    private FeedbackResponseDTO response;
}