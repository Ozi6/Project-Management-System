package com.backend.PlanWise.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinColumns;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;


@Entity
@Table(name = "project_member_permissions")
public class ProjectMemberPermission {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "permission_id")
    private Long permissionId;

    @ManyToOne
    @JoinColumns({
        @JoinColumn(name = "project_id", referencedColumnName = "project_id"),
        @JoinColumn(name = "user_id", referencedColumnName = "user_id")
    })
    private ProjectMember projectMember;

    @Column(name = "permission_name", nullable = false)
    private String permissionName;

    @Column(name = "permission_value", nullable = false)
    private boolean permissionValue;

    public Long getPermissionId() {
        return permissionId;
    }

    public void setPermissionId(Long permissionId) {
        this.permissionId = permissionId;
    }

    public ProjectMember getProjectMember() {
        return projectMember;
    }

    public void setProjectMember(ProjectMember projectMember) {
        this.projectMember = projectMember;
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

}

