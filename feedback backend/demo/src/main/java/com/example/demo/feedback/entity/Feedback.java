package com.example.demo.feedback.entity;

import jakarta.persistence.*;

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

    // Default constructor is required by JPA
    public Feedback() {}

    // Constructor for creating new feedbacks
    public Feedback(String authorName, String email, String content, int rating) {
        this.authorName = authorName;
        this.email = email;
        this.content = content;
        this.rating = rating;
    }

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
}
