package com.sliit.crave.dto.response.feedback;

import lombok.Builder;
import lombok.Data;


import java.time.LocalDateTime;

@Data
@Builder
public class FeedbackResponseDTO {
    private Long id;
    private String authorName;
    private String responseText;
    private Long feedbackId;
    private LocalDateTime createdAt;
}