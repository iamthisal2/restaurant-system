package com.example.demo.Reservation.service;

import com.example.demo.Reservation.dto.ReservationDto;
import com.example.demo.Reservation.entity.Reservation;
import com.example.demo.Reservation.repo.ReservationRepository;
// You will need to import your User and UserRepository
import com.example.demo.user.entity.User;
import com.example.demo.user.repo.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ReservationService {

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private UserRepository userRepository; // ADDED dependency

    public Reservation createReservation(ReservationDto reservationDto) {
        User user = userRepository.findById(reservationDto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Reservation reservation = new Reservation();
        reservation.setCustomerName(reservationDto.getCustomerName());
        reservation.setCustomerEmail(reservationDto.getCustomerEmail());
        reservation.setReservationDate(reservationDto.getReservationDate());
        reservation.setReservationTime(reservationDto.getReservationTime());
        reservation.setNumberOfGuests(reservationDto.getNumberOfGuests());
        reservation.setUser(user); // ADDED: Link the reservation to the user

        return reservationRepository.save(reservation);
    }
    
    // ADD THIS METHOD
    public Reservation updateReservationStatus(Long id, String status) {
        Reservation reservation = reservationRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Reservation not found with id: " + id));
        reservation.setStatus(status);
        return reservationRepository.save(reservation);
    }
}