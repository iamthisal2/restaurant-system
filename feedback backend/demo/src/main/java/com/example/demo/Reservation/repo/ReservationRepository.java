package com.example.demo.Reservation.repo;

import com.example.demo.Reservation.entity.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    // Custom query to find reservations by a customer's email
    List<Reservation> findByCustomerEmail(String email);
}