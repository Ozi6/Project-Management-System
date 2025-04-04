package com.backend.PlanWise.servicer;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import com.backend.PlanWise.DataPool.ProjectMemberPermissionDataPool;
import com.backend.PlanWise.DataTransferObjects.ProjectMemberPermissionDTO;
import com.backend.PlanWise.model.ProjectMemberPermission;

@Service
public class ProjectMemberPermissionService {
    private static final Logger log = LoggerFactory.getLogger(ProjectMemberPermissionService.class);

    @Autowired
    private ProjectMemberPermissionDataPool permissionRepository;

    public List<ProjectMemberPermissionDTO> getMemberPermissions(Long projectId, String userId) {
        validateParameters(projectId, userId);

        List<ProjectMemberPermission> permissions = permissionRepository.findByProjectIdAndUserId(projectId, userId);
        if (permissions.isEmpty()) {
            
            return List.of();
        }

        List<ProjectMemberPermissionDTO> dtos = permissions.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        
        return dtos;
    }

    @Transactional
    public void updatePermission(Long projectId, String userId, String permissionName, boolean permissionValue) {
        validateParameters(projectId, userId, permissionName);

        ProjectMemberPermission permission = permissionRepository
                .findByProjectIdAndUserIdAndPermissionName(projectId, userId, permissionName)
                .orElseGet(() -> {
                    
                    ProjectMemberPermission newPermission = new ProjectMemberPermission();
                    newPermission.setProjectId(projectId);
                    newPermission.setUserId(userId);
                    newPermission.setPermissionName(permissionName);
                    return newPermission;
                });

        permission.setPermissionValue(permissionValue);
        permissionRepository.save(permission);
        
    }

    @Transactional
    public void setPermissions(Long projectId, String userId, Map<String, Boolean> permissions) {
        validateParameters(projectId, userId);
        if (permissions == null) {
            throw new IllegalArgumentException("Permissions map cannot be null");
        }

      

        // Delete old permissions
        List<ProjectMemberPermission> existingPermissions = permissionRepository.findByProjectIdAndUserId(projectId,
                userId);
        if (!existingPermissions.isEmpty()) {
            
            permissionRepository.deleteAll(existingPermissions);
        }

        // Create new permissions
        for (Map.Entry<String, Boolean> entry : permissions.entrySet()) {
            if (!StringUtils.hasText(entry.getKey())) {
                
                continue;
            }

            ProjectMemberPermission permission = new ProjectMemberPermission();
            permission.setProjectId(projectId);
            permission.setUserId(userId);
            permission.setPermissionName(entry.getKey());
            permission.setPermissionValue(entry.getValue());
            permissionRepository.save(permission);
        }

        
    }

    private ProjectMemberPermissionDTO convertToDTO(ProjectMemberPermission permission) {
        ProjectMemberPermissionDTO dto = new ProjectMemberPermissionDTO();
        dto.setProjectId(permission.getProjectId());
        dto.setUserId(permission.getUserId());
        dto.setPermissionName(permission.getPermissionName());
        dto.setPermissionValue(permission.getPermissionValue());
        return dto;
    }

    private void validateParameters(Long projectId, String userId) {
        if (projectId == null) {
            throw new IllegalArgumentException("Project ID cannot be null");
        }
        if (!StringUtils.hasText(userId)) {
            throw new IllegalArgumentException("User ID cannot be null or empty");
        }
    }

    private void validateParameters(Long projectId, String userId, String permissionName) {
        validateParameters(projectId, userId);
        if (!StringUtils.hasText(permissionName)) {
            throw new IllegalArgumentException("Permission name cannot be null or empty");
        }
    }
}