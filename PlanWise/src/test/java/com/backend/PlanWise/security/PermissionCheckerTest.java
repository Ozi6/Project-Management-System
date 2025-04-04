package com.backend.PlanWise.security;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;

import com.backend.PlanWise.DataPool.ProjectMemberPermissionDataPool;
import com.backend.PlanWise.model.ProjectMemberPermission;

@ExtendWith(MockitoExtension.class)
public class PermissionCheckerTest {

    @Mock
    private ProjectMemberPermissionDataPool permissionRepository;

    @InjectMocks
    private PermissionChecker permissionChecker;

    private Long projectId;
    private String userId;
    private List<ProjectMemberPermission> permissions;

    @BeforeEach
    void setUp() {
        projectId = 1L;
        userId = "test-user-id";

        // Create test permits
        ProjectMemberPermission editProject = new ProjectMemberPermission();
        editProject.setProjectId(projectId);
        editProject.setUserId(userId);
        editProject.setPermissionName("Edit Project");
        editProject.setPermissionValue(true);

        ProjectMemberPermission editMembers = new ProjectMemberPermission();
        editMembers.setProjectId(projectId);
        editMembers.setUserId(userId);
        editMembers.setPermissionName("Edit Members");
        editMembers.setPermissionValue(true);

        permissions = Arrays.asList(editProject, editMembers);
    }

    @Test
    void hasPermission_WhenPermissionExists_ReturnsTrue() {
        when(permissionRepository.findByProjectIdAndUserId(projectId, userId))
                .thenReturn(permissions);

        assertTrue(permissionChecker.hasPermission(projectId, userId, "Edit Project"));
        assertTrue(permissionChecker.hasPermission(projectId, userId, "Edit Members"));
    }

    @Test
    void hasPermission_WhenPermissionDoesNotExist_ReturnsFalse() {
        when(permissionRepository.findByProjectIdAndUserId(projectId, userId))
                .thenReturn(permissions);

        assertFalse(permissionChecker.hasPermission(projectId, userId, "Non-existent Permission"));
    }

    @Test
    void hasAnyPermission_WhenOnePermissionExists_ReturnsTrue() {
        when(permissionRepository.findByProjectIdAndUserId(projectId, userId))
                .thenReturn(permissions);

        assertTrue(permissionChecker.hasAnyPermission(projectId, userId, "Edit Project", "Non-existent Permission"));
    }

    @Test
    void hasAllPermissions_WhenAllPermissionsExist_ReturnsTrue() {
        when(permissionRepository.findByProjectIdAndUserId(projectId, userId))
                .thenReturn(permissions);

        assertTrue(permissionChecker.hasAllPermissions(projectId, userId, "Edit Project", "Edit Members"));
    }

    @Test
    void hasAllPermissions_WhenOnePermissionMissing_ReturnsFalse() {
        when(permissionRepository.findByProjectIdAndUserId(projectId, userId))
                .thenReturn(permissions);

        assertFalse(permissionChecker.hasAllPermissions(projectId, userId, "Edit Project", "Edit Members",
                "Non-existent Permission"));
    }

    @Test
    void hasPermission_WithNullParameters_ReturnsFalse() {
        assertFalse(permissionChecker.hasPermission(null, userId, "Edit Project"));
        assertFalse(permissionChecker.hasPermission(projectId, null, "Edit Project"));
        assertFalse(permissionChecker.hasPermission(projectId, userId, null));
    }
}