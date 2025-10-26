package com.sliit.crave.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;


import java.time.LocalDateTime;

@Entity
@Table(name = "feedback_responses")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FeedbackResponse {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "response_text", nullable = false, columnDefinition = "TEXT")
    private String responseText;

    @Column(name = "response_author", nullable = false)
    private String responseAuthor = "Admin";

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "feedback_id", nullable = false)
    @JsonIgnore
    private Feedback feedback;

    @PrePersist
    public void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }

//    public FeedbackResponse(Feedback feedback) {
//        this.feedback = feedback;
//    }
//
//    public FeedbackResponse(){
//
//    }
}
