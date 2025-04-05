package com.backend.PlanWise.security;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.backend.PlanWise.DataPool.ProjectMemberPermissionDataPool;
import com.backend.PlanWise.model.ProjectMemberPermission;

@Component
public class PermissionChecker {

    @Autowired
    private ProjectMemberPermissionDataPool permissionRepository;

    public boolean hasPermission(Long projectId, String userId, String permissionName) {
        if (projectId == null || userId == null || permissionName == null) {
            return false;
        }

        List<ProjectMemberPermission> permissions = permissionRepository
                .findByProjectIdAndUserId(projectId, userId);

        return permissions.stream()
                .filter(p -> p.getPermissionName().equals(permissionName))
                .findFirst()
                .map(ProjectMemberPermission::getPermissionValue)
                .orElse(false);
    }

    public boolean hasAnyPermission(Long projectId, String userId, String... permissionNames) {
        if (projectId == null || userId == null || permissionNames == null || permissionNames.length == 0) {
            return false;
        }

        for (String permissionName : permissionNames) {
            if (hasPermission(projectId, userId, permissionName)) {
                return true;
            }
        }
        return false;
    }

    public boolean hasAllPermissions(Long projectId, String userId, String... permissionNames) {
        if (projectId == null || userId == null || permissionNames == null || permissionNames.length == 0) {
            return false;
        }

        for (String permissionName : permissionNames) {
            if (!hasPermission(projectId, userId, permissionName)) {
                return false;
            }
        }
        return true;
    }
}