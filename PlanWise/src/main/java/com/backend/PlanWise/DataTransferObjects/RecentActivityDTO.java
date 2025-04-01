package com.backend.PlanWise.DataTransferObjects;

import java.time.LocalDateTime;

public class RecentActivityDTO {
    private Long activityId;
    private String userId;
    private String userName;
    private String action;
    private String entityType;  // Changed to String to match the model
    private Long entityId;
    private String entityName;
    private LocalDateTime activityTime;
    
    // Constructors
    public RecentActivityDTO() {
    }
    
    public RecentActivityDTO(Long activityId, String userId, String action, 
                           String entityType, Long entityId, LocalDateTime activityTime) {
        this.activityId = activityId;
        this.userId = userId;
        this.action = action;
        this.entityType = entityType;
        this.entityId = entityId;
        this.activityTime = activityTime;
    }
    
    // Getters and Setters
    public Long getActivityId() {
        return activityId;
    }

    public void setActivityId(Long activityId) {
        this.activityId = activityId;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public String getEntityType() {
        return entityType;
    }

    public void setEntityType(String entityType) {
        this.entityType = entityType;
    }

    public Long getEntityId() {
        return entityId;
    }

    public void setEntityId(Long entityId) {
        this.entityId = entityId;
    }

    public String getEntityName() {
        return entityName;
    }

    public void setEntityName(String entityName) {
        this.entityName = entityName;
    }

    public LocalDateTime getActivityTime() {
        return activityTime;
    }

    public void setActivityTime(LocalDateTime activityTime) {
        this.activityTime = activityTime;
    }

    @Override
    public String toString() {
        return "RecentActivityDTO{" +
                "activityId=" + activityId +
                ", userId='" + userId + '\'' +
                ", action='" + action + '\'' +
                ", entityType='" + entityType + '\'' +
                ", entityId=" + entityId +
                ", activityTime=" + activityTime +
                '}';
    }
}