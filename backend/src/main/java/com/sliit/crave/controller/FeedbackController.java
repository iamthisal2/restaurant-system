package com.sliit.crave.controller;


import com.sliit.crave.config.CustomUserDetails;
import com.sliit.crave.dto.request.feedback.FeedBackResponseRequest;
import com.sliit.crave.dto.request.feedback.FeedbackRequest;
import com.sliit.crave.dto.response.Response;
import com.sliit.crave.dto.response.feedback.FeedbackDTO;
import com.sliit.crave.dto.response.feedback.FeedbackResponseDTO;
import com.sliit.crave.dto.response.order.OrderResponse;
import com.sliit.crave.service.FeedBackService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;


@RestController
@RequestMapping("/api/feedbacks")
public class FeedbackController {

    private final FeedBackService feedbackService;

    @Autowired
    public FeedbackController(FeedBackService feedbackService) {
        this.feedbackService = feedbackService;
    }

    @PostMapping
    public ResponseEntity<Response<FeedbackDTO>> createFeedback(@RequestBody FeedbackRequest request) {
        Response<FeedbackDTO> response = feedbackService.createFeedback(request);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @GetMapping("/me")
    public ResponseEntity<Response<List<FeedbackDTO>>> getFeedBacksByUser(@AuthenticationPrincipal CustomUserDetails userDetails) {
        Response<List<FeedbackDTO>> response = feedbackService.getFeedBacksByUserId(userDetails.getUser().getId());
        return new ResponseEntity<>(response, response.getStatus());
    }


    @GetMapping
    public ResponseEntity<Response<List<FeedbackDTO>>> getAllFeedbacks() {
        Response<List<FeedbackDTO>> response = feedbackService.getAllFeedBacks();
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @GetMapping("/{feedbackId}")
    public ResponseEntity<Response<FeedbackDTO>> getFeedbackById(@PathVariable Long feedbackId) {
        Response< FeedbackDTO> response = feedbackService.getFeedBackById(feedbackId);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @PutMapping("/{feedBackId}")
    public ResponseEntity<Response<FeedbackDTO> > updateFeedback(@PathVariable Long feedBackId, @RequestBody FeedbackRequest feedbackDto) {
        Response<FeedbackDTO> response = feedbackService.updateFeedback(feedBackId, feedbackDto);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @DeleteMapping("/{feedBackId}")
    public ResponseEntity<Response<Void>> deleteFeedback(@PathVariable Long feedBackId) {
        Response<Void> response = feedbackService.deleteFeedback(feedBackId);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @PostMapping("/{feedbackId}/response")
    public ResponseEntity<Response<FeedbackResponseDTO>> addResponse(@PathVariable Long feedbackId, @RequestBody FeedBackResponseRequest request) {
        Response<FeedbackResponseDTO> response = feedbackService.addResponse(feedbackId, request);
        return ResponseEntity.status(response.getStatus()).body(response);
    }
}
