package com.sliit.crave.enums;

import lombok.Getter;

@Getter
public enum OrderStatus {
    PENDING,
    PREPARING,
    DELIVERING,
    DELIVERED,
    CANCELLED
}
