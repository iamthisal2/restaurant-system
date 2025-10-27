package com.sliit.crave.controller;


import com.sliit.crave.config.CustomUserDetails;
import com.sliit.crave.dto.request.reservation.ReservationRequest;
import com.sliit.crave.dto.response.Response;
import com.sliit.crave.dto.response.reservation.ReservationResponse;
import com.sliit.crave.dto.response.reservation.RestaurantTableResponse;
import com.sliit.crave.service.ReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reservations")
public class ReservationController {

    @Autowired
    private ReservationService reservationService;

    // Endpoint for a customer to create a new reservation
    @PostMapping
    public ResponseEntity<Response<ReservationResponse>> createReservation(@RequestBody ReservationRequest reservationDto) {
        Response<ReservationResponse> response = reservationService.createReservation(reservationDto);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    // Endpoint for an admin to get all reservations
    @GetMapping

    public ResponseEntity<Response<List<ReservationResponse>>> getAllReservations() {
        Response<List<ReservationResponse>> response = reservationService.getAllReservations();
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    // Endpoint for a customer to get their own reservations
    @GetMapping("/my-reservations")
    public ResponseEntity<Response<List<ReservationResponse>>> getMyReservations(@PathVariable Long customerId) {
        Response<List<ReservationResponse>> response = reservationService.getAllReservationsByCustomerId(customerId);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @GetMapping("/customer/{customerId}")
   
    public ResponseEntity<Response<List<ReservationResponse>>> getReservationsForCustomer(@PathVariable Long customerId) {
        Response<List<ReservationResponse>> response = reservationService.getAllReservationsByCustomerId(customerId);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    // Endpoint for a customer to delete (cancel) their reservation
    @DeleteMapping("/{reservationId}")
    public ResponseEntity<Void> deleteReservation(@PathVariable Long reservationId) {
        Response<Void> response = reservationService.deleteReservation(reservationId);
        return ResponseEntity.status(response.getStatus()).build();
    }

    @GetMapping("/available-times")
    public ResponseEntity<Response<List<LocalTime>>> getAvailableTimes(
            @RequestParam String date,
            @RequestParam int guests) {

        LocalDate localDate = LocalDate.parse(date);
        Response<List<LocalTime>> response = reservationService.findAvailableTimeSlots(localDate, guests);
        return ResponseEntity.status(response.getStatus()).body(response);

    }

    @GetMapping("/available-tables")
    public ResponseEntity<Response<List<RestaurantTableResponse>>> getAvailableTables(
            @RequestParam String date,
            @RequestParam String time,
            @RequestParam int guests) {

        LocalDate localDate = LocalDate.parse(date);
        LocalTime localTime = LocalTime.parse(time);
        Response<List<RestaurantTableResponse>> response = reservationService.findAvailableTables(localDate, localTime, guests);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @PutMapping("/{reservationId}")
    public ResponseEntity<?> updateReservation(@PathVariable Long reservationId, @RequestBody ReservationRequest reservationDto) {
        Response<ReservationResponse> response = reservationService.updateReservation(reservationId, reservationDto);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    // ADD: New endpoint for status updates only
    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateReservationStatus(@PathVariable Long id, @RequestBody Map<String, String> statusUpdate) {
        String newStatus = statusUpdate.get("status");
        Response<ReservationResponse> response =  reservationService.updateReservationStatus(id, newStatus);
        return ResponseEntity.status(response.getStatus()).body(response);
    }

    @GetMapping("/tables")
    public  ResponseEntity<Response<List<RestaurantTableResponse>>> getTables() {
        Response<List<RestaurantTableResponse>> response = reservationService.getAllTables();
        return ResponseEntity.status(response.getStatus()).body(response);

    }


}