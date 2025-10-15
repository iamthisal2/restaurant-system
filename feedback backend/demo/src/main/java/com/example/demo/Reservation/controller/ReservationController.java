package com.example.demo.Reservation.controller;

import com.example.demo.Reservation.dto.ReservationDto;
import com.example.demo.Reservation.entity.Reservation;
import com.example.demo.Reservation.repo.ReservationRepository;
import com.example.demo.Reservation.service.ReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reservations")
public class ReservationController {

    @Autowired
    private ReservationService reservationService; // Inject Service

    @Autowired
    private ReservationRepository reservationRepository; // Keep for simple find/delete

    // Endpoint for a customer to create a new reservation
    @PostMapping
    public Reservation createReservation(@RequestBody ReservationDto reservationDto) {
        return reservationService.createReservation(reservationDto);
    }

    // Endpoint for an admin to get all reservations
    @GetMapping
    public List<Reservation> getAllReservations() {
        return reservationRepository.findAll();
    }

    // Endpoint for a customer to get their own reservations
    @GetMapping("/my-reservations")
    public List<Reservation> getMyReservations(@RequestParam String email) {
        return reservationRepository.findByCustomerEmail(email);
    }
    
    // Endpoint for an admin to update the status of a reservation
    @PutMapping("/{id}")
    public ResponseEntity<Reservation> updateReservationStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        Reservation updatedReservation = reservationService.updateReservationStatus(id, body.get("status"));
        return ResponseEntity.ok(updatedReservation);
    }

    // Endpoint for a customer to delete (cancel) their reservation
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReservation(@PathVariable Long id) {
        reservationRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}