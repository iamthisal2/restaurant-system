package com.sliit.crave.service;


import com.sliit.crave.dto.request.feedback.FeedBackResponseRequest;
import com.sliit.crave.dto.request.feedback.FeedbackRequest;
import com.sliit.crave.dto.response.Response;
import com.sliit.crave.dto.response.feedback.FeedbackDTO;
import com.sliit.crave.dto.response.feedback.FeedbackResponseDTO;

import java.util.List;

public interface FeedBackService {
    Response<FeedbackDTO> createFeedback(FeedbackRequest feedbackDto);
    Response<List<FeedbackDTO>> getAllFeedBacks();
    Response<FeedbackDTO> getFeedBackById(Long feedBackId);
    Response<FeedbackDTO> updateFeedback(Long feedBackId, FeedbackRequest feedbackDto);
    Response<Void> deleteFeedback(Long feedBackId);
    Response<FeedbackResponseDTO> addResponse(Long feedbackId, FeedBackResponseRequest request);
    Response<List<FeedbackDTO>> getFeedBacksByUserId(Long userId);

}
