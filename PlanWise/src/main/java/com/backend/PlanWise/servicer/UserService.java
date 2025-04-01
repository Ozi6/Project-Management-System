package com.backend.PlanWise.servicer;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.backend.PlanWise.DataPool.UserDataPool;
import com.backend.PlanWise.DataTransferObjects.UserDTO;
import com.backend.PlanWise.model.User;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

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

    @Transactional
    public UserDTO syncUserData(UserDTO userDTO)
    {
        User existingUser = userDataPool.findByUserId(userDTO.getUserId());

        if (existingUser == null)
        {
            existingUser = new User();
            existingUser.setUserId(userDTO.getUserId());
            existingUser.setEmail(userDTO.getEmail());
            existingUser.setUsername(userDTO.getUsername());
            userDataPool.save(existingUser);
        }
        else
        {
            boolean needsUpdate = false;
            if (userDTO.getEmail() != null && !userDTO.getEmail().equals(existingUser.getEmail()))
            {
                existingUser.setEmail(userDTO.getEmail());
                needsUpdate = true;
            }
            if (userDTO.getUsername() != null && !userDTO.getUsername().equals(existingUser.getUsername()))
            {
                existingUser.setUsername(userDTO.getUsername());
                needsUpdate = true;
            }
            if (needsUpdate)
                userDataPool.save(existingUser);
        }
        return new UserDTO(existingUser.getUserId(), existingUser.getUsername(), existingUser.getEmail());
    }

    public String getUsernameById(String userId) {
        try {
            User user = userDataPool.findByUserId(userId);
            return (user != null && user.getUsername() != null) 
                ? user.getUsername() 
                : userId; // Fallback to userId if user or username is null
        } catch (Exception e) {
            // log.error("Error fetching username for userId: {}", userId, e);
            return userId; // Fallback on error
        }
    }
}