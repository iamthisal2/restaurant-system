package com.sliit.crave.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "cart_items")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CartItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int quantity;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "food_id", nullable = false)
    private Food food;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cart_id", nullable = false)
    private Cart cart;

    private Double priceAtOrderTime;

//    public CartItem(int quantity, Food food, Cart cart, Double priceAtOrderTime) {
//        this.quantity = quantity;
//        this.food = food;
//        this.cart = cart;
//        this.priceAtOrderTime = priceAtOrderTime;
//    }

//    public CartItem(){
//
//    }
}
