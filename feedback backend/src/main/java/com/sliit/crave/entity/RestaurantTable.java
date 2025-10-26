package com.sliit.crave.entity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "restaurant_tables")
public class RestaurantTable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private int capacity;
    private String tableNumber;

//    public RestaurantTable(int capacity, String tableNumber) {
//        this.capacity = capacity;
//        this.tableNumber = tableNumber;
//    }
//
//    public RestaurantTable() {
//
//    }

}