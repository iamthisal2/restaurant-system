package com.example.demo.feedback.service;

import com.example.demo.feedback.dto.FeedbackDto;
import com.example.demo.feedback.entity.Feedback;
import com.example.demo.feedback.repo.FeedbackRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class FeedbackService {

    private final FeedbackRepository feedbackRepository;

    @Autowired
    public FeedbackService(FeedbackRepository feedbackRepository) {
        this.feedbackRepository = feedbackRepository;
    }

    public List<Feedback> getAllFeedbacks() {
        return feedbackRepository.findAll();
    }

    public Feedback createFeedback(FeedbackDto feedbackDto) {
        // You can add validation logic here before saving
        Feedback feedback = new Feedback(feedbackDto.getAuthorName(), feedbackDto.getEmail(), feedbackDto.getContent(), feedbackDto.getRating());
        return feedbackRepository.save(feedback);
    }

    public Optional<Feedback> getFeedbackById(Long id) {
        return feedbackRepository.findById(id);
    }

    public Feedback updateFeedback(Long id, FeedbackDto feedbackDto) {
        Feedback existingFeedback = feedbackRepository.findById(id).orElseThrow(() -> new RuntimeException("Feedback not found with id: " + id));
        existingFeedback.setAuthorName(feedbackDto.getAuthorName());
        existingFeedback.setEmail(feedbackDto.getEmail());
        existingFeedback.setContent(feedbackDto.getContent());
        existingFeedback.setRating(feedbackDto.getRating());
        return feedbackRepository.save(existingFeedback);
    }

    public void deleteFeedback(Long id) {
        feedbackRepository.deleteById(id);
    }
}
