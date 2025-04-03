package com.backend.PlanWise.Controllers;

import java.util.List;
import java.util.Map;
import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.backend.PlanWise.DataTransferObjects.CategoryDTO;
import com.backend.PlanWise.DataTransferObjects.ProjectDTO;
import com.backend.PlanWise.DataTransferObjects.ProjectMemberDTO;
import com.backend.PlanWise.DataTransferObjects.ProjectSettingsDTO;
import com.backend.PlanWise.exception.ResourceNotFoundException;
import com.backend.PlanWise.servicer.CategoryService;
import com.backend.PlanWise.servicer.ProjectServicer;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {
    private static final Logger log = LoggerFactory.getLogger(ProjectController.class);

    @Autowired
    private ProjectServicer projectService;

    @GetMapping
    public ResponseEntity<List<ProjectDTO>> getAllProjects() {
        return ResponseEntity.ok(projectService.getAllProjects());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProjectDTO> getProjectById(@PathVariable("id") Long id) {
        ProjectDTO project = projectService.getProjectById(id);
        if (project != null)
            return ResponseEntity.ok(project);
        else
            return ResponseEntity.notFound().build();
    }

    @GetMapping("/user/{userId}/related")
    public ResponseEntity<List<ProjectDTO>> getUserRelatedProjects(@PathVariable String userId) {
        List<ProjectDTO> projects = projectService.getProjectsByUserId(userId);
        return ResponseEntity.ok(projects);
    }

    @PostMapping
    public ResponseEntity<ProjectDTO> createProject(@RequestBody ProjectDTO projectDTO) {
        ProjectDTO createdProject = projectService.createProject(projectDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdProject);
    }

    @DeleteMapping("/{projectId}")
    public ResponseEntity<?> deleteProject(@PathVariable Long projectId) {
        projectService.deleteProject(projectId);
        return ResponseEntity.ok().build();
    }

    @Autowired
    private CategoryService categoryService;

    @GetMapping("/{id}/details")
    public ResponseEntity<ProjectDTO> getProjectDetails(@PathVariable("id") Long projectId) {
        ProjectDTO projectDTO = projectService.getProjectById(projectId);
        if (projectDTO == null)
            return ResponseEntity.notFound().build();
        Set<CategoryDTO> categories = categoryService.getCategoriesByProjectId(projectId);
        projectDTO.setCategories(categories);
        return ResponseEntity.ok(projectDTO);
    }

    @PostMapping(value = "/{id}/background", consumes = { "multipart/form-data" })
    public ResponseEntity<ProjectDTO> uploadBackgroundImage(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file,
            @RequestParam(required = false) String userId) {
        log.info("Uploading background image for project {}: file={}, userId={}",
                id, file.getOriginalFilename(), userId);

        ProjectSettingsDTO settings = new ProjectSettingsDTO();
        settings.setBackgroundImage(file);

        ProjectDTO updatedProject = projectService.updateProjectSettings(id, settings);
        return ResponseEntity.ok(updatedProject);
    }

    @PutMapping(value = "/{id}/settings", consumes = { "application/json" })
    public ResponseEntity<ProjectDTO> updateProjectSettings(@PathVariable Long id,
            @RequestBody ProjectSettingsDTO settings) {
        log.info(
                "Updating project settings for project {}: name={}, description={}, isPublic={}",
                id, settings.getProjectName(), settings.getProjectDescription(), settings.isPublic());

        ProjectDTO updatedProject = projectService.updateProjectSettings(id, settings);
        return ResponseEntity.ok(updatedProject);
    }

    @GetMapping("/{id}/members")
    public ResponseEntity<List<ProjectMemberDTO>> getProjectMembers(@PathVariable Long id) {
        List<ProjectMemberDTO> members = projectService.getProjectMembers(id);
        return ResponseEntity.ok(members);
    }

    @PutMapping("/{id}/members")
    public ResponseEntity<ProjectDTO> updateProjectMembers(@PathVariable Long id,
            @RequestBody List<ProjectMemberDTO> members) {
        ProjectDTO updatedProject = projectService.updateProjectMembers(id, members);
        return ResponseEntity.ok(updatedProject);
    }

    @DeleteMapping("/{projectId}/members/{userId}")
    public ResponseEntity<?> removeProjectMember(@PathVariable Long projectId,
            @PathVariable String userId) {
        projectService.removeProjectMember(projectId, userId);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{projectId}/members/{userId}/permissions")
    public ResponseEntity<?> updateMemberPermissions(@PathVariable Long projectId,
            @PathVariable String userId,
            @RequestBody Map<String, Boolean> permissions) {
        projectService.updateMemberPermissions(projectId, userId, permissions);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{projectId}/members/{userId}/permissions")
    public ResponseEntity<Map<String, Boolean>> getMemberPermissions(@PathVariable Long projectId,
            @PathVariable String userId) {
        try {
            if (projectId == null || userId == null || userId.trim().isEmpty()) {
                log.error("Invalid parameters: projectId={}, userId={}", projectId, userId);
                return ResponseEntity.badRequest().build();
            }

            Map<String, Boolean> permissions = projectService.getMemberPermissions(projectId, userId);
            log.debug("Retrieved permissions for user {} in project {}: {}", userId, projectId, permissions);
            return ResponseEntity.ok(permissions);
        } catch (ResourceNotFoundException e) {
            log.error("Resource not found: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            log.error("Error getting permissions for user {} in project {}: {}", userId, projectId, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{projectId}/isOwner/{userId}")
    public ResponseEntity<Boolean> isProjectOwner(@PathVariable Long projectId,
            @PathVariable String userId) {
        try {
            if (projectId == null || userId == null || userId.trim().isEmpty()) {
                log.error("Invalid parameters: projectId={}, userId={}", projectId, userId);
                return ResponseEntity.badRequest().build();
            }

            boolean isOwner = projectService.isProjectOwner(projectId, userId);
            log.debug("Checked if user {} is owner of project {}: {}", userId, projectId, isOwner);
            return ResponseEntity.ok(isOwner);
        } catch (ResourceNotFoundException e) {
            log.error("Resource not found: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            log.error("Error checking if user {} is owner of project {}: {}", userId, projectId, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/{projectId}/invite")
    public ResponseEntity<?> inviteMember(@PathVariable Long projectId, @RequestBody Map<String, String> request) {
        try {
            if (projectId == null || request == null || !request.containsKey("email")) {
                log.error("Invalid parameters for invite: projectId={}, request={}", projectId, request);
                return ResponseEntity.badRequest().build();
            }

            String email = request.get("email");
            projectService.inviteMember(projectId, email);
            log.info("Invitation sent to {} for project {}", email, projectId);
            return ResponseEntity.ok().build();
        } catch (ResourceNotFoundException e) {
            log.error("Resource not found: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            log.error("Error sending invitation: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{projectId}/invite-link")
    public ResponseEntity<Map<String, String>> getInviteLink(@PathVariable Long projectId) {
        try {
            if (projectId == null) {
                log.error("Invalid project ID for invite link: {}", projectId);
                return ResponseEntity.badRequest().build();
            }

            String inviteLink = projectService.generateInviteLink(projectId);
            log.info("Generated invite link for project {}: {}", projectId, inviteLink);
            return ResponseEntity.ok(Map.of("inviteLink", inviteLink));
        } catch (ResourceNotFoundException e) {
            log.error("Resource not found: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            log.error("Error generating invite link: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}