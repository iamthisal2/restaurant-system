package com.example.login.entity;


import com.example.login.enums.Role;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    private Role role; // "USER" or "ADMIN"

    private boolean isDisabled =  false;

    private LocalDateTime createdDate;

    private LocalDateTime updatedDate;

    @PrePersist
    public void prePersist() {
        this.createdDate = LocalDateTime.now();
        this.updatedDate = LocalDateTime.now();
    }


    @PreUpdate
    public void preUpdate() {
        this.updatedDate = LocalDateTime.now();
    }

//    public  User(Long id, String name, String email, String password, Role role) {
//        this.id = id;
//        this.name = name;
//        this.email = email;
//        this.password = password;
//        this.role = role;
//    }
//
//    public User() {}
}

