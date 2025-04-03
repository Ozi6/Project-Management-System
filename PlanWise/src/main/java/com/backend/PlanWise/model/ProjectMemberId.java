package com.backend.PlanWise.model;

import java.io.Serializable;
import java.util.Objects;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

@Embeddable
public class ProjectMemberId implements Serializable {
    @Column(name = "project_id")
    private Long projectId;
    
    @Column(name = "user_id")
    private String userId;

    // Default constructor
    public ProjectMemberId() {}

    public ProjectMemberId(Long projectId, String userId) {
        this.projectId = projectId;
        this.userId = userId;
    }

    // Getters and setters
    public Long getProjectId() { return projectId; }
    public void setProjectId(Long projectId) { this.projectId = projectId; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    // Implement equals() and hashCode()
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof ProjectMemberId)) return false;
        ProjectMemberId that = (ProjectMemberId) o;
        return projectId.equals(that.projectId) && userId.equals(that.userId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(projectId, userId);
    }
}
