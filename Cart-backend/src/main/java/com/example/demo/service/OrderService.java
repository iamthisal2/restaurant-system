package com.sliit.crave.service;

import com.sliit.crave.dto.request.order.PlaceOrderRequest;
import com.sliit.crave.dto.response.Response;
import com.sliit.crave.dto.response.order.OrderResponse;
import com.sliit.crave.enums.ReservationStatus;

import java.util.List;

public interface OrderService {
    Response<OrderResponse> placeOrder(PlaceOrderRequest request);
    Response<OrderResponse> updateStatus(Long orderId, ReservationStatus status);
    Response<List<OrderResponse>> getOrdersByUserId(Long userId);
    Response<List<OrderResponse>> getAllOrders();
}
