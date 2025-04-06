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
    public User getOrCreateLocalUser(String clerkUserId, String email, String username, String profileImageUrl)
    {
        try{
            User existingUser = userDataPool.findByUserId(clerkUserId);
            
            if(existingUser != null)
            {
                boolean needsUpdate = false;
                
                if(email != null && !email.equals(existingUser.getEmail()))
                {
                    existingUser.setEmail(email);
                    needsUpdate = true;
                }
                
                if(username != null && !username.equals(existingUser.getUsername()))
                {
                    existingUser.setUsername(username);
                    needsUpdate = true;
                }

                if(profileImageUrl != null && !profileImageUrl.equals((existingUser.getProfileImageUrl())))
                {
                    existingUser.setProfileImageUrl(profileImageUrl);
                    needsUpdate = true;
                }
                
                if(needsUpdate)
                    return userDataPool.save(existingUser);

                return existingUser;
            }
            else
            {
                User newUser = new User();
                newUser.setUserId(clerkUserId);
                newUser.setEmail(email);
                newUser.setUsername(username);
                
                return userDataPool.save(newUser);
            }
        }catch(DataIntegrityViolationException e){
            User conflictedUser = userDataPool.findByEmailOrUsername(email, username);
            if(conflictedUser != null)
                return conflictedUser;
            throw e;
        }
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