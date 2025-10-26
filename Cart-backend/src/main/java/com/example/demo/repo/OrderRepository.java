package com.sliit.crave.repo;



import com.sliit.crave.entity.Order;
import com.sliit.crave.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findOrdersByUser(User user);
}
