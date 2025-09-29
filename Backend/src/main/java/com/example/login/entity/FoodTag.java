package com.example.login.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "food_tags")
@Data
public class FoodTag {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String tag;

    // Many tags can belong to one user
    @Column(name = "user_id")
    private Long userId;
}
