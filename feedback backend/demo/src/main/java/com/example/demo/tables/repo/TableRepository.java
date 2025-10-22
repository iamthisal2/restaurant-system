package com.example.demo.tables.repo;

import com.example.demo.tables.entity.Tables;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TableRepository extends JpaRepository<Tables, Long> {
    List<Tables> findByCapacityGreaterThanEqual(int capacity);
}