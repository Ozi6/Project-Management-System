package com.backend.PlanWise.servicer;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.backend.PlanWise.model.User;
import com.backend.PlanWise.DataPool.UserDataPool;
import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private UserDataPool userDataPool;
    
    @PersistenceContext
    private EntityManager entityManager;
    
    @Transactional
    public User getOrCreateLocalUser(String clerkUserId, String email, String name) {
        // Try to find the user with a direct query first
        User existingUser = entityManager.find(User.class, clerkUserId);
        
        if (existingUser != null) {
            // User exists, return it
            return existingUser;
        } else {
            // User doesn't exist, create a new one
            User newUser = new User();
            newUser.setUserId(clerkUserId);
            newUser.setEmail(email);
            newUser.setUsername(name);
            
            // Use EntityManager directly to persist
            entityManager.persist(newUser);
            entityManager.flush();
            
            return newUser;
        }
    }
}