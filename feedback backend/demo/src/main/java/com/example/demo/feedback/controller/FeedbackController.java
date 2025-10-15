package com.example.demo.feedback.controller;

import com.example.demo.feedback.dto.FeedbackDto;
import com.example.demo.feedback.entity.Feedback;
import com.example.demo.feedback.repo.FeedbackResponseRepository;
import com.example.demo.feedback.service.FeedbackService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.example.demo.feedback.entity.FeedbackResponse;
import com.example.demo.feedback.repo.FeedbackResponseRepository;
import java.util.Map;
import com.example.demo.feedback.repo.FeedbackRepository;

@RestController
@RequestMapping("/api/feedbacks")
public class FeedbackController {

    private final FeedbackService feedbackService;

    @Autowired
    public FeedbackController(FeedbackService feedbackService) {
        this.feedbackService = feedbackService;
    }

    @Autowired
    private FeedbackRepository feedbackRepository;

    @Autowired
    private FeedbackResponseRepository responseRepository;

    @GetMapping
    public List<Feedback> getAllFeedbacks() {
        return feedbackService.getAllFeedbacks();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Feedback> getFeedbackById(@PathVariable Long id) {
        return feedbackService.getFeedbackById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Feedback createFeedback(@RequestBody FeedbackDto feedbackDto) {
        return feedbackService.createFeedback(feedbackDto);
    }

    @PutMapping("/{id}")
    public Feedback updateFeedback(@PathVariable Long id, @RequestBody FeedbackDto feedbackDto) {
        return feedbackService.updateFeedback(id, feedbackDto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFeedback(@PathVariable Long id) {
        feedbackService.deleteFeedback(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{feedbackId}/response")
    public ResponseEntity<FeedbackResponse> addResponse(@PathVariable Long feedbackId, @RequestBody Map<String, String> body) {
        Feedback feedback = feedbackRepository.findById(feedbackId)
                .orElseThrow(() -> new RuntimeException("Feedback not found"));
        
        FeedbackResponse response = new FeedbackResponse();
        response.setResponseText(body.get("responseText"));
        response.setFeedback(feedback);
        
        FeedbackResponse savedResponse = responseRepository.save(response);
        return ResponseEntity.ok(savedResponse);
    }
}
