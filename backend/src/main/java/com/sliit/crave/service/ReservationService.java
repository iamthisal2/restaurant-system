package com.sliit.crave.service;


import com.sliit.crave.dto.request.reservation.AdminReservationRequest;
import com.sliit.crave.dto.request.reservation.ReservationRequest;
import com.sliit.crave.dto.response.Response;
import com.sliit.crave.dto.response.reservation.ReservationResponse;
import com.sliit.crave.dto.response.reservation.RestaurantTableResponse;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface ReservationService {
    Response<ReservationResponse> createReservation(ReservationRequest request);
    Response<ReservationResponse> createReservationByAdmin(AdminReservationRequest request);
    Response<ReservationResponse> updateReservationStatus(Long reservationId, String newStatus);
    Response<ReservationResponse> updateReservation(Long reservationId, ReservationRequest request);
    Response<List<ReservationResponse>> getAllReservations();
    Response<List<ReservationResponse>> getAllReservationsByCustomerId(Long customerId);
    Response<Void> deleteReservation(Long reservationId);
    Response<List<LocalTime>> findAvailableTimeSlots(LocalDate date, int guests);
    Response<List<RestaurantTableResponse>> findAvailableTables(LocalDate date, LocalTime time, int guests);
    Response<List<RestaurantTableResponse>> getAllTables();
}
