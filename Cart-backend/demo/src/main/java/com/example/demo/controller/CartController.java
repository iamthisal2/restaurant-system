package com.example.demo.controller;

import com.example.demo.dto.CartDto;
import com.example.demo.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping(value = "api/v1/")
public class CartController {


    @GetMapping("/getCarts")
    public List<CartDto> getALLCarts() {


        return cartService.getAllCarts();
    }
    @Autowired
    private CartService cartService;



    @PostMapping("/saveCarts")
    public CartDto saveCarts(@RequestBody CartDto cartdto){
         return cartService.saveCart(cartdto);

    }

    @PutMapping("/updateCarts")
    public CartDto updateCarts(@RequestBody CartDto cartdto){
        return cartService.updateCart(cartdto);


    }
    @DeleteMapping("/deleteCarts")

    public Boolean deleteCarts(@RequestBody CartDto cartdto)
    {
        return cartService.deleteCart(cartdto);
    }




}
