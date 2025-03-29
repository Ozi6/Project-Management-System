package com.backend.PlanWise.Controllers;

import com.backend.PlanWise.DataTransferObjects.CategoryDTO;
import com.backend.PlanWise.DataTransferObjects.ProjectDTO;
import com.backend.PlanWise.servicer.CategoryService;
import com.backend.PlanWise.servicer.ProjectServicer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
}