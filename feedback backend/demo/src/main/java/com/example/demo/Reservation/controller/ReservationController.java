package com.example.demo.Reservation.controller;

import com.example.demo.Reservation.dto.ReservationDto;
import com.example.demo.Reservation.entity.Reservation;
import com.example.demo.Reservation.repo.ReservationRepository;
import com.example.demo.Reservation.service.ReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reservations")
@CrossOrigin(origins = "http://localhost:3000", methods = {RequestMethod.PATCH, RequestMethod.OPTIONS})
public class ReservationController {

    @Autowired
    private ReservationService reservationService; 

    @Autowired
    private ReservationRepository reservationRepository; 

    // Endpoint for a customer to create a new reservation
    @PostMapping
    public ResponseEntity<?> createReservation(@RequestBody ReservationDto reservationDto) {
        try {
            Reservation newReservation = reservationService.createReservation(reservationDto);
            return ResponseEntity.status(HttpStatus.CREATED).body(newReservation);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        }
    }

    // Endpoint for an admin to get all reservations
    @GetMapping
    public List<Reservation> getAllReservations() {
        return reservationRepository.findAll();
    }

    // Endpoint for a customer to get their own reservations
    @GetMapping("/my-reservations")
    public List<Reservation> getMyReservations(@RequestParam Long userId) {
        return reservationRepository.findByUserId(userId);
    }
    

    // Endpoint for a customer to delete (cancel) their reservation
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReservation(@PathVariable Long id) {
        reservationRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/available-times")
    public ResponseEntity<List<LocalTime>> getAvailableTimes(
        @RequestParam String date,
        @RequestParam int guests) {

    LocalDate localDate = LocalDate.parse(date);
    List<LocalTime> availableSlots = reservationService.getAvailableTimeSlots(localDate, guests);

    if (availableSlots.isEmpty()) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(availableSlots);
    }

    return ResponseEntity.ok(availableSlots);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateReservation(@PathVariable Long id, @RequestBody ReservationDto reservationDto) {
        try {
            Reservation updatedReservation = reservationService.updateReservation(id, reservationDto);
            return ResponseEntity.ok(updatedReservation);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        }
    }

    // ADD: New endpoint for status updates only
    @PatchMapping("/{id}/status")
public ResponseEntity<?> updateReservationStatus(@PathVariable Long id, @RequestBody Map<String, String> statusUpdate) {
    try {
        System.out.println("=== STATUS UPDATE ENDPOINT HIT ===");
        System.out.println("Reservation ID: " + id);
        System.out.println("Request Body: " + statusUpdate);
        
        String newStatus = statusUpdate.get("status");
        System.out.println("New Status: " + newStatus);
        
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reservation not found"));
        
        System.out.println("Current status: " + reservation.getStatus());
        reservation.setStatus(newStatus);
        
        Reservation updatedReservation = reservationRepository.save(reservation);
        System.out.println("Status updated successfully to: " + updatedReservation.getStatus());
        
        return ResponseEntity.ok(updatedReservation);
    } catch (RuntimeException e) {
        System.out.println("ERROR: " + e.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
    }
}



}