package com.sliit.crave.service.impl;


import com.sliit.crave.dto.request.reservation.AdminReservationRequest;
import com.sliit.crave.dto.request.reservation.ReservationRequest;
import com.sliit.crave.dto.response.Response;
import com.sliit.crave.dto.response.reservation.ReservationResponse;
import com.sliit.crave.dto.response.reservation.RestaurantTableResponse;
import com.sliit.crave.entity.Reservation;
import com.sliit.crave.entity.RestaurantTable;
import com.sliit.crave.entity.User;
import com.sliit.crave.enums.ReservationStatus;
import com.sliit.crave.enums.Role;
import com.sliit.crave.repo.ReservationRepository;
import com.sliit.crave.repo.RestaurantTableRepository;
import com.sliit.crave.repo.UserRepository;
import com.sliit.crave.service.ReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class ReservationServiceImpl implements ReservationService {
    private final ReservationRepository reservationRepository;
    private final UserRepository userRepository;
    private final RestaurantTableRepository restaurantTableRepository;

    @Autowired
    public ReservationServiceImpl(ReservationRepository reservationRepository, UserRepository userRepository, RestaurantTableRepository restaurantTableRepository) {
        this.reservationRepository = reservationRepository;
        this.userRepository = userRepository;
        this.restaurantTableRepository = restaurantTableRepository;
    }

    @Override
    public Response<ReservationResponse> createReservation(ReservationRequest request) {
        try {
            User customer = userRepository.findById(request.getCustomerId())
                    .orElseThrow(() -> new RuntimeException("Customer not found"));

            LocalDate date = request.getReservationDate();
            LocalTime startTime = request.getReservationTime();
            int guests = request.getNumberOfGuests();
            Long tableId = request.getTableId();

            // Validate that table ID is provided
            if (tableId == null) {
                throw new RuntimeException("Table ID is required");
            }

            // Get the specific table
            RestaurantTable table = restaurantTableRepository.findById(tableId)
                    .orElseThrow(() -> new RuntimeException("Table not found"));

            // Check if table has sufficient capacity
            if (table.getCapacity() < guests) {
                throw new RuntimeException("Table capacity is insufficient for the number of guests");
            }

            // Check if the table is available at the requested time
            List<Reservation> overlapping = reservationRepository.findOverlappingReservations(
                    date, startTime, startTime.plusHours(2), List.of(tableId)
            );

            if (!overlapping.isEmpty()) {
                throw new RuntimeException("The selected table is not available at the requested time");
            }

            // Create the reservation
            Reservation reservation = new Reservation();
            reservation.setCustomer(customer);
            reservation.setReservationDate(date);
            reservation.setReservationTime(startTime);
            reservation.setNumberOfGuests(guests);
            reservation.setTable(table);

            if (request.getStatus() != null && !request.getStatus().isEmpty()) {
                reservation.setStatus(ReservationStatus.valueOf(request.getStatus()));
            } else {
                reservation.setStatus(ReservationStatus.PENDING);
            }

            reservation = reservationRepository.save(reservation);

            ReservationResponse response = ReservationResponse.builder()
                    .id(reservation.getId())
                    .customerId(customer.getId())
                    .customerName(customer.getName())
                    .numberOfGuests(guests)
                    .reservationDate(date)
                    .reservationTime(startTime)
                    .status(reservation.getStatus().name())
                    .tableId(table.getId())
                    .tableNumber(table.getTableNumber())
                    .build();

            return Response.successResponse("Reservation created successfully", response, HttpStatus.CREATED);

        } catch (RuntimeException e) {
            return Response.errorResponse(e.getMessage());
        } catch (Exception e) {
            return Response.errorResponse("Failed to create reservation due to an unexpected error " + e.getMessage());
        }
    }

    @Override
    public Response<ReservationResponse> createReservationByAdmin(AdminReservationRequest request) {
        try {
            // Check if user already exists with this email
            User customer = userRepository.findByEmail(request.getCustomerEmail()).orElse(null);
            
            if (customer == null) {
                // Create a temporary user for non-registered customers
                customer = User.builder()
                        .name(request.getCustomerName())
                        .email(request.getCustomerEmail())
                        .password("temp_password_" + System.currentTimeMillis()) // Temporary password
                        .role(Role.USER)
                        .isDisabled(false)
                        .build();
                customer = userRepository.save(customer);
            }

            LocalDate date = request.getReservationDate();
            LocalTime startTime = request.getReservationTime();
            int guests = request.getNumberOfGuests();
            Long tableId = request.getTableId();

            // Validate that table ID is provided
            if (tableId == null) {
                throw new RuntimeException("Table ID is required");
            }

            // Get the specific table
            RestaurantTable table = restaurantTableRepository.findById(tableId)
                    .orElseThrow(() -> new RuntimeException("Table not found"));

            // Check if table has sufficient capacity
            if (table.getCapacity() < guests) {
                throw new RuntimeException("Table capacity is insufficient for the number of guests");
            }

            // Check if the table is available at the requested time
            List<Reservation> overlapping = reservationRepository.findOverlappingReservations(
                    date, startTime, startTime.plusHours(2), List.of(tableId)
            );

            if (!overlapping.isEmpty()) {
                throw new RuntimeException("The selected table is not available at the requested time");
            }

            // Create the reservation
            Reservation reservation = new Reservation();
            reservation.setCustomer(customer);
            reservation.setReservationDate(date);
            reservation.setReservationTime(startTime);
            reservation.setNumberOfGuests(guests);
            reservation.setTable(table);

            if (request.getStatus() != null && !request.getStatus().isEmpty()) {
                reservation.setStatus(ReservationStatus.valueOf(request.getStatus()));
            } else {
                reservation.setStatus(ReservationStatus.PENDING);
            }

            reservation = reservationRepository.save(reservation);

            ReservationResponse response = ReservationResponse.builder()
                    .id(reservation.getId())
                    .customerId(customer.getId())
                    .customerName(customer.getName())
                    .customerEmail(customer.getEmail())
                    .numberOfGuests(guests)
                    .reservationDate(date)
                    .reservationTime(startTime)
                    .status(reservation.getStatus().name())
                    .tableId(table.getId())
                    .tableNumber(table.getTableNumber())
                    .createdAt(reservation.getCreatedAt())
                    .build();

            return Response.successResponse("Reservation created successfully by admin", response, HttpStatus.CREATED);

        } catch (RuntimeException e) {
            return Response.errorResponse(e.getMessage());
        } catch (Exception e) {
            return Response.errorResponse("Failed to create reservation due to an unexpected error " + e.getMessage());
        }
    }

    @Override
    public Response<ReservationResponse> updateReservationStatus(Long reservationId, String newStatus) {
        try {

            Reservation existingReservation = reservationRepository.findById(reservationId)
                    .orElseThrow(() -> new RuntimeException("Reservation not found"));

           if(newStatus == null || newStatus.isEmpty()) {
               throw new RuntimeException("Status must be provided");
           }
           existingReservation.setStatus(ReservationStatus.valueOf(newStatus));
           existingReservation = reservationRepository.save(existingReservation);

              ReservationResponse response = ReservationResponse.builder()
                     .id(existingReservation.getId())
                     .customerId(existingReservation.getCustomer().getId())
                     .customerName(existingReservation.getCustomer().getName())
                      .customerEmail(existingReservation.getCustomer().getEmail())
                     .numberOfGuests(existingReservation.getNumberOfGuests())
                     .reservationDate(existingReservation.getReservationDate())
                     .reservationTime(existingReservation.getReservationTime())
                     .status(existingReservation.getStatus().name())
                      .tableId(existingReservation.getTable().getId())
                      .tableNumber(existingReservation.getTable().getTableNumber())
                      .createdAt(existingReservation.getCreatedAt())
                     .build();

              return Response.successResponse("Reservation status updated successfully", response);
        }catch (RuntimeException e) {
            return Response.errorResponse(e.getMessage());
        } catch (Exception e) {
            return Response.errorResponse("Failed to update reservation status due to an unexpected error " + e.getMessage());
        }
    }

    @Override
    public Response<ReservationResponse> updateReservation(Long reservationId, ReservationRequest request) {
        try {
            Reservation existingReservation = reservationRepository.findById(reservationId)
                    .orElseThrow(() -> new RuntimeException("Reservation not found"));
            // Update fields if provided
            if (request.getNumberOfGuests() > 0) {
                existingReservation.setNumberOfGuests(request.getNumberOfGuests());
            }
            if (request.getReservationDate() != null) {
                existingReservation.setReservationDate(request.getReservationDate());
            }
            if (request.getReservationTime() != null) {
                existingReservation.setReservationTime(request.getReservationTime());
            }
            existingReservation = reservationRepository.save(existingReservation);

            ReservationResponse response = ReservationResponse.builder()
                    .id(existingReservation.getId())
                    .customerId(existingReservation.getCustomer().getId())
                    .customerName(existingReservation.getCustomer().getName())
                    .numberOfGuests(existingReservation.getNumberOfGuests())
                    .reservationDate(existingReservation.getReservationDate())
                    .reservationTime(existingReservation.getReservationTime())
                    .status(existingReservation.getStatus().name())
                    .build();

            return Response.successResponse("Reservation updated successfully", response);
        } catch (RuntimeException e) {
            return Response.errorResponse(e.getMessage());
        } catch (Exception e) {
            return Response.errorResponse("Failed to update reservation due to an unexpected error " + e.getMessage());
        }
    }

    @Override
    public Response<List<ReservationResponse>> getAllReservations() {
        try {
            List<Reservation> reservations = reservationRepository.findAll();
            List<ReservationResponse> responses = new ArrayList<>();
            for (Reservation reservation : reservations) {
                ReservationResponse response = ReservationResponse.builder()
                        .id(reservation.getId())
                        .customerId(reservation.getCustomer().getId())
                        .customerName(reservation.getCustomer().getName())
                        .customerEmail(reservation.getCustomer().getEmail())
                        .numberOfGuests(reservation.getNumberOfGuests())
                        .reservationDate(reservation.getReservationDate())
                        .reservationTime(reservation.getReservationTime())
                        .status(reservation.getStatus().name())
                        .tableId(reservation.getTable().getId())
                        .tableNumber(reservation.getTable().getTableNumber())
                        .createdAt(reservation.getCreatedAt())
                        .build();
                responses.add(response);
            }
            return Response.successResponse("Reservations retrieved successfully", responses);
        } catch (Exception e) {
            return Response.errorResponse("Failed to retrieve reservations due to an unexpected error " + e.getMessage());
        }
    }

    @Override
    public Response<List<ReservationResponse>> getAllReservationsByCustomerId(Long customerId) {
        try {
            List<Reservation> reservations = reservationRepository.findByCustomerId(customerId);
            List<ReservationResponse> responses = new ArrayList<>();
            for (Reservation reservation : reservations) {
                ReservationResponse response = ReservationResponse.builder()
                        .id(reservation.getId())
                        .customerId(reservation.getCustomer().getId())
                        .customerName(reservation.getCustomer().getName())
                        .numberOfGuests(reservation.getNumberOfGuests())
                        .reservationDate(reservation.getReservationDate())
                        .reservationTime(reservation.getReservationTime())
                        .tableId(reservation.getTable().getId())
                        .tableNumber(reservation.getTable().getTableNumber())
                        .createdAt(reservation.getCreatedAt())
                        .status(reservation.getStatus().name())
                        .build();
                responses.add(response);
            }
            return Response.successResponse("Customer reservations retrieved successfully", responses);
        } catch (Exception e) {
            return Response.errorResponse("Failed to retrieve customer reservations due to an unexpected error " + e.getMessage());
        }
    }

    @Override
    public Response<Void> deleteReservation(Long reservationId) {
        try {
            Reservation existingReservation = reservationRepository.findById(reservationId)
                    .orElseThrow(() -> new RuntimeException("Reservation not found"));

            reservationRepository.delete(existingReservation);
            return Response.successResponse("Reservation deleted successfully", null);
        } catch (RuntimeException e) {
            return Response.errorResponse(e.getMessage());
        } catch (Exception e) {
            return Response.errorResponse("Failed to delete reservation due to an unexpected error " + e.getMessage());
        }
    }


    // Get available time slots for a given date and number of guests
    @Override
    public Response<List<LocalTime>> findAvailableTimeSlots(LocalDate date, int guests) {
        try {
            List<RestaurantTable> suitableTables = restaurantTableRepository.findByCapacityGreaterThanEqual(guests);
            List<LocalTime> availableSlots = new ArrayList<>();

            if (suitableTables.isEmpty()) {
                return Response.successResponse("No tables available for the number of guests", availableSlots);
            }

            List<Long> tableIds = suitableTables.stream().map(RestaurantTable::getId).toList();
            LocalTime open = LocalTime.of(10, 0);
            LocalTime close = LocalTime.of(22, 0);

            for (LocalTime time = open; time.isBefore(close.minusHours(2)); time = time.plusMinutes(30)) {
                LocalTime endTime = time.plusHours(2);

                List<Reservation> overlapping = reservationRepository.findOverlappingReservations(
                        date, time, endTime, tableIds
                );

                // Check if there's at least one table that's NOT booked during this time
                Set<Long> bookedTableIds = overlapping.stream()
                        .map(reservation -> reservation.getTable().getId())
                        .collect(Collectors.toSet());

                boolean hasAvailableTable = tableIds.stream()
                        .anyMatch(tableId -> !bookedTableIds.contains(tableId));

                if (hasAvailableTable) {
                    availableSlots.add(time);
                }
            }

            return Response.successResponse("Available time slots retrieved successfully", availableSlots);
        } catch (Exception e) {
            return Response.errorResponse("Failed to retrieve available time slots: " + e.getMessage());
        }
    }

    @Override
    public Response<List<RestaurantTableResponse>> findAvailableTables(LocalDate date, LocalTime time, int guests) {
        try {
            List<RestaurantTable> suitableTables = restaurantTableRepository.findByCapacityGreaterThanEqual(guests);
            List<RestaurantTableResponse> availableTables = new ArrayList<>();

            if (suitableTables.isEmpty()) {
                return Response.successResponse("No tables available for the number of guests", availableTables);
            }

            LocalTime endTime = time.plusHours(2);

            for (RestaurantTable table : suitableTables) {
                List<Reservation> overlapping = reservationRepository.findOverlappingReservations(
                        date, time, endTime, List.of(table.getId())
                );

                if (overlapping.isEmpty()) {
                    availableTables.add(
                            RestaurantTableResponse.builder()
                                    .id(table.getId())
                                    .tableNumber(table.getTableNumber())
                                    .capacity(table.getCapacity())
                                    .build()
                    );
                }
            }

            return Response.successResponse("Available tables retrieved successfully", availableTables);
        } catch (Exception e) {
            return Response.errorResponse("Failed to retrieve available tables: " + e.getMessage());
        }
    }

    @Override
    public Response<List<RestaurantTableResponse>> getAllTables() {
        try {

            List<RestaurantTableResponse> responses = new ArrayList<>();
            for (RestaurantTable restaurantTable : restaurantTableRepository.findAll()) {
                responses.add(
                        RestaurantTableResponse.builder()
                                .id(restaurantTable.getId())
                                .tableNumber(restaurantTable.getTableNumber())
                                .capacity(restaurantTable.getCapacity())
                                .build()
                );
            }
            return Response.successResponse("Tables retrieved successfully", responses);
        } catch (Exception e) {
            return Response.errorResponse("Failed to retrieve tables due to an unexpected error " + e.getMessage());
        }
    }

    private List<LocalTime> getAvailableTimeSlots(LocalDate date, int guests) {
        List<RestaurantTable> suitableTables = restaurantTableRepository.findByCapacityGreaterThanEqual(guests);
        List<LocalTime> availableSlots = new ArrayList<>();
        if (suitableTables.isEmpty()) return availableSlots;

        List<Long> tableIds = suitableTables.stream().map(RestaurantTable::getId).toList();
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