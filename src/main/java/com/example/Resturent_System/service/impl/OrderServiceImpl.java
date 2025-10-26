package com.example.Resturent_System.service.impl;


import com.sliit.crave.dto.request.order.OrderItemRequest;
import com.sliit.crave.dto.request.order.PlaceOrderRequest;
import com.sliit.crave.dto.response.Response;
import com.sliit.crave.dto.response.order.OrderItemResponse;
import com.sliit.crave.dto.response.order.OrderResponse;
import com.sliit.crave.entity.*;
import com.sliit.crave.enums.ReservationStatus;
import com.sliit.crave.repo.FoodRepository;
import com.sliit.crave.repo.OrderRepository;
import com.sliit.crave.repo.UserRepository;
import com.sliit.crave.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final FoodRepository foodRepository;

    @Override
    @Transactional
    public Response<OrderResponse> placeOrder(PlaceOrderRequest request) {
        try {
            User user = userRepository.findById(request.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Order order = new Order();
            order.setUser(user);
            order.setStatus(ReservationStatus.PENDING);
            order.setDeliveryAddress(request.getDeliveryAddress());
            order.setContactNumber(request.getContactNumber());

            double totalAmount = 0.0;

            for (OrderItemRequest itemReq : request.getItems()) {
                Food food = foodRepository.findById(itemReq.getFoodId())
                        .orElseThrow(() -> new RuntimeException("Food not found"));

                double itemTotal = food.getPrice() * itemReq.getQuantity();
                totalAmount += itemTotal;

                OrderItem item = OrderItem.builder()
                        .order(order)
                        .food(food)
                        .quantity(itemReq.getQuantity())
                        .priceAtPurchase(food.getPrice())
                        .build();

                order.getItems().add(item);
            }

            order.setTotalAmount(totalAmount);
            orderRepository.save(order);

            return Response.successResponse("Order placed successfully", mapToResponse(order), HttpStatus.CREATED);

        } catch (Exception e) {
            return Response.errorResponse("Failed to place order: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    @Transactional
    public Response<OrderResponse> updateStatus(Long orderId, ReservationStatus status) {
        try {
            Order order = orderRepository.findById(orderId)
                    .orElseThrow(() -> new RuntimeException("Order not found"));

            order.setStatus(status);
            orderRepository.save(order);

            return Response.successResponse("Order status updated successfully", mapToResponse(order));

        } catch (Exception e) {
            return Response.errorResponse("Failed to update status: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public Response<List<OrderResponse>> getOrdersByUserId(Long userId) {
        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            List<Order> orders = orderRepository.findOrdersByUser((user));
            var orderResponses = orders.stream()
                    .map(this::mapToResponse)
                    .collect(Collectors.toList());

            return Response.successResponse("Orders retrieved successfully", orderResponses);

        } catch (Exception e) {
            return Response.errorResponse("Failed to retrieve orders: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public Response<List<OrderResponse>> getAllOrders() {
        try {
            List<Order> orders = orderRepository.findAll();
            var orderResponses = orders.stream()
                    .map(this::mapToResponse)
                    .collect(Collectors.toList());

            return Response.successResponse("All orders retrieved successfully", orderResponses);

        } catch (Exception e) {
            return Response.errorResponse("Failed to retrieve all orders: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private OrderResponse mapToResponse(Order order) {
        return OrderResponse.builder()
                .id(order.getId())
                .orderDateTime(order.getOrderDateTime())
                .createdAt(order.getOrderDateTime()) // Using orderDateTime as createdAt since Order doesn't have a separate createdAt field
                .totalAmount(order.getTotalAmount())
                .status(order.getStatus())
                .deliveryAddress(order.getDeliveryAddress())
                .contactNumber(order.getContactNumber())
                .customerName(order.getUser().getName())
                .customerEmail(order.getUser().getEmail())
                .items(order.getItems().stream().map(item ->
                        OrderItemResponse.builder()
                                .foodId(item.getFood().getId())
                                .foodName(item.getFood().getName())
                                .quantity(item.getQuantity())
                                .priceAtPurchase(item.getPriceAtPurchase())
                                .build()
                ).collect(Collectors.toList()))
                .build();
    }
}
