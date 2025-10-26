package com.sliit.crave.dto.request.reservation;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@Builder
public class AdminReservationRequest {
    private String customerName;
    private String customerEmail;
    private int numberOfGuests;
    private LocalDate reservationDate;
    private LocalTime reservationTime;
    private String status;
    private Long tableId;
}
