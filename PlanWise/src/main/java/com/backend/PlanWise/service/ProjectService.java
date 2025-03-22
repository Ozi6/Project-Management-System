package com.backend.PlanWise.service;

import com.backend.PlanWise.dto.ProjectDTO;
import com.backend.PlanWise.model.Project;
import com.backend.PlanWise.model.User;
import com.backend.PlanWise.repository.ProjectRepository;
import com.backend.PlanWise.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    @Autowired
    public ProjectService(ProjectRepository projectRepository, UserRepository userRepository) {
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
    }

    public List<ProjectDTO> getAllProjects() {
        // For now, we'll use a simple approach without authentication
        // In a real app, you'd filter based on the current user
        Integer currentUserId = 1; // Mock user ID for demo
        
        return projectRepository.findAll().stream()
            .map(project -> {
                User owner = userRepository.findById(project.getOwnerId()).orElse(null);
                String ownerName = owner != null ? owner.getUsername() : "Unknown";
                boolean isOwner = project.getOwnerId().equals(currentUserId);
                
                return new ProjectDTO(
                    project.getId(),
                    project.getName(),
                    ownerName,
                    project.getProgress(),
                    project.getStatus(),
                    isOwner
                );
            })
            .collect(Collectors.toList());
    }

    public ProjectDTO getProjectById(Integer id) {
        Project project = projectRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Project not found"));
        
        User owner = userRepository.findById(project.getOwnerId())
            .orElseThrow(() -> new RuntimeException("Owner not found"));
        
        // In a real app, you'd check if current user is the owner
        Integer currentUserId = 1; // Mock user ID for demo
        boolean isOwner = project.getOwnerId().equals(currentUserId);
        
        return new ProjectDTO(
            project.getId(),
            project.getName(),
            owner.getUsername(),
            project.getProgress(),
            project.getStatus(),
            isOwner
        );
    }

    public ProjectDTO createProject(ProjectDTO projectDTO) {
        // In a real app, get current user from security context
        Integer currentUserId = 1; // Mock user ID for demo
        
        Project project = new Project();
        project.setName(projectDTO.getName());
        project.setOwnerId(currentUserId);
        project.setProgress(0);
        project.setStatus("In Progress");
        
        Project savedProject = projectRepository.save(project);
        
        User owner = userRepository.findById(currentUserId)
            .orElseThrow(() -> new RuntimeException("Owner not found"));
        
        return new ProjectDTO(
            savedProject.getId(),
            savedProject.getName(),
            owner.getUsername(),
            savedProject.getProgress(),
            savedProject.getStatus(),
            true
        );
    }

    public void deleteProject(Integer id) {
        // In a real app, check if current user has permission to delete
        projectRepository.deleteById(id);
    }
}