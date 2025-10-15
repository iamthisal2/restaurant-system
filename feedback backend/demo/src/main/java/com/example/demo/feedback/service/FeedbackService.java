package com.example.demo.feedback.service;

import com.example.demo.feedback.dto.FeedbackDto;
import com.example.demo.feedback.entity.Feedback;
import com.example.demo.feedback.repo.FeedbackRepository;
// You will need to import your User and UserRepository
import com.example.demo.user.entity.User;
import com.example.demo.user.repo.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate; // ADDED
import java.util.List;
import java.util.Optional;
import com.example.demo.user.entity.User;

@Service
public class FeedbackService {

    @Autowired
    private FeedbackRepository feedbackRepository;

    @Autowired
    private UserRepository userRepository; // ADDED dependency

    public List<Feedback> getAllFeedbacks() {
        return feedbackRepository.findAll();
    }

    public Feedback createFeedback(FeedbackDto feedbackDto) {
        // Find the user by the ID from the DTO
        User user = userRepository.findById(feedbackDto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Feedback feedback = new Feedback();
        feedback.setAuthorName(feedbackDto.getAuthorName());
        feedback.setEmail(feedbackDto.getEmail());
        feedback.setContent(feedbackDto.getContent());
        feedback.setRating(feedbackDto.getRating());
        feedback.setSubmittedDate(LocalDate.now()); // ADDED: Set current date
        feedback.setUser(user); // ADDED: Link the feedback to the user

        return feedbackRepository.save(feedback);
    }
    
    // ADD THIS METHOD
public Optional<Feedback> getFeedbackById(Long id) {
    return feedbackRepository.findById(id);
}

// ADD THIS METHOD
public Feedback updateFeedback(Long id, FeedbackDto feedbackDto) {
    Feedback existingFeedback = feedbackRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Feedback not found with id: " + id));
    existingFeedback.setAuthorName(feedbackDto.getAuthorName());
    existingFeedback.setEmail(feedbackDto.getEmail());
    existingFeedback.setContent(feedbackDto.getContent());
    existingFeedback.setRating(feedbackDto.getRating());
    return feedbackRepository.save(existingFeedback);
}

// ADD THIS METHOD
public void deleteFeedback(Long id) {
    feedbackRepository.deleteById(id);
}
}