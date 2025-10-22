package com.example.demo.feedback.entity;
import com.fasterxml.jackson.annotation.JsonIgnore; 

import jakarta.persistence.*;
import java.time.LocalDate; 
import com.example.demo.user.entity.User;

@Entity
@Table(name = "feedbacks")
public class Feedback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String authorName;
    private String email;
    private String content;
    private int rating;
    private String adminResponse;

    @Column(name = "submitted_date") // ADDED
    private LocalDate submittedDate;

    // ADDED: Relationship to the User entity
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @JsonIgnore 
    private User user; // Assumes you have a 'User' entity

    @OneToOne(mappedBy = "feedback", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private FeedbackResponse response;

    // Default constructor
    public Feedback() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getAuthorName() { return authorName; }
    public void setAuthorName(String authorName) { this.authorName = authorName; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public int getRating() { return rating; }
    public void setRating(int rating) { this.rating = rating; }
    
    // ADDED Getters and Setters
    public LocalDate getSubmittedDate() { return submittedDate; }
    public void setSubmittedDate(LocalDate submittedDate) { this.submittedDate = submittedDate; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public FeedbackResponse getResponse() { return response; }
    public void setResponse(FeedbackResponse response) { this.response = response; }
    
    public String getDisplayAdminResponse() {
        if (adminResponse != null && !adminResponse.trim().isEmpty()) {
            return adminResponse;
        }
        if (response != null && response.getResponseText() != null) {
            return response.getResponseText();
        }
        return null;
    }


}
