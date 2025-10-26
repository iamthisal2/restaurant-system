package com.sliit.crave.dto.request.feedback;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class FeedBackResponseRequest {
    private String responseText;
}
