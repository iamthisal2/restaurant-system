package com.sliit.crave.entity;

import com.sliit.crave.enums.ReservationStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "order_date", nullable = false)
    private LocalDateTime orderDateTime;

    @Column(name = "total_amount", nullable = false)
    private Double totalAmount;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private ReservationStatus status = ReservationStatus.PENDING;

    @Column(name = "delivery_address", nullable = false)
    private String deliveryAddress;

    @Column(name = "contact_number", nullable = false)
    private String contactNumber;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<OrderItem> items = new ArrayList<>();

    @PrePersist
    public void onCreate() {
        if (orderDateTime == null) {
            orderDateTime = LocalDateTime.now();
        }
    }

//    public Order(){
//
//    }
//
//    public Order(User user, Double totalAmount, String deliveryAddress, String contactNumber) {
//        this.user = user;
//        this.totalAmount = totalAmount;
//        this.deliveryAddress = deliveryAddress;
//        this.contactNumber = contactNumber;
//        this.orderDateTime = LocalDateTime.now();
//        this.status = ReservationStatus.PENDING;
//    }
}
