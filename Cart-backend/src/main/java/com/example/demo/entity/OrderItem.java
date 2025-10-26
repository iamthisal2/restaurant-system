package com.sliit.crave.entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "order_item")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "food_id")
    private Food food;

    private int quantity;

    private double priceAtPurchase;

//    public OrderItem(Order order, Food food, int quantity, double priceAtPurchase) {
//        this.order = order;
//        this.food = food;
//        this.quantity = quantity;
//        this.priceAtPurchase = priceAtPurchase;
//    }
//
//    public OrderItem(){}
}
