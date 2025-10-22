package com.example.demo.tables.entity;
import jakarta.persistence.*;

@Entity
@Table(name = "restaurant_tables")
public class Tables {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int capacity;

    // Optional: name/number label for easier identification
    private String tableNumber;

    public Tables() {}

    public Tables(int capacity, String tableNumber) {
        this.capacity = capacity;
        this.tableNumber = tableNumber;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public int getCapacity() { return capacity; }
    public void setCapacity(int capacity) { this.capacity = capacity; }
    public String getTableNumber() { return tableNumber; }
    public void setTableNumber(String tableNumber) { this.tableNumber = tableNumber; }
}