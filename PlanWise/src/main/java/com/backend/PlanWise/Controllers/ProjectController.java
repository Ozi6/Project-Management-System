package com.backend.PlanWise.Controllers;

import java.util.List;
import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
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
import com.backend.PlanWise.security.RequiresPermission;
import com.backend.PlanWise.DataTransferObjects.CategoryDTO;
import com.backend.PlanWise.DataTransferObjects.ProjectDTO;
import com.backend.PlanWise.servicer.CategoryService;
import com.backend.PlanWise.servicer.ProjectServicer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/projects")
public class ProjectController
{

    @Autowired
    private ProjectServicer projectService;

    @GetMapping
    public ResponseEntity<List<ProjectDTO>> getAllProjects()
    {
        return ResponseEntity.ok(projectService.getAllProjects());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProjectDTO> getProjectById(@PathVariable Long id)
    {
        ProjectDTO project = projectService.getProjectById(id);
        if(project != null)
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
    public ResponseEntity<ProjectDTO> createProject(@RequestBody ProjectDTO projectDTO)
    {
        ProjectDTO createdProject = projectService.createProject(projectDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdProject);
    }

    @DeleteMapping("/{projectId}")
    public ResponseEntity<?> deleteProject(@PathVariable Long projectId)
    {
        projectService.deleteProject(projectId);
        return ResponseEntity.ok().build();
    }

    @Autowired
    private CategoryService categoryService;

    @GetMapping("/{id}/details")
    public ResponseEntity<ProjectDTO> getProjectDetails(@PathVariable("id") Long projectId)
    {
        ProjectDTO projectDTO = projectService.getProjectById(projectId);
        if(projectDTO == null)
            return ResponseEntity.notFound().build();
        Set<CategoryDTO> categories = categoryService.getCategoriesByProjectId(projectId);
        projectDTO.setCategories(categories);
        return ResponseEntity.ok(projectDTO);
    }

    @PutMapping(value = "/{projectId}/update", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ProjectDTO> updateProject(
            @PathVariable Long projectId,
            @RequestParam("projectName") String projectName,
            @RequestParam("description") String description,
            @RequestParam(value = "dueDate", required = false) String dueDateStr,
            @RequestParam(value = "backgroundImage", required = false) MultipartFile backgroundImage)
    {
        ProjectDTO projectDTO = new ProjectDTO();
        projectDTO.setProjectId(projectId);
        projectDTO.setProjectName(projectName);
        projectDTO.setDescription(description);

        if(dueDateStr != null && !dueDateStr.equals("null"))
        {
            LocalDate dueDate = LocalDate.parse(dueDateStr.substring(0, 10));
            projectDTO.setDueDate(dueDate);
        }

        ProjectDTO updatedProject = projectService.updateProjectSettings(id, settings);
        return ResponseEntity.ok(updatedProject);
    }

    @PutMapping(value = "/{id}/settings", consumes = { "application/json" })
    public ResponseEntity<ProjectDTO> updateProjectSettings(@PathVariable Long id,
            @RequestBody ProjectSettingsDTO settings) {

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

    // @PutMapping("/{projectId}/members/{userId}/permissions")
    // public ResponseEntity<?> updateMemberPermissions(@PathVariable Long
    // projectId,
    // @PathVariable String userId,
    // @RequestBody Map<String, Boolean> permissions) {
    // projectService.updateMemberPermissions(projectId, userId, permissions);
    // return ResponseEntity.ok().build();
    // }

    // @GetMapping("/{projectId}/members/{userId}/permissions")
    // public ResponseEntity<Map<String, Boolean>>
    // getMemberPermissions(@PathVariable Long projectId,
    // @PathVariable String userId) {
    // try {
    // if (projectId == null || userId == null || userId.trim().isEmpty()) {
    // 
    // return ResponseEntity.badRequest().build();
    // }

    // Map<String, Boolean> permissions =
    // projectService.getMemberPermissions(projectId, userId);
    // 
    // return ResponseEntity.ok(permissions);
    // } catch (ResourceNotFoundException e) {
    // );
    // return ResponseEntity.notFound().build();
    // } catch (Exception e) {
    // );
    // return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    // }
    // }

    @GetMapping("/{projectId}/isOwner/{userId}")
    public ResponseEntity<Boolean> isProjectOwner(@PathVariable Long projectId,
            @PathVariable String userId) {
        try {
            if (projectId == null || userId == null || userId.trim().isEmpty()) {
                
                return ResponseEntity.badRequest().build();
            }

            boolean isOwner = projectService.isProjectOwner(projectId, userId);
            
            return ResponseEntity.ok(isOwner);
        } catch (ResourceNotFoundException e) {
        
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
           
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }





    // @PostMapping("/{projectId}/categories")
    // @RequiresPermission(value = { "Edit Categories" }, requireAll = true)
    // public ResponseEntity<CategoryDTO> createCategory(
    //         @PathVariable Long projectId,
    //         @RequestBody CategoryDTO categoryDTO,
    //         @AuthenticationPrincipal UserDetails userDetails) {
    //     // ... existing code ...
    //     return null; // Placeholder return, actual implementation needed
    // }

    // @PutMapping("/{projectId}/categories/{categoryId}")
    // @RequiresPermission(value = { "Edit Categories" }, requireAll = true)
    // public ResponseEntity<CategoryDTO> updateCategory(
    //         @PathVariable Long projectId,
    //         @PathVariable Long categoryId,
    //         @RequestBody CategoryDTO categoryDTO,
    //         @AuthenticationPrincipal UserDetails userDetails) {
    //     // ... existing code ...
    //     return null; // Placeholder return, actual implementation needed
    // }

    // @DeleteMapping("/{projectId}/categories/{categoryId}")
    // @RequiresPermission(value = { "Edit Categories" }, requireAll = true)
    // public ResponseEntity<Void> deleteCategory(
    //         @PathVariable Long projectId,
    //         @PathVariable Long categoryId,
    //         @AuthenticationPrincipal UserDetails userDetails) {
    //     // ... existing code ...
    //     return null; // Placeholder return, actual implementation needed
    
}