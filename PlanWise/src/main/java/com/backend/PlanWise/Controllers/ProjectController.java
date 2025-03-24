package com.backend.PlanWise.Controllers;

import com.backend.PlanWise.DataTransferObjects.ProjectDTO;
import com.backend.PlanWise.servicer.ProjectServicer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ProjectDTO>> getProjectsByUserId(@PathVariable String userId)
    {
        return ResponseEntity.ok(projectService.getProjectsByUserId(userId));
    }

    @PostMapping
    public ResponseEntity<ProjectDTO> createProject(@RequestBody ProjectDTO projectDTO)
    {
        ProjectDTO createdProject = projectService.createProject(projectDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdProject);
    }
}