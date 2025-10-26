package com.sliit.crave.service.impl;

import com.sliit.crave.dto.response.Response;
import com.sliit.crave.dto.response.cart.CartItemResponse;
import com.sliit.crave.dto.response.cart.CartResponse;
import com.sliit.crave.entity.Cart;
import com.sliit.crave.entity.CartItem;
import com.sliit.crave.entity.Food;
import com.sliit.crave.entity.User;
import com.sliit.crave.repo.CartItemRepository;
import com.sliit.crave.repo.CartRepository;
import com.sliit.crave.repo.FoodRepository;
import com.sliit.crave.repo.UserRepository;
import com.sliit.crave.service.CartService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Transactional
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;
    private final FoodRepository foodRepository;


    @Override
    public Response<CartResponse> getCartByUserId(Long userId) {
        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Cart cart = cartRepository.findByCustomer(user)
                    .orElseGet(() -> {
                        Cart newCart = Cart.builder()
                                .customer(user)
                                .totalPrice(0.0)
                                .build();
                        return cartRepository.save(newCart);
                    });

            return Response.successResponse("Cart fetched successfully", toCartResponse(cart));
        } catch (Exception e) {
            return Response.errorResponse("Failed to fetch cart: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @Override
    public Response<CartResponse> addItemToCart(Long userId, Long foodId, int quantity) {
        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            Cart cart = cartRepository.findByCustomer(user)
                    .orElseGet(() -> cartRepository.save(Cart.builder()
                            .customer(user)
                            .totalPrice(0.0)
                            .build()));

            Food food = foodRepository.findById(foodId)
                    .orElseThrow(() -> new RuntimeException("Food not found"));

            CartItem existingItem = cart.getItems().stream()
                    .filter(item -> item.getFood().getId().equals(foodId))
                    .findFirst()
                    .orElse(null);

            if (existingItem != null) {
                existingItem.setQuantity(existingItem.getQuantity() + quantity);
            } else {
                CartItem newItem = CartItem.builder()
                        .food(food)
                        .quantity(quantity)
                        .priceAtOrderTime(food.getPrice())
                        .cart(cart)
                        .build();
                cart.getItems().add(newItem);
            }

            // recalc total
            cart.setTotalPrice(cart.getItems().stream()
                    .mapToDouble(i -> i.getPriceAtOrderTime() * i.getQuantity())
                    .sum());

            cartRepository.save(cart);
            return Response.successResponse("Item added successfully", toCartResponse(cart));
        } catch (Exception e) {
            return Response.errorResponse("Failed to add item: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @Override
    public Response<CartResponse> removeItemFromCart(Long userId, Long cartItemId) {
        try {
            Cart cart = cartRepository.findByCustomerId(userId)
                    .orElseThrow(() -> new RuntimeException("Cart not found"));

            CartItem item = cartItemRepository.findById(cartItemId)
                    .orElseThrow(() -> new RuntimeException("Cart item not found"));

            if (!item.getCart().getId().equals(cart.getId())) {
                throw new RuntimeException("Item does not belong to this cart");
            }

            cart.getItems().remove(item);
            cartItemRepository.delete(item);

            cart.setTotalPrice(cart.getItems().stream()
                    .mapToDouble(ci -> ci.getPriceAtOrderTime() * ci.getQuantity())
                    .sum());

            cartRepository.save(cart);
            return Response.successResponse("Item removed successfully", toCartResponse(cart));
        } catch (Exception e) {
            return Response.errorResponse("Failed to remove item: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @Override
    public Response<String> clearCart(Long userId) {
        try {
            Cart cart = cartRepository.findByCustomerId(userId)
                    .orElseThrow(() -> new RuntimeException("Cart not found"));

            cart.getItems().clear();
            cart.setTotalPrice(0.0);
            cartRepository.save(cart);

            return Response.successResponse("Cart cleared successfully", "OK");
        } catch (Exception e) {
            return Response.errorResponse("Failed to clear cart: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    private CartResponse toCartResponse(Cart cart) {
        return CartResponse.builder()
                .id(cart.getId())
                .userId(cart.getCustomer().getId())
                .totalPrice(cart.getTotalPrice())
                .items(cart.getItems().stream()
                        .map(item -> CartItemResponse.builder()
                                .id(item.getId())
                                .foodId(item.getFood().getId())
                                .foodName(item.getFood().getName())
                                .quantity(item.getQuantity())
                                .priceAtOrderTime(item.getPriceAtOrderTime())
                                .build())
                        .toList())
                .build();
    }
}
