package com.backend.PlanWise.controller;

import com.backend.PlanWise.dto.ProjectDTO;
import com.backend.PlanWise.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    private final ProjectService projectService;

    @Autowired
    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @GetMapping
    public ResponseEntity<List<ProjectDTO>> getAllProjects() {
        return ResponseEntity.ok(projectService.getAllProjects());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProjectDTO> getProjectById(@PathVariable Integer id) {
        return ResponseEntity.ok(projectService.getProjectById(id));
    }

    @PostMapping
    public ResponseEntity<ProjectDTO> createProject(@RequestBody ProjectDTO projectDTO) {
        return ResponseEntity.ok(projectService.createProject(projectDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable Integer id) {
        projectService.deleteProject(id);
        return ResponseEntity.noContent().build();
    }
}