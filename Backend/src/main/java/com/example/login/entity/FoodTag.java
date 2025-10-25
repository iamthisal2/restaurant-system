package com.example.login.entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "food_tags")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class FoodTag {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String tag;

    // Many tags can belong to one user
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

//    public  FoodTag(String tag, User user) {
//        this.tag = tag;
//        this.user = user;
//    }
//
//    public FoodTag() {
//
//    }
}
