package com.backend.PlanWise.servicer;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
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
    public User getOrCreateLocalUser(String clerkUserId, String email, String username, String profileImageUrl) {
        // First try to find existing user
        User existingUser = userDataPool.findByUserId(clerkUserId);
        if (existingUser != null) {
            return updateUserIfNeeded(existingUser, email, username, profileImageUrl);
        }
        
        // If not found, try to create new user with proper error handling
        try {
            User newUser = new User();
            newUser.setUserId(clerkUserId);
            newUser.setEmail(email);
            newUser.setUsername(username);
            newUser.setProfileImageUrl(profileImageUrl);
            
            return userDataPool.save(newUser);
        } catch (DataIntegrityViolationException e) {
            // If save fails due to duplicate, fetch the existing user
            User conflictedUser = userDataPool.findByUserId(clerkUserId);
            if (conflictedUser != null) {
                return updateUserIfNeeded(conflictedUser, email, username, profileImageUrl);
            }
            throw new RuntimeException("Failed to create or find user", e);
        }
    }

    private User updateUserIfNeeded(User user, String email, String username, String profileImageUrl) {
        boolean needsUpdate = false;
        
        if (email != null && !email.equals(user.getEmail())) {
            user.setEmail(email);
            needsUpdate = true;
        }
        
        if (username != null && !username.equals(user.getUsername())) {
            user.setUsername(username);
            needsUpdate = true;
        }

        if (profileImageUrl != null && !profileImageUrl.equals(user.getProfileImageUrl())) {
            user.setProfileImageUrl(profileImageUrl);
            needsUpdate = true;
        }
        
        if (needsUpdate) {
            return userDataPool.save(user);
        }
        
        return user;
    }

    @Transactional
    public UserDTO syncUserData(UserDTO userDTO) {
        try
        {
            User user = getOrCreateLocalUser(
                userDTO.getUserId(),
                userDTO.getEmail(),
                userDTO.getUsername(),
                userDTO.getProfileImageUrl()
            );
            return convertToDTO(user);
        }catch(DataIntegrityViolationException e){
            User existingUser = userDataPool.findByEmailOrUsername(
                userDTO.getEmail(), 
                userDTO.getUsername()
            );
            
            if (existingUser != null)
                return convertToDTO(existingUser);
            throw new RuntimeException("Failed to sync user data", e);
        }
    }

    public UserDTO convertToDTO(User user)
    {
        return new UserDTO(
            user.getUserId(),
            user.getUsername(),
            user.getEmail(),
            user.getProfileImageUrl()
        );
    }

    public String getUsernameById(String userId) {
        try {
            User user = userDataPool.findByUserId(userId);
            return (user != null && user.getUsername() != null) 
                ? user.getUsername() 
                : userId;
        } catch (Exception e) {
            return userId;
        }
    }
}