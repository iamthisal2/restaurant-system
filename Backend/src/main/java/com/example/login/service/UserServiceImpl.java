package com.example.login.service;

import com.example.login.entity.User;
import com.example.login.repo.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl {

    private final UserRepository userRepository;

    // Register new user
    public User register(User request) { // ✅ using entity instead of missing DTOs
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        // ✅ Removed confirmPassword check

        // Default role = USER if not provided
        String role = (request.getRole() == null || request.getRole().isEmpty())
                ? "USER"
                : request.getRole();

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(request.getPassword())
                .role(role)
                .build();

        return userRepository.save(user);
    }

    // Login user
    public User login(User request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!user.getPassword().equals(request.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        return user;
    }

    // GET own account
    public User getUserById(Long id, Long loggedInUserId) {
        if (!id.equals(loggedInUserId)) {
            throw new RuntimeException("Access denied: You can only view your own account");
        }

        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // UPDATE own account
    public User updateUser(Long id, Long loggedInUserId, User request) {
        if (!id.equals(loggedInUserId)) {
            throw new RuntimeException("Access denied: You can only update your own account");
        }

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());
        user.setRole(request.getRole() != null ? request.getRole() : user.getRole());

        return userRepository.save(user);
    }

    // DELETE own account
    public void deleteUser(Long id, Long loggedInUserId) {
        if (!id.equals(loggedInUserId)) {
            throw new RuntimeException("Access denied: You can only delete your own account");
        }

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        userRepository.delete(user);
    }
}
