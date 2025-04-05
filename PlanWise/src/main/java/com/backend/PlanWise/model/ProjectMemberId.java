package com.backend.PlanWise.model;

import java.io.Serializable;

public class ProjectMemberId implements Serializable {
    private Long projectId;
    private String userId;

    public ProjectMemberId() {
    }

    public ProjectMemberId(Long projectId, String userId) {
        this.projectId = projectId;
        this.userId = userId;
    }

    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null || getClass() != o.getClass())
            return false;

        ProjectMemberId that = (ProjectMemberId) o;

        if (projectId != null ? !projectId.equals(that.projectId) : that.projectId != null)
            return false;
        return userId != null ? userId.equals(that.userId) : that.userId == null;
    }

    @Override
    public int hashCode() {
        int result = projectId != null ? projectId.hashCode() : 0;
        result = 31 * result + (userId != null ? userId.hashCode() : 0);
        return result;
    }
}
