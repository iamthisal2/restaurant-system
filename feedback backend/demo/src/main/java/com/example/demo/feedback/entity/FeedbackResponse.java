package com.example.demo.feedback.entity;

import jakarta.persistence.*;
import java.time.LocalDate; // CHANGED

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "feedback_responses")
public class FeedbackResponse {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "TEXT")
    private String responseText;

    private String responseAuthor = "Admin";

    private LocalDate createdAt = LocalDate.now(); // CHANGED

    @OneToOne
    @JoinColumn(name = "feedback_id", referencedColumnName = "id")
    @JsonIgnore
    private Feedback feedback;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getResponseText() { return responseText; }
    public void setResponseText(String responseText) { this.responseText = responseText; }
    public String getResponseAuthor() { return responseAuthor; }
    public void setResponseAuthor(String responseAuthor) { this.responseAuthor = responseAuthor; }
    public LocalDate getCreatedAt() { return createdAt; } // CHANGED
    public void setCreatedAt(LocalDate createdAt) { this.createdAt = createdAt; } // CHANGED
    public Feedback getFeedback() { return feedback; }
    public void setFeedback(Feedback feedback) { this.feedback = feedback; }
}