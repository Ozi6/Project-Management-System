package com.backend.PlanWise.model;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "project_members")
public class ProjectMember {
    @EmbeddedId
    private ProjectMemberId id;
    @MapsId("projectId")
    @ManyToOne
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @MapsId("userId")
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "joined_at") // Match database column name
    private LocalDateTime joinedAt;

    @OneToMany(mappedBy = "projectMember", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<ProjectMemberPermission> permissions;

    // Add getter and setter for joinedAt
    public LocalDateTime getJoinedAt() {
        return joinedAt;
    }

    public void setJoinedAt(LocalDateTime joinedAt) {
        this.joinedAt = joinedAt;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Map<String, Boolean> getPermissions() {
        Map<String, Boolean> permissionMap = new HashMap<>();
        for (ProjectMemberPermission permission : this.permissions) {
            permissionMap.put(permission.getPermissionName(), permission.getPermissionValue());
        }
        return permissionMap;
    }

    public void setPermissions(Map<String, Boolean> permissions) {
        this.permissions.clear();
        for (Map.Entry<String, Boolean> entry : permissions.entrySet()) {
            ProjectMemberPermission permission = new ProjectMemberPermission();
            permission.setPermissionName(entry.getKey());
            permission.setPermissionValue(entry.getValue());
            permission.setProjectMember(this);
            this.permissions.add(permission);
        }
    }

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }

    public ProjectMemberId getId() {
        return id;
    }

    public void setId(ProjectMemberId id) {
        this.id = id;
    }
}