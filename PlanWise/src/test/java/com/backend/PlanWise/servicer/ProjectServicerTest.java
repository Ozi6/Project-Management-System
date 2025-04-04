package com.backend.PlanWise.servicer;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.backend.PlanWise.DataPool.ProjectDataPool;
import com.backend.PlanWise.DataPool.ProjectMemberDataPool;
import com.backend.PlanWise.DataPool.ProjectMemberPermissionDataPool;
import com.backend.PlanWise.DataPool.UserDataPool;
import com.backend.PlanWise.DataTransferObjects.ProjectDTO;
import com.backend.PlanWise.DataTransferObjects.ProjectMemberDTO;
import com.backend.PlanWise.exception.ResourceNotFoundException;
import com.backend.PlanWise.model.Project;
import com.backend.PlanWise.model.ProjectMember;
import com.backend.PlanWise.model.User;

@ExtendWith(MockitoExtension.class)
public class ProjectServicerTest {

    @Mock
    private ProjectDataPool projectRepository;

    @Mock
    private ProjectMemberDataPool projectMemberRepository;

    @Mock
    private ProjectMemberPermissionDataPool permissionRepository;

    @Mock
    private UserDataPool userRepository;

    @InjectMocks
    private ProjectServicer projectService;

    private Long projectId;
    private String userId;
    private String email;
    private Project project;
    private User user;
    private ProjectMember projectMember;

    @BeforeEach
    void setUp() {
        projectId = 1L;
        userId = "test-user-id";
        email = "test@example.com";

        project = new Project();
        project.setProjectId(projectId);
        project.setProjectName("Test Project");

        user = new User();
        user.setUserId(userId);
        user.setEmail(email);

        projectMember = new ProjectMember();
        projectMember.setProjectId(projectId);
        projectMember.setUserId(userId);
    }

    @Test
    void inviteMember_WithValidData_CreatesProjectMember() {
        // Preparation
        when(projectRepository.findById(projectId)).thenReturn(Optional.of(project));
        when(userRepository.findById(anyString())).thenReturn(Optional.of(user));
        when(projectMemberRepository.save(any(ProjectMember.class))).thenReturn(projectMember);

        // Execution
        projectService.inviteMember(projectId, email);

        // Examination
        verify(projectMemberRepository).save(any(ProjectMember.class));
    }

    @Test
    void inviteMember_WithInvalidProjectId_ThrowsResourceNotFoundException() {
        // Preparation
        when(projectRepository.findById(projectId)).thenReturn(Optional.empty());

        // Examination
        assertThrows(ResourceNotFoundException.class, () -> {
            projectService.inviteMember(projectId, email);
        });
        verify(projectMemberRepository, never()).save(any());
    }

    @Test
    void inviteMember_WithInvalidEmail_ThrowsResourceNotFoundException() {
        // Preparation
        when(projectRepository.findById(projectId)).thenReturn(Optional.of(project));
        when(userRepository.findById(anyString())).thenReturn(Optional.empty());

        // Examination
        assertThrows(ResourceNotFoundException.class, () -> {
            projectService.inviteMember(projectId, email);
        });
        verify(projectMemberRepository, never()).save(any());
    }

    @Test
    void generateInviteLink_WithValidProjectId_ReturnsInviteLink() {
        // Preparation
        when(projectRepository.findById(projectId)).thenReturn(Optional.of(project));

        // Execution
        String inviteLink = projectService.generateInviteLink(projectId);

        // Examination
        assertNotNull(inviteLink);
        assertTrue(inviteLink.contains(projectId.toString()));
    }

    @Test
    void generateInviteLink_WithInvalidProjectId_ThrowsResourceNotFoundException() {
        // Preparation
        when(projectRepository.findById(projectId)).thenReturn(Optional.empty());

        // Examination
        assertThrows(ResourceNotFoundException.class, () -> {
            projectService.generateInviteLink(projectId);
        });
    }
}