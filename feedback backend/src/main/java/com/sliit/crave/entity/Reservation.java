package com.sliit.crave.entity;


import com.sliit.crave.enums.ReservationStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "reservations")
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "customer_id")
    private User customer;

    private int numberOfGuests;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    private ReservationStatus status = ReservationStatus.PENDING;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "table_id")
    private RestaurantTable table;

    private LocalDate reservationDate;
    private LocalTime reservationTime;

    private LocalDate createdAt;
    private LocalDate updatedAt;

    @PrePersist
    public void prePersist() {
        createdAt = LocalDate.now();
        updatedAt = LocalDate.now();
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDate.now();
    }

//    public Reservation() {
//
//    }

//    public Reservation(User customer, int numberOfGuests, RestaurantTable table, LocalDate reservationDate, LocalTime reservationTime) {
//        this.customer = customer;
//        this.numberOfGuests = numberOfGuests;
//        this.table = table;
//        this.reservationDate = reservationDate;
//        this.reservationTime = reservationTime;
//    }
}