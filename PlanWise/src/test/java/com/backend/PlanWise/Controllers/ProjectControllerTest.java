package com.backend.PlanWise.Controllers;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.HashMap;
import java.util.Map;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;

import com.backend.PlanWise.DataTransferObjects.ProjectDTO;
import com.backend.PlanWise.servicer.ProjectServicer;

@ExtendWith(MockitoExtension.class)
public class ProjectControllerTest {

    @Mock
    private ProjectServicer projectService;

    @Mock
    private UserDetails userDetails;

    @InjectMocks
    private ProjectController projectController;

    private Long projectId;
    private String userId;
    private String email;

    @BeforeEach
    void setUp() {
        projectId = 1L;
        userId = "test-user-id";
        email = "test@example.com";
    }

    @Test
    void inviteMember_WithValidData_ReturnsOk() {
        // Data preparation
        Map<String, String> request = new HashMap<>();
        request.put("email", email);

        // Performing the test
        ResponseEntity<?> response = projectController.inviteMember(projectId, request);

        // Checking the results
        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(projectService).inviteMember(projectId, email);
    }

    @Test
    void inviteMember_WithInvalidData_ReturnsBadRequest() {
        // Data preparation
        Map<String, String> request = new HashMap<>();
        // Absent email

        // Performing the test
        ResponseEntity<?> response = projectController.inviteMember(projectId, request);

        // Checking the results
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        verify(projectService, never()).inviteMember(any(), any());
    }

    @Test
    void getInviteLink_WithValidProjectId_ReturnsOk() {
        // Data preparation
        String expectedInviteLink = "http://example.com/invite/123";
        when(projectService.generateInviteLink(projectId)).thenReturn(expectedInviteLink);

        // Performing the test
        ResponseEntity<Map<String, String>> response = projectController.getInviteLink(projectId);

        // Checking the results
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(expectedInviteLink, response.getBody().get("inviteLink"));
    }

    @Test
    void getInviteLink_WithInvalidProjectId_ReturnsBadRequest() {
        // Performing the test
        ResponseEntity<Map<String, String>> response = projectController.getInviteLink(null);

        // Checking the results
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        verify(projectService, never()).generateInviteLink(any());
    }

    @Test
    void updateProject_WithValidData_ReturnsOk() {
        // Data preparation
        ProjectDTO projectDTO = new ProjectDTO();
        projectDTO.setProjectId(projectId);
        projectDTO.setProjectName("Updated Project");

        // Performing the test
        ResponseEntity<ProjectDTO> response = projectController.updateProject(projectId, projectDTO, userDetails);

        // Checking the results
        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(projectService).updateProject(projectId, projectDTO);
    }
}