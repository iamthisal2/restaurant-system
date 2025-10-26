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


    @Value("${app.admin.email}")
    private String AdminEmail;

    @Value("${app.admin.password}")
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

    private void seedRestaurantTables() {
        // Only seed if table list is empty
        if (restaurantTableRepository.count() > 0) {
            System.out.println("✅ Restaurant tables already seeded.");
            return;
        }

        List<RestaurantTable> tables = Arrays.asList(
                RestaurantTable.builder().tableNumber("T1").capacity(2).build(),
                RestaurantTable.builder().tableNumber("T2").capacity(4).build(),
                RestaurantTable.builder().tableNumber("T3").capacity(6).build(),
                RestaurantTable.builder().tableNumber("T4").capacity(8).build(),
                RestaurantTable.builder().tableNumber("T5").capacity(2).build(),
                RestaurantTable.builder().tableNumber("T6").capacity(6).build(),
                RestaurantTable.builder().tableNumber("T7").capacity(8).build(),
                RestaurantTable.builder().tableNumber("T8").capacity(2).build(),
                RestaurantTable.builder().tableNumber("T9").capacity(6).build(),
                RestaurantTable.builder().tableNumber("T10").capacity(6).build(),
                RestaurantTable.builder().tableNumber("T11").capacity(2).build(),
                RestaurantTable.builder().tableNumber("T12").capacity(6).build(),
                RestaurantTable.builder().tableNumber("T13").capacity(8).build(),
                RestaurantTable.builder().tableNumber("T14").capacity(2).build(),
                RestaurantTable.builder().tableNumber("T15").capacity(8).build(),
                RestaurantTable.builder().tableNumber("T16").capacity(2).build(),
                RestaurantTable.builder().tableNumber("T17").capacity(6).build(),
                RestaurantTable.builder().tableNumber("T18").capacity(2).build(),
                RestaurantTable.builder().tableNumber("T19").capacity(8).build(),
                RestaurantTable.builder().tableNumber("T20").capacity(2).build()
        );

        restaurantTableRepository.saveAll(tables);
        System.out.println("🍽️ Restaurant tables seeded successfully!");
    }
}
