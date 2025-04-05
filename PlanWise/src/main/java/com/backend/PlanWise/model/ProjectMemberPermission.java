package com.backend.PlanWise.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinColumns;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

@Data
@Entity
@Table(name = "project_member_permissions", indexes = {
        @Index(name = "idx_project_member_permissions_project_user", columnList = "project_id,user_id"),
        @Index(name = "idx_project_member_permissions_permission", columnList = "permission_name")
}, uniqueConstraints = {
        @UniqueConstraint(name = "uk_project_member_permissions_project_user_permission", columnNames = { "project_id",
                "user_id", "permission_name" })
})
@EqualsAndHashCode(of = { "projectId", "userId", "permissionName" })
@ToString(exclude = { "projectMember" })
public class ProjectMemberPermission {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "permission_id")
    private Long id;

    @Column(name = "project_id", nullable = false)
    private Long projectId;

    @Column(name = "user_id", nullable = false)
    private String userId;

    @NotBlank
    @Column(name = "permission_name", nullable = false)
    private String permissionName;

    @Column(name = "permission_value", nullable = false)
    private boolean permissionValue;

    @ManyToOne(fetch = jakarta.persistence.FetchType.LAZY)
    @JoinColumns({
            @JoinColumn(name = "project_id", referencedColumnName = "project_id", insertable = false, updatable = false),
            @JoinColumn(name = "user_id", referencedColumnName = "user_id", insertable = false, updatable = false)
    })
    private ProjectMember projectMember;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public String getPermissionName() {
        return permissionName;
    }

    public void setPermissionName(String permissionName) {
        this.permissionName = permissionName;
    }

    public boolean getPermissionValue() {
        return permissionValue;
    }

    public void setPermissionValue(boolean permissionValue) {
        this.permissionValue = permissionValue;
    }

    public ProjectMember getProjectMember() {
        return projectMember;
    }

    public void setProjectMember(ProjectMember projectMember) {
        this.projectMember = projectMember;
        if (projectMember != null) {
            this.projectId = projectMember.getProjectId();
            this.userId = projectMember.getUserId();
        }
    }
}