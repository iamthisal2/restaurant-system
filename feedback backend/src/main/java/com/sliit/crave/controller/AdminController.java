package com.sliit.crave.controller;

import com.sliit.crave.dto.request.reservation.AdminReservationRequest;
import com.sliit.crave.dto.response.Response;
import com.sliit.crave.dto.response.reservation.ReservationResponse;
import com.sliit.crave.service.ReservationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final ReservationService reservationService;


    @PostMapping("/reservations")
   
    public ResponseEntity<Response<ReservationResponse>> createReservationByAdmin(
            @RequestBody AdminReservationRequest request
    ) {
        Response<ReservationResponse> response = reservationService.createReservationByAdmin(request);
        return new ResponseEntity<>(response, response.getStatus());
    }
}
