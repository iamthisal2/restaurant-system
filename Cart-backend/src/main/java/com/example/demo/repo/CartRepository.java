package com.sliit.crave.repo;


import com.sliit.crave.entity.Cart;
import com.sliit.crave.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {
    Optional<Cart> findByCustomer(User user);

    @Query("SELECT c FROM Cart c WHERE c.customer.id = :userId")
    Optional<Cart> findByCustomerId(@Param("userId") Long userId);
}
