package com.example.demo.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class CartDto {


    private Long id;
    private int userid;
    private String itemName;
    private int quantity;
    private double price;










}
