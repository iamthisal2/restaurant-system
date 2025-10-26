package com.sliit.crave.seed;

import com.sliit.crave.entity.RestaurantTable;
import com.sliit.crave.entity.User;
import com.sliit.crave.enums.Role;
import com.sliit.crave.repo.RestaurantTableRepository;
import com.sliit.crave.repo.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    @Value("${app.admin.email:admin@test.com}")
    private String AdminEmail;

    @Value("${app.admin.password:admin123}")
    private String AdminPassword;

    private final UserRepository userRepository;
    private final RestaurantTableRepository restaurantTableRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        seedAdminUser();
        seedRestaurantTables();
        
    }

    private void seedAdminUser() {
        if (userRepository.existsByEmail(AdminEmail)) {
            System.out.println("✅ Admin user already exists.");
            return;
        }

        User admin = User.builder()
                .name("Admin")
                .email(AdminEmail)
                .password(passwordEncoder.encode(AdminPassword))
                .role(Role.ADMIN)
                .build();

        userRepository.save(admin);
        System.out.println("🚀 Admin user created successfully!");
    }

    private void seedRestaurantTables() {
        if (restaurantTableRepository.count() > 0) {
            System.out.println("✅ Restaurant tables already seeded.");
            return;
        }

        List<RestaurantTable> tables = Arrays.asList(
                RestaurantTable.builder().tableNumber("T1").capacity(2).build(),
                RestaurantTable.builder().tableNumber("T2").capacity(4).build(),
                RestaurantTable.builder().tableNumber("T3").capacity(6).build(),
                RestaurantTable.builder().tableNumber("T4").capacity(8).build()
                // ... (you can keep the rest as before)
        );

        restaurantTableRepository.saveAll(tables);
        System.out.println("🍽️ Restaurant tables seeded successfully!");
    }

        
}
