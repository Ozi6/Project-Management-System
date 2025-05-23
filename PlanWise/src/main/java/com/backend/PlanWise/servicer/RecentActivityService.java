package com.backend.PlanWise.servicer;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.backend.PlanWise.DataPool.ProjectDataPool;
import com.backend.PlanWise.DataPool.RecentActivityDataPool;
import com.backend.PlanWise.DataPool.UserDataPool;
import com.backend.PlanWise.DataTransferObjects.RecentActivityDTO;
import com.backend.PlanWise.DataTransferObjects.UserDTO;
import com.backend.PlanWise.Exceptions.ResourceNotFoundException;
import com.backend.PlanWise.model.Project;
import com.backend.PlanWise.model.RecentActivity;
import com.backend.PlanWise.model.User;

@Service
public class RecentActivityService {
    @Autowired
    private RecentActivityDataPool recentActivityRepository;
    @Autowired
    private ProjectDataPool projectRepository;
    @Autowired
    private UserDataPool userRepository;
    @Autowired
    private UserService userService;

    @Transactional
    public RecentActivity createActivity(String userId, Long projectId, String actionType, 
                                       String entityType, Long entityId, String entityName, 
                                       String oldValue, String newValue) {
        Project project = projectRepository.findById(projectId)
            .orElseThrow(() -> new IllegalArgumentException("Project not found with id: " + projectId));

        // Get or create user with minimal data if not exists
        User user = userRepository.findByUserId(userId);
        if (user == null) {
            // Create a minimal user record if it doesn't exist
            user = new User();
            user.setUserId(userId);
            user.setUsername(userService.getUsernameById(userId)); // Fallback to userId if username not available
            user = userRepository.save(user);
        }

        RecentActivity activity = new RecentActivity();
        activity.setProject(project);
        activity.setUser(user);
        activity.setActionType(actionType);
        activity.setEntityType(entityType);
        activity.setEntityId(entityId);
        activity.setEntityName(entityName);
        activity.setOldValue(oldValue);
        activity.setNewValue(newValue);
        activity.setActivityTime(LocalDateTime.now());
        activity.setSeen(false);

        return recentActivityRepository.save(activity);
    }

    public RecentActivity createSystemActivity(Long projectId, String actionType, 
                                         String entityType, Long entityId, String entityName) {
        Project project = projectRepository.findById(projectId)
            .orElseThrow(() -> new IllegalArgumentException("Project not found with id: " + projectId));

        RecentActivity activity = new RecentActivity();
        activity.setProject(project);
        activity.setUser(null); // No user associated
        activity.setActionType(actionType);
        activity.setEntityType(entityType);
        activity.setEntityId(entityId);
        activity.setEntityName(entityName);
        activity.setActivityTime(LocalDateTime.now());
        activity.setSeen(false);

        return recentActivityRepository.save(activity);
    }

    public List<RecentActivityDTO> getRecentActivities(Long projectId) {
        List<RecentActivity> activities = recentActivityRepository.findByProjectIdOrderByActivityTimeDesc(projectId);
        return activities.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Add this method to your RecentActivityService class
    public List<RecentActivityDTO> getRecentActivitiesByEntityType(Long projectId, String entityType) {
        List<RecentActivity> activities = recentActivityRepository.findByProjectIdAndEntityTypeOrderByActivityTimeDesc(projectId, entityType);
        return activities.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private RecentActivityDTO convertToDTO(RecentActivity activity) {
        RecentActivityDTO dto = new RecentActivityDTO();
        dto.setActivityId(activity.getActivityId());
        dto.setProjectId(activity.getProject().getProjectId());
        
        // Handle user conversion safely
        if (activity.getUser() != null) {
            User user = activity.getUser();
            UserDTO userDTO = new UserDTO();
            userDTO.setUserId(user.getUserId());
            userDTO.setUsername(user.getUsername() != null ? user.getUsername() : user.getUserId());
            userDTO.setEmail(user.getEmail()); // May be null
            userDTO.setProfileImageUrl(user.getProfileImageUrl()); // May be null
            dto.setUser(userDTO);
        } else {
            dto.setUser(null);
        }
        
        dto.setActionType(activity.getActionType());
        dto.setEntityType(activity.getEntityType());
        dto.setEntityId(activity.getEntityId());
        dto.setEntityName(activity.getEntityName());
        dto.setOldValue(activity.getOldValue());
        dto.setNewValue(activity.getNewValue());
        dto.setActivityTime(activity.getActivityTime());
        dto.setSeen(activity.isSeen());
        
        return dto;
    }

    // Additional method to handle simple activity creation
    @Transactional
    public RecentActivity createSimpleActivity(String userId, Long projectId, 
                                             String action, String entityType, 
                                             Long entityId) {
        return createActivity(
            userId,
            projectId,
            action,
            entityType,
            entityId,
            null, // entityName
            null, // oldValue
            null  // newValue
        );
    }

    @Transactional
    public void markActivityAsSeen(Long projectId, Long activityId)
    {
        RecentActivity activity = recentActivityRepository.findByActivityIdAndProjectProjectId(activityId, projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Activity not found"));
        activity.setSeen(true);
        recentActivityRepository.save(activity);
    }

    @Transactional
    public void markAllActivitiesAsSeen(Long projectId)
    {
        List<RecentActivity> activities = recentActivityRepository.findByProjectProjectId(projectId);
        activities.forEach(activity -> activity.setSeen(true));
        recentActivityRepository.saveAll(activities);
    }
}