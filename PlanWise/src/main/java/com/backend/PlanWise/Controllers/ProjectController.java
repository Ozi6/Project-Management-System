package com.backend.PlanWise.Controllers;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.backend.PlanWise.DataTransferObjects.CategoryDTO;
import com.backend.PlanWise.DataTransferObjects.ProjectDTO;
import com.backend.PlanWise.DataTransferObjects.TeamDTO;
import com.backend.PlanWise.DataTransferObjects.UserDTO;
import com.backend.PlanWise.Exceptions.ResourceNotFoundException;
import com.backend.PlanWise.model.MessageChannel;
import com.backend.PlanWise.model.Project;
import com.backend.PlanWise.repository.MessageChannelRepository;
import com.backend.PlanWise.servicer.CategoryService;
import com.backend.PlanWise.servicer.ProjectServicer;

@RestController
@RequestMapping("/api/projects")
public class ProjectController
{
    private static final Logger log = LoggerFactory.getLogger(ProjectController.class);

    @Autowired
    private ProjectServicer projectService;

    @Autowired
    private MessageController messageController;

    @Autowired
    private MessageChannelRepository messageChannelRepository;

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
    public ResponseEntity<List<ProjectDTO>> getUserRelatedProjects(@PathVariable String userId)
    {
        List<ProjectDTO> projects = projectService.getProjectsByUserId(userId);
        return ResponseEntity.ok(projects);
    }

    @PostMapping
    public ResponseEntity<Project> createProject(@RequestBody ProjectDTO projectDTO) {
        Project newProject = projectService.convertToEntity(projectService.createProject(projectDTO));
        
        // Initialize the read status for the project owner for the general channel
        // This assumes your messageChannelRepository has a method to find by project ID
        List<MessageChannel> channels = messageChannelRepository.findByProjectId(newProject.getProjectId());
        if (!channels.isEmpty()) {
            // Assuming the first channel is the "General" channel we just created
            MessageChannel generalChannel = channels.get(0);
            messageController.updateReadStatus(generalChannel.getChannelId(), projectDTO.getOwner().getUserId(), LocalDateTime.now());
            
        }
        
        return new ResponseEntity<>(newProject, HttpStatus.CREATED);
    }

    @DeleteMapping("/{projectId}")
    public ResponseEntity<?> deleteProject(
            @PathVariable Long projectId,
            @RequestHeader("userId") String userId) {
        
        projectService.verifyProjectOwner(projectId, userId);
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

    @GetMapping("/{projectId}/members")
    public ResponseEntity<List<UserDTO>> getProjectMembers(
            @PathVariable Long projectId)
    {
        List<UserDTO> members = projectService.getProjectMembers(projectId);
        return ResponseEntity.ok(members);
    }

    @DeleteMapping("/{projectId}/members/{userId}")
    public ResponseEntity<Void> removeProjectMember(
            @PathVariable Long projectId,
            @PathVariable String userId) {
        projectService.removeProjectMember(projectId, userId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping(value = "/{projectId}/update", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ProjectDTO> updateProject(
            @PathVariable Long projectId,
            @RequestParam("projectName") String projectName,
            @RequestParam("description") String description,
            @RequestParam(value = "dueDate", required = false) String dueDateStr,
            @RequestParam(value = "backgroundImage", required = false) MultipartFile backgroundImage,
            @RequestHeader("userId") String userId)
    {
        projectService.verifyProjectOwner(projectId, userId);
        
        ProjectDTO projectDTO = new ProjectDTO();
        projectDTO.setProjectId(projectId);
        projectDTO.setProjectName(projectName);
        if(description == null)
            projectDTO.setDescription("");
        else
            projectDTO.setDescription(description);

        if(dueDateStr != null && !dueDateStr.equals("null"))
        {
            LocalDate dueDate = LocalDate.parse(dueDateStr.substring(0, 10));
            projectDTO.setDueDate(dueDate);
        }

        if(backgroundImage != null && !backgroundImage.isEmpty())
        {
            try{
                projectDTO.setBackgroundImage(Base64.getEncoder().encodeToString(backgroundImage.getBytes()));
            }catch(IOException e){
                return ResponseEntity.badRequest().build();
            }
        }

        ProjectDTO updatedProject = projectService.updateProject(projectId, projectDTO);
        log.info("Updated project: ", updatedProject);
        if(updatedProject != null)
            return ResponseEntity.ok(updatedProject);
        else
            return ResponseEntity.notFound().build();
    }


    @GetMapping("/{id}/progress")
    public ResponseEntity<Integer> getProjectProgress(@PathVariable Long id)
    {
        try{
            int progress = projectService.getProjectProgress(id);
            return ResponseEntity.ok(progress);
        }catch(ResourceNotFoundException e){
            return ResponseEntity.notFound().build();
        }catch(Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/user/{userId}/dashboard-stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats(@PathVariable String userId) {
        try {
            Map<String, Object> stats = projectService.getDashboardStats(userId);
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    //comment to check fif this filed added to commit

    @GetMapping("/{projectId}/teams")
    public ResponseEntity<List<TeamDTO>> getProjectTeams(
            @PathVariable Long projectId)
    {
        List<TeamDTO> teams = projectService.getProjectTeams(projectId);
        return ResponseEntity.ok(teams);
    }

    @PostMapping("/{projectId}/teams/{teamId}/members/{userId}")
    public ResponseEntity<Void> addMemberToTeam(
            @PathVariable Long projectId,
            @PathVariable Long teamId,
            @PathVariable String userId)
    {
        projectService.addMemberToTeam(projectId, teamId, userId);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{projectId}/teams/{teamId}")
    public ResponseEntity<TeamDTO> updateTeam(
            @PathVariable Long projectId,
            @PathVariable Long teamId,
            @RequestBody TeamDTO teamDTO)
    {
        TeamDTO updatedTeam = projectService.updateTeam(projectId, teamId, teamDTO);
        return ResponseEntity.ok(updatedTeam);
    }

    @DeleteMapping("/{projectId}/teams/{teamId}")
    public ResponseEntity<Void> deleteTeam(
            @PathVariable Long projectId,
            @PathVariable Long teamId)
    {
        projectService.deleteTeam(projectId, teamId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{projectId}/teams")
    public ResponseEntity<TeamDTO> createTeam(
            @PathVariable Long projectId,
            @RequestBody TeamDTO teamDTO)
    {
        TeamDTO createdTeam = projectService.createTeam(projectId, teamDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdTeam);
    }

    @GetMapping("/{projectId}/isOwner")
    public ResponseEntity<Map<String, Boolean>> checkProjectOwnership(
            @PathVariable Long projectId,
            @RequestHeader("userId") String userId) {
        boolean isOwner = projectService.isProjectOwner(projectId, userId);
        return ResponseEntity.ok(Map.of("isOwner", isOwner));
    }
}