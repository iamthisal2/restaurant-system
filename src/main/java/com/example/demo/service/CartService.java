package com.example.demo.service;

import com.example.demo.dto.CartDto;
import com.example.demo.entity.Cart;
import com.example.demo.repo.CartRepo;
import jakarta.transaction.Transactional;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
public class CartService {
    @Autowired
    private CartRepo cartRepo;
    @Autowired
    private ModelMapper modelMapper;

    public CartDto saveCart(CartDto cartdto) {
        cartRepo.save(modelMapper.map(cartdto, Cart.class));
        return cartdto;
    }

        public List<CartDto> getAllCarts(){
            List<Cart> cartList = cartRepo.findAll();
            return modelMapper.map(cartList,new TypeToken<List<CartDto>>(){}.getType());
        }

        public CartDto updateCart(CartDto cartdto){
        cartRepo.save(modelMapper.map(cartdto, Cart.class));
        return cartdto;

        }

        public boolean deleteCart(CartDto cartdto) {
            cartRepo.delete(modelMapper.map(cartdto, Cart.class));
            return true;



        }



}

