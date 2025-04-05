package com.backend.PlanWise.servicer;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.backend.PlanWise.DataPool.CategoryDataPool;
import com.backend.PlanWise.DataPool.ProjectDataPool;
import com.backend.PlanWise.DataPool.RecentActivityDataPool;
import com.backend.PlanWise.DataTransferObjects.RecentActivityDTO;
import com.backend.PlanWise.model.Category;
import com.backend.PlanWise.model.Project;
import com.backend.PlanWise.model.RecentActivity;


@Service
public class RecentActivityService {

    private final RecentActivityDataPool recentActivityDataPool;
    private final ProjectDataPool projectDataPool;
    private final CategoryDataPool categoryDataPool;
    private final UserService userService;

    @Autowired
    public RecentActivityService(RecentActivityDataPool recentActivityDataPool,
                               ProjectDataPool projectDataPool,
                               CategoryDataPool categoryDataPool,
                               UserService userService) {
        this.recentActivityDataPool = recentActivityDataPool;
        this.projectDataPool = projectDataPool;
        this.categoryDataPool = categoryDataPool;
        this.userService = userService;
    }

    public RecentActivityDTO createActivity(String userId, String action, String entityType, Long entityId) {
        // Get user name safely
        String userName = userService.getUsernameById(userId);

        // Get entity name based on type
        String entityName = getEntityName(entityType, entityId);

        RecentActivity activity = new RecentActivity();
        activity.setUserId(userId);
        activity.setAction(action);
        activity.setEntityType(entityType);
        activity.setEntityId(entityId);
        activity.setActivityTime(LocalDateTime.now());

        RecentActivity savedActivity = recentActivityDataPool.save(activity);
        
        return convertToDTO(savedActivity, userName, entityName);
    }

    private String getEntityName(String entityType, Long entityId) {
        try {
            if ("Project".equalsIgnoreCase(entityType)) {
                return projectDataPool.findById(entityId)
                        .map(Project::getProjectName)
                        .orElse("a project");
                } else if ("Category".equalsIgnoreCase(entityType)) {
                    Category category = categoryDataPool.findById(entityId).orElse(null);
                    if (category != null) {
                        String projectName = projectDataPool.findById(category.getProject().getProjectId())
                                .map(Project::getProjectName)
                                .orElse("a project");
                        return category.getCategoryName() + " in " + projectName;
                    }
                    return "a category";
                }
        } catch (Exception e) {
            //log.error("Error fetching entity name", e);
        }
        return entityType.toLowerCase(); // fallback to "project", "task", etc.
    }

    private RecentActivityDTO convertToDTO(RecentActivity activity, String userName, String entityName) {
        RecentActivityDTO dto = new RecentActivityDTO();
        dto.setActivityId(activity.getActivityId());
        dto.setUserId(activity.getUserId());
        dto.setUserName(userName);
        dto.setAction(activity.getAction());
        dto.setEntityType(activity.getEntityType());
        dto.setEntityId(activity.getEntityId());
        dto.setEntityName(entityName);
        dto.setActivityTime(activity.getActivityTime());
        return dto;
    }

    public List<RecentActivityDTO> getUserRecentActivities(String userId) {
        List<RecentActivity> activities = recentActivityDataPool.findByUserIdOrderByActivityTimeDesc(userId);
        return activities.stream()
                .map(activity -> {
                    String userName = userService.getUsernameById(activity.getUserId());
                    String entityName = getEntityName(activity.getEntityType(), activity.getEntityId());
                    return convertToDTO(activity, userName, entityName);
                })
                .collect(Collectors.toList());
    }

    
    
}