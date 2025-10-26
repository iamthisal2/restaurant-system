package com.sliit.crave.repo;


import com.sliit.crave.entity.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    @Query("SELECT r FROM Reservation r WHERE r.customer.id = :userId")
    List<Reservation> findByCustomerId(@Param("userId") Long userId);

    @Query(value = "SELECT r.* FROM reservations r WHERE r.reservation_date = :date " +
            "AND r.status != 'CANCELLED' " +
            "AND r.reservation_time < :endTime " +
            "AND ADDTIME(r.reservation_time, '02:00:00') > :startTime " +
            "AND r.table_id IN :tableIds", nativeQuery = true)
    List<Reservation> findOverlappingReservations(
            @Param("date") LocalDate date,
            @Param("startTime") LocalTime startTime,
            @Param("endTime") LocalTime endTime,
            @Param("tableIds") List<Long> tableIds
    );
}