package com.example.demo.Reservation.repo;

import com.example.demo.Reservation.entity.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    List<Reservation> findByUserId(Long userId);

    @Query("SELECT r FROM Reservation r WHERE r.reservationDate = :date " +
           "AND r.reservationTime < :endTime " +
           "AND r.reservationTime >= :startTime " +
           "AND r.table.id IN :tableIds")
    List<Reservation> findOverlappingReservations(
        @Param("date") LocalDate date,
        @Param("startTime") LocalTime startTime,
        @Param("endTime") LocalTime endTime,
        @Param("tableIds") List<Long> tableIds
    );

    
}