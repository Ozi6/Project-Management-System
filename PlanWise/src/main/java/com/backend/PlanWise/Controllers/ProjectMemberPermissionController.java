package com.backend.PlanWise.Controllers;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.backend.PlanWise.DataTransferObjects.ProjectMemberPermissionDTO;
import com.backend.PlanWise.exception.ResourceNotFoundException;
import com.backend.PlanWise.servicer.ProjectMemberPermissionService;

@RestController
@RequestMapping("/api/projects/{projectId}/members/{userId}/permissions")
public class ProjectMemberPermissionController {
    private static final Logger log = LoggerFactory.getLogger(ProjectMemberPermissionController.class);

    @Autowired
    private ProjectMemberPermissionService permissionService;

    @GetMapping
    public ResponseEntity<List<ProjectMemberPermissionDTO>> getMemberPermissions(
            @PathVariable Long projectId,
            @PathVariable String userId) {
        try {
            if (projectId == null || userId == null || userId.trim().isEmpty()) {
                
                return ResponseEntity.badRequest().build();
            }

            List<ProjectMemberPermissionDTO> permissions = permissionService.getMemberPermissions(projectId, userId);
            
            return ResponseEntity.ok(permissions);
        } catch (ResourceNotFoundException e) {
            
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/{permissionName}")
    public ResponseEntity<Void> updatePermission(
            @PathVariable Long projectId,
            @PathVariable String userId,
            @PathVariable String permissionName,
            @RequestBody ProjectMemberPermissionDTO permissionDTO) {
        try {
            if (projectId == null || userId == null || userId.trim().isEmpty() || permissionName == null) {
                
                return ResponseEntity.badRequest().build();
            }

            permissionService.updatePermission(projectId, userId, permissionName, permissionDTO.getPermissionValue());
            
            return ResponseEntity.ok().build();
        } catch (ResourceNotFoundException e) {
            
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}