package com.backend.PlanWise.DataPool;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.backend.PlanWise.model.User;

@Repository
public interface UserDataPool extends JpaRepository<User, String> {
    User findByUserId(String userId);
    User findByUsername(String username);
    User findByEmail(String email);
    
}