package com.sliit.crave.dto.response.reservation;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@Builder
public class ReservationResponse {
    private Long id;
    private Long customerId;
    private String customerName;
    private String customerEmail;
    private int numberOfGuests;
    private LocalDate reservationDate;
    private LocalTime reservationTime;
    private String status;
    private Long tableId;
    private String tableNumber;
    private LocalDate createdAt;
}
