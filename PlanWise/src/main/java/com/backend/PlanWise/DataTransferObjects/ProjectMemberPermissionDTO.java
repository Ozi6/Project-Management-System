package com.backend.PlanWise.DataTransferObjects;

public class ProjectMemberPermissionDTO {
    private Long projectId;
    private String userId;
    private String permissionName;
    private boolean permissionValue;
    // don't we need user_id and project_id ?

    // Getters
    public Long getProjectId() {
        return projectId;
    }

    public String getUserId() {
        return userId;
    }

    public String getPermissionName() {
        return permissionName;
    }

    public boolean getPermissionValue() {
        return permissionValue;
    }

    // Setters
    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public void setPermissionName(String permissionName) {
        this.permissionName = permissionName;
    }

    public void setPermissionValue(boolean permissionValue) {
        this.permissionValue = permissionValue;
    }
}