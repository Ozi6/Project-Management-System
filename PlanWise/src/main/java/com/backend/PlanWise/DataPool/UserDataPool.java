package com.backend.PlanWise.DataPool;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.backend.PlanWise.model.User;

@Repository
public interface UserDataPool extends JpaRepository<User, String> {
    User findByUserId(String userId);
    User findByUsername(String username);
    User findByEmail(String email);

    @Query("SELECT u FROM User u WHERE u.email = :email OR u.username = :username")
    User findByEmailOrUsername(
        @Param("email") String email,
        @Param("username") String username
    );
    
}