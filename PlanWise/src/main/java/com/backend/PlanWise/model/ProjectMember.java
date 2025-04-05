package com.backend.PlanWise.model;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "project_members")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@IdClass(ProjectMemberId.class)
public class ProjectMember {
    @Id
    @Column(name = "project_id")
    private Long projectId;

    @Id
    @Column(name = "user_id")
    private String userId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", insertable = false, updatable = false)
    private Project project;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    private User user;

    @Column(name = "joined_at")
    private LocalDate joinedAt;

    @OneToMany(mappedBy = "projectMember", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<ProjectMemberPermission> permissions;

    public LocalDate getJoinedAt() {
        return joinedAt;
    }

    public void setJoinedAt(LocalDate joinedAt) {
        this.joinedAt = joinedAt;
    }

    public Map<String, Boolean> getPermissions() {
        Map<String, Boolean> permissionMap = new HashMap<>();
        if (this.permissions != null) {
            for (ProjectMemberPermission permission : this.permissions) {
                permissionMap.put(permission.getPermissionName(), permission.getPermissionValue());
            }
        }
        return permissionMap;
    }

    public void setPermissions(Map<String, Boolean> permissions) {
        if (this.permissions == null) {
            this.permissions = new ArrayList<>();
        } else {
            this.permissions.clear();
        }

        if (permissions != null) {
            for (Map.Entry<String, Boolean> entry : permissions.entrySet()) {
                ProjectMemberPermission permission = new ProjectMemberPermission();
                permission.setProjectId(this.projectId);
                permission.setUserId(this.userId);
                permission.setPermissionName(entry.getKey());
                permission.setPermissionValue(entry.getValue());
                this.permissions.add(permission);
            }
        }
    }

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
        if (project != null) {
            this.projectId = project.getProjectId();
        }
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
        if (user != null) {
            this.userId = user.getUserId();
        }
    }
}