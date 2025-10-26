package com.sliit.crave.repo;


import com.sliit.crave.entity.FeedbackResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FeedbackResponseRepository extends JpaRepository<FeedbackResponse, Long> {
}