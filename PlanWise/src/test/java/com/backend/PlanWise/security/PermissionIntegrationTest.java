package com.backend.PlanWise.security;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import com.backend.PlanWise.DataPool.ProjectDataPool;
import com.backend.PlanWise.DataPool.ProjectMemberDataPool;
import com.backend.PlanWise.DataPool.ProjectMemberPermissionDataPool;
import com.backend.PlanWise.DataPool.UserDataPool;
import com.backend.PlanWise.model.Project;
import com.backend.PlanWise.model.ProjectMember;
import com.backend.PlanWise.model.ProjectMemberPermission;
import com.backend.PlanWise.model.User;

@SpringBootTest
@Transactional
public class PermissionIntegrationTest {

    @Autowired
    private ProjectDataPool projectRepository;

    @Autowired
    private UserDataPool userRepository;

    @Autowired
    private ProjectMemberDataPool projectMemberRepository;

    @Autowired
    private ProjectMemberPermissionDataPool permissionRepository;

    @Autowired
    private PermissionChecker permissionChecker;

    private Project testProject;
    private User testUser;
    private ProjectMember testMember;

    @BeforeEach
    void setUp() {
        // Create a test user
        testUser = new User();
        testUser.setUserId("test-user-123");
        testUser.setUsername("TestUser");
        testUser.setEmail("test@example.com");
        userRepository.save(testUser);

        // We create a test project
        testProject = new Project();
        testProject.setProjectName("Test Project");
        testProject.setOwner(testUser);
        projectRepository.save(testProject);

        // Add the user to the project
        testMember = new ProjectMember();
        testMember.setProject(testProject);
        testMember.setUser(testUser);
        projectMemberRepository.save(testMember);

        // Add basic resolutions
        List<ProjectMemberPermission> permissions = Arrays.asList(
                createPermission("View Project", true),
                createPermission("Edit Project", false),
                createPermission("Delete Project", false),
                createPermission("Invite Members", false));
        permissionRepository.saveAll(permissions);
    }

    private ProjectMemberPermission createPermission(String name, boolean value) {
        ProjectMemberPermission permission = new ProjectMemberPermission();
        permission.setProjectId(testProject.getProjectId());
        permission.setUserId(testUser.getUserId());
        permission.setPermissionName(name);
        permission.setPermissionValue(value);
        return permission;
    }

    @Test
    void testBasicPermissions() {
        // We check the basic permits
        assertTrue(permissionChecker.hasPermission(testProject.getProjectId(), testUser.getUserId(), "View Project"));
        assertFalse(permissionChecker.hasPermission(testProject.getProjectId(), testUser.getUserId(), "Edit Project"));
        assertFalse(
                permissionChecker.hasPermission(testProject.getProjectId(), testUser.getUserId(), "Delete Project"));
        assertFalse(
                permissionChecker.hasPermission(testProject.getProjectId(), testUser.getUserId(), "Invite Members"));
    }

    @Test
    void testUpdatePermission() {
        // We update editing permission
        ProjectMemberPermission editPermission = permissionRepository
                .findByProjectIdAndUserIdAndPermissionName(testProject.getProjectId(), testUser.getUserId(),
                        "Edit Project")
                .orElseThrow();
        editPermission.setPermissionValue(true);
        permissionRepository.save(editPermission);

        // Check the updated resolution
        assertTrue(permissionChecker.hasPermission(testProject.getProjectId(), testUser.getUserId(), "Edit Project"));
    }

    @Test
    void testMultiplePermissions() {
        // We check the combination of permits
        assertTrue(permissionChecker.hasAnyPermission(
                testProject.getProjectId(),
                testUser.getUserId(),
                "View Project",
                "Edit Project"));

        assertFalse(permissionChecker.hasAllPermissions(
                testProject.getProjectId(),
                testUser.getUserId(),
                "View Project",
                "Edit Project",
                "Delete Project"));
    }
}