package com.example.demo.feedback.repo;

import com.example.demo.feedback.entity.FeedbackResponse;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FeedbackResponseRepository extends JpaRepository<FeedbackResponse, Long> {
}