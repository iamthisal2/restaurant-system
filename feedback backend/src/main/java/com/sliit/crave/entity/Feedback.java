package com.sliit.crave.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "feedbacks")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Feedback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(nullable = false)
    private int rating;

    // Many feedback entries can belong to one user
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;

    // One feedback can have one response (from admin)
    @OneToOne(mappedBy = "feedback", cascade = CascadeType.ALL, orphanRemoval = true)
    private FeedbackResponse response;

    @Column(name = "submitted_date", nullable = false)
    private LocalDate submittedDate;

    @PrePersist
    public void onCreate() {
        if (submittedDate == null) {
            submittedDate = LocalDate.now();
        }
    }

//    public Feedback(String content, int rating, User user) {
//        this.content = content;
//        this.rating = rating;
//        this.user = user;
//        this.submittedDate = LocalDate.now();
//    }
//
//    public Feedback(){}
}
