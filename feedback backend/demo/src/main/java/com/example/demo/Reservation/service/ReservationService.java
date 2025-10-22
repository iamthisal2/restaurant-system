package com.example.demo.Reservation.service;

import com.example.demo.Reservation.dto.ReservationDto;
import com.example.demo.Reservation.entity.Reservation;
import com.example.demo.Reservation.repo.ReservationRepository;
import com.example.demo.user.entity.User;
import com.example.demo.user.repo.UserRepository;
import com.example.demo.tables.entity.Tables;
import com.example.demo.tables.repo.TableRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class ReservationService {

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private UserRepository userRepository; 

    @Autowired
    private TableRepository tableRepository;

    // Create a new reservation
    public Reservation createReservation(ReservationDto reservationDto) {
        // Handle user differently - if userId is provided, find user, otherwise set to null
        User user = null;
        if (reservationDto.getUserId() != null) {
            user = userRepository.findById(reservationDto.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found"));
        }

        LocalDate date = reservationDto.getReservationDate();
        LocalTime startTime = reservationDto.getReservationTime();
        int guests = reservationDto.getNumberOfGuests();

        List<Tables> suitableTables = tableRepository.findByCapacityGreaterThanEqual(guests);
        if (suitableTables.isEmpty()) {
            throw new RuntimeException("No tables available for the number of guests.");
        }

        // Try to find a free table at the requested time
        for (Tables table : suitableTables) {
            List<Reservation> overlapping = reservationRepository.findOverlappingReservations(
                    date, startTime, startTime.plusHours(2), List.of(table.getId())
            );
            if (overlapping.isEmpty()) {
                Reservation reservation = new Reservation();
                reservation.setCustomerName(reservationDto.getCustomerName());
                reservation.setCustomerEmail(reservationDto.getCustomerEmail());
                reservation.setReservationDate(date);
                reservation.setReservationTime(startTime);
                reservation.setNumberOfGuests(guests);
                reservation.setUser(user); // This can be null for admin-created reservations
                
                // Set status from DTO (if provided by admin) or default to "Pending"
                if (reservationDto.getStatus() != null && !reservationDto.getStatus().isEmpty()) {
                    reservation.setStatus(reservationDto.getStatus());
                } else {
                    reservation.setStatus("Pending"); // Default for user-created reservations
                }
                
                reservation.setTable(table);
                return reservationRepository.save(reservation);
            }
        }

        // If no table is free, suggest next available slots
        List<LocalTime> availableSlots = getAvailableTimeSlots(date, guests);
        throw new RuntimeException("No tables available at the requested time. Next available times: " + availableSlots);
    }

    // ... rest of your service methods remain the same
    public Reservation updateReservationStatus(Long reservationId, String newStatus) {
        Reservation existingReservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new RuntimeException("Reservation not found"));
        
        existingReservation.setStatus(newStatus);
        return reservationRepository.save(existingReservation);
    }

    public Reservation updateReservation(Long reservationId, ReservationDto reservationDto) {
        Reservation existingReservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new RuntimeException("Reservation not found"));

        // Update status if provided
        if (reservationDto.getStatus() != null) {
            existingReservation.setStatus(reservationDto.getStatus());
        }

        // If only updating status, save and return
        if (reservationDto.getStatus() != null && 
            reservationDto.getReservationDate() == null) {
            return reservationRepository.save(existingReservation);
        }

        // Otherwise, process full reservation update
        User user = null;
        if (reservationDto.getUserId() != null) {
            user = userRepository.findById(reservationDto.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found"));
        }

        LocalDate date = reservationDto.getReservationDate();
        LocalTime startTime = reservationDto.getReservationTime();
        int guests = reservationDto.getNumberOfGuests();

        List<Tables> suitableTables = tableRepository.findByCapacityGreaterThanEqual(guests);
        if (suitableTables.isEmpty()) {
            throw new RuntimeException("No tables available for the number of guests.");
        }

        // Try to find a free table excluding the current reservation
        for (Tables table : suitableTables) {
            List<Reservation> overlapping = reservationRepository.findOverlappingReservations(
                    date, startTime, startTime.plusHours(2), List.of(table.getId())
            );
            overlapping.removeIf(r -> r.getId().equals(reservationId));

            if (overlapping.isEmpty()) {
                existingReservation.setCustomerName(reservationDto.getCustomerName());
                existingReservation.setCustomerEmail(reservationDto.getCustomerEmail());
                existingReservation.setReservationDate(date);
                existingReservation.setReservationTime(startTime);
                existingReservation.setNumberOfGuests(guests);
                existingReservation.setUser(user);
                existingReservation.setTable(table);
                return reservationRepository.save(existingReservation);
            }
        }

        // Suggest next available slots
        List<LocalTime> availableSlots = getAvailableTimeSlots(date, guests);
        throw new RuntimeException("No tables available at the requested time. Next available times: " + availableSlots);
    }

    // Get available time slots for a given date and number of guests
    public List<LocalTime> getAvailableTimeSlots(LocalDate date, int guests) {
        List<Tables> suitableTables = tableRepository.findByCapacityGreaterThanEqual(guests);
        List<LocalTime> availableSlots = new ArrayList<>();
        if (suitableTables.isEmpty()) return availableSlots;

        List<Long> tableIds = suitableTables.stream().map(Tables::getId).toList();
        LocalTime open = LocalTime.of(10, 0);
        LocalTime close = LocalTime.of(22, 0);

        for (LocalTime time = open; time.isBefore(close); time = time.plusMinutes(30)) {
            LocalTime endTime = time.plusHours(2);
            List<Reservation> overlapping = reservationRepository.findOverlappingReservations(
                    date, time, endTime, tableIds
            );
            if (overlapping.size() < suitableTables.size()) {
                availableSlots.add(time);
            }
        }
        return availableSlots;
    }
}