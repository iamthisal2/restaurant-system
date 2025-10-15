package com.example.demo.Reservation.dto;

import java.time.LocalDate;
import java.time.LocalTime;

public class ReservationDto {
    private String customerName;
    private String customerEmail;
    private LocalDate reservationDate;
    private LocalTime reservationTime;
    private int numberOfGuests;
    private Long userId; // ADDED

    // Getters and Setters
    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }
    public String getCustomerEmail() { return customerEmail; }
    public void setCustomerEmail(String customerEmail) { this.customerEmail = customerEmail; }
    public LocalDate getReservationDate() { return reservationDate; }
    public void setReservationDate(LocalDate reservationDate) { this.reservationDate = reservationDate; }
    public LocalTime getReservationTime() { return reservationTime; }
    public void setReservationTime(LocalTime reservationTime) { this.reservationTime = reservationTime; }
    public int getNumberOfGuests() { return numberOfGuests; }
    public void setNumberOfGuests(int numberOfGuests) { this.numberOfGuests = numberOfGuests; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
}