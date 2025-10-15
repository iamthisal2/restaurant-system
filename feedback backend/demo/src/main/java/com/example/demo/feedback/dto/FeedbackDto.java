package com.example.demo.feedback.dto;

public class FeedbackDto {

    private String authorName;
    private String email;
    private String content;
    private int rating;
    private Long userId; // ADDED

    // Getters and Setters
    public String getAuthorName() { return authorName; }
    public void setAuthorName(String authorName) { this.authorName = authorName; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public int getRating() { return rating; }
    public void setRating(int rating) { this.rating = rating; }
    public Long getUserId() { return userId; } // ADDED
    public void setUserId(Long userId) { this.userId = userId; } // ADDED
}