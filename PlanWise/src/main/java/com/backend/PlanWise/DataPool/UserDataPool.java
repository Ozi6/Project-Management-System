package com.backend.PlanWise.DataPool;

import com.backend.PlanWise.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserDataPool extends JpaRepository<User, Long>
{
    User findByUsername(String username);
    User findByEmail(String email);
}