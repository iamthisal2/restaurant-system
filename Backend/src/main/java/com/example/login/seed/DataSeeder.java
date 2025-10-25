package com.example.login.seed;

import com.example.login.entity.User;
import com.example.login.enums.Role;
import com.example.login.repo.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    @Value("${app.admin.email}")
    private String AdminEmail;

    @Value("${app.admin.password}")
    private String AdminPassword;

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        seedAdminUser();
    }

    private void seedAdminUser() {
        // Check if admin already exists
        if (userRepository.existsByEmail(AdminEmail)) {
            System.out.println("✅ Admin user already exists.");
            return;
        }

        // Create and save admin
        User admin = User.builder()
                .name("Admin")
                .email(AdminEmail)
                .password(passwordEncoder.encode(AdminPassword)) // default password
                .role(Role.ADMIN)
                .build();

        userRepository.save(admin);
        System.out.println("🚀 Admin user created successfully!");
    }
}
