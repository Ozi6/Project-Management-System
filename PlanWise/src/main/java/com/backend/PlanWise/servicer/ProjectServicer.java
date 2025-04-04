package com.backend.PlanWise.servicer;

import java.util.ArrayList;
import java.util.Base64;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.backend.PlanWise.DataPool.ProjectDataPool;
import com.backend.PlanWise.DataPool.UserDataPool;
import com.backend.PlanWise.DataTransferObjects.CategoryDTO;
import com.backend.PlanWise.DataTransferObjects.FileDTO;
import com.backend.PlanWise.DataTransferObjects.ListEntryDTO;
import com.backend.PlanWise.DataTransferObjects.ProjectDTO;
import com.backend.PlanWise.DataTransferObjects.ProjectMemberDTO;
import com.backend.PlanWise.DataTransferObjects.ProjectSettingsDTO;
import com.backend.PlanWise.DataTransferObjects.TaskListDTO;
import com.backend.PlanWise.DataTransferObjects.TeamDTO;
import com.backend.PlanWise.DataTransferObjects.UserDTO;
import com.backend.PlanWise.exception.ResourceNotFoundException;
import com.backend.PlanWise.model.Category;
import com.backend.PlanWise.model.File;
import com.backend.PlanWise.model.ListEntry;
import com.backend.PlanWise.model.Project;
import com.backend.PlanWise.model.ProjectMember;
import com.backend.PlanWise.model.TaskList;
import com.backend.PlanWise.model.Team;
import com.backend.PlanWise.model.User;
import com.backend.PlanWise.servicer.FileService;

@Service
@Transactional // ?
public class ProjectServicer {

    private static final Logger log = LoggerFactory.getLogger(ProjectServicer.class);
    @Autowired
    private ProjectDataPool projectRepository;

    @Autowired
    private FileService fileStorageService;
    @Autowired
    private UserDataPool userDataPool;
    @Autowired
    private UserService userService;

    @Autowired
    private RecentActivityService recentActivityService;

    @Autowired
    private TeamServicer teamServicer;

    public List<ProjectDTO> getAllProjects() {
        return projectRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public ProjectDTO getProjectById(Long id) {
        Project project = projectRepository.findByIdWithMembers(id);
        if (project == null) {
            
            return null;
        }
        return convertToDTO(project);
    }

    public void setProjectOwner(Project project, String ownerId) {
        User owner = userDataPool.findById(ownerId)
                .orElseThrow(() -> new ResourceNotFoundException("Owner not found with id: " + ownerId));
        project.setOwner(owner);
    }

    private UserDTO convertUserToDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setUserId(user.getUserId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        return dto;
    }

    private TeamDTO convertTeamToDTO(Team team) {
        TeamDTO dto = new TeamDTO();
        dto.setTeamId(team.getTeamId());
        dto.setTeamName(team.getTeamName());
        dto.setIconName(team.getIconName());

        dto.setMembers(team.getMembers().stream()
                .map(this::convertUserToDTO)
                .collect(Collectors.toSet()));

        return dto;
    }

    private CategoryDTO convertCategoryToDTO(Category category) {
        CategoryDTO dto = new CategoryDTO();
        dto.setCategoryId(category.getCategoryId());
        dto.setCategoryName(category.getCategoryName());
        dto.setColor(category.getColor());

        dto.setTaskLists(category.getTaskLists().stream()
                .map(this::convertTaskListToDTO)
                .collect(Collectors.toSet()));

        return dto;
    }

    private TaskListDTO convertTaskListToDTO(TaskList taskList) {
        TaskListDTO dto = new TaskListDTO();
        dto.setTaskListId(taskList.getTaskListId());
        dto.setTaskListName(taskList.getTaskListName());
        dto.setColor(taskList.getColor());

        dto.setEntries(taskList.getEntries().stream()
                .map(this::convertListEntryToDTO)
                .collect(Collectors.toSet()));

        return dto;
    }

    private ListEntryDTO convertListEntryToDTO(ListEntry entry) {
        ListEntryDTO dto = new ListEntryDTO();
        dto.setEntryId(entry.getEntryId());
        dto.setEntryName(entry.getEntryName());
        dto.setIsChecked(entry.getIsChecked());
        dto.setDueDate(entry.getDueDate());
        if (entry.getDueDate() != null)
            dto.setWarningThreshold(entry.getWarningThreshold());
        else
            dto.setWarningThreshold(null);

        if (entry.getFile() != null)
            dto.setFile(convertFileToDTO(entry.getFile()));

        dto.setAssignedUsers(entry.getAssignedUsers().stream()
                .map(this::convertUserToDTO)
                .collect(Collectors.toSet()));

        dto.setAssignedTeams(entry.getAssignedTeams().stream()
                .map(this::convertTeamToDTO)
                .collect(Collectors.toSet()));

        return dto;
    }

    private FileDTO convertFileToDTO(File file) {
        FileDTO dto = new FileDTO();
        dto.setFileId(file.getFileId());
        dto.setFileName(file.getFileName());
        dto.setFileSize(file.getFileSize());
        dto.setFileType(file.getFileType());

        if (file.getFileData() != null) {
            String base64Data = Base64.getEncoder().encodeToString(file.getFileData());
            dto.setFileDataBase64(base64Data);
        }

        return dto;
    }

    public ProjectDTO createProject(ProjectDTO projectDTO) {
        User owner = userService.getOrCreateLocalUser(
                projectDTO.getOwner().getUserId(),
                projectDTO.getOwner().getEmail(),
                projectDTO.getOwner().getUsername());

        Project project = new Project();
        project.setProjectName(projectDTO.getProjectName());
        project.setDescription(projectDTO.getDescription());
        project.setOwner(owner);
        project.setCreatedAt(projectDTO.getCreatedAt());
        project.setDueDate(projectDTO.getDueDate());
        project.setUpdatedAt(projectDTO.getLastUpdated());

        ProjectMember projectMember = new ProjectMember();
        projectMember.setProject(project);
        projectMember.setUser(owner);
        projectMember.setJoinedAt(projectDTO.getCreatedAt());
        project.getProjectMembers().add(projectMember);

        Project savedProject = projectRepository.save(project);

        recentActivityService.createActivity(
                owner.getUserId(),
                "created",
                "Project",
                savedProject.getProjectId());

        return convertToDTO(savedProject);
    }

    public ProjectDTO updateProjectSettings(Long projectId, ProjectSettingsDTO settings) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

       
        if (settings.getProjectName() != null) {
            project.setProjectName(settings.getProjectName());
        }
        if (settings.getProjectDescription() != null) {
            project.setDescription(settings.getProjectDescription());
        }
        project.setPublic(settings.isPublic());

        if (settings.getBackgroundImage() != null && !settings.getBackgroundImage().isEmpty()) {
            
            

            String imageUrl = fileStorageService.storeFile(settings.getBackgroundImage());
            if (imageUrl != null) {
                
                project.setBackgroundImageUrl(imageUrl);
            } else {
                
            }
        } else if (settings.getBackgroundImageUrl() != null) {
            
            project.setBackgroundImageUrl(settings.getBackgroundImageUrl());
        }

        Project updatedProject = projectRepository.save(project);

        return convertToDTO(updatedProject);
    }

    public ProjectDTO updateProjectMembers(Long projectId, List<ProjectMemberDTO> members) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        Set<User> updatedMembers = new HashSet<>();
        for (ProjectMemberDTO memberDTO : members) {
            User user = userDataPool.findById(memberDTO.getUserId())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found"));
            updatedMembers.add(user);
        }

        project.setMembers(updatedMembers);
        return convertToDTO(projectRepository.save(project));
    }

    public void updateMemberPermissions(Long projectId, String userId, Map<String, Boolean> permissions) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        User user = project.getMembers().stream()
                .filter(member -> member.getUserId().equals(userId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Member not found"));

        user.setUserPermissions(permissions); // Assuming User class has setUserPermissions method
        userDataPool.save(user);
    }

    public void removeProjectMember(Long projectId, String userId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        // Check if member is in any team
        Long memberTeamId = teamServicer.getMemberTeamId(userId);

        if (memberTeamId != null) {
            // If member is in a team, remove them from the team first
            teamServicer.deleteTeamMembers(memberTeamId);
        }

        // Remove from project_members
        project.getProjectMembers().removeIf(member -> member.getUserId().equals(userId));

        // Save the project with changes
        projectRepository.save(project);
    }

    public List<ProjectMemberDTO> getProjectMembers(Long projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        return project.getProjectMembers().stream()
                .map(member -> {
                    ProjectMemberDTO memberDTO = new ProjectMemberDTO();
                    memberDTO.setUserId(member.getUserId());
                    memberDTO.setUsername(member.getUser().getUsername());
                    memberDTO.setEmail(member.getUser().getEmail());
                    memberDTO.setJoinedAt(member.getJoinedAt());
                    memberDTO.setPermissions(member.getPermissions());
                    return memberDTO;
                })
                .collect(Collectors.toList());
    }

    private ProjectDTO convertToDTO(Project project) {
        ProjectDTO dto = new ProjectDTO();
        dto.setProjectId(project.getProjectId());
        dto.setProjectName(project.getProjectName());
        dto.setDescription(project.getDescription());
        dto.setCreatedAt(project.getCreatedAt());
        dto.setDueDate(project.getDueDate());
        dto.setLastUpdated(project.getUpdatedAt());
        dto.setPublic(project.isPublic());
        dto.setBackgroundImageUrl(project.getBackgroundImageUrl());
        dto.setCreatedAt(project.getCreatedAt());
        dto.setInviteToken(project.getInviteToken());

        UserDTO ownerDTO = new UserDTO();
        ownerDTO.setUserId(project.getOwner().getUserId());
        ownerDTO.setUsername(project.getOwner().getUsername());
        ownerDTO.setEmail(project.getOwner().getEmail());
        dto.setOwner(ownerDTO);

        dto.setMembers(project.getMembers().stream() // change it to projectMemberDTO
                .map(this::convertUserToMemberDTO)
                .collect(Collectors.toSet()));

        dto.setTeams(project.getTeams().stream()
                .map(this::convertTeamToDTO)
                .collect(Collectors.toSet()));

        dto.setCategories(project.getCategories().stream()
                .map(category -> {
                    CategoryDTO categoryDTO = new CategoryDTO();
                    categoryDTO.setCategoryId(category.getCategoryId());
                    categoryDTO.setCategoryName(category.getCategoryName());
                    categoryDTO.setColor(category.getColor());

                    categoryDTO.setTaskLists(category.getTaskLists().stream()
                            .map(taskList -> {
                                TaskListDTO taskListDTO = new TaskListDTO();
                                taskListDTO.setTaskListId(taskList.getTaskListId());
                                taskListDTO.setTaskListName(taskList.getTaskListName());
                                taskListDTO.setColor(taskList.getColor());

                                // Convert list entries
                                taskListDTO.setEntries(taskList.getEntries().stream()
                                        .map(this::convertListEntryToDTO)
                                        .collect(Collectors.toSet()));

                                return taskListDTO;
                            })
                            .collect(Collectors.toSet()));

                    return categoryDTO;
                })
                .collect(Collectors.toSet()));

        return dto;
    }

    private ProjectMemberDTO convertUserToMemberDTO(User user) {
        ProjectMemberDTO dto = new ProjectMemberDTO();
        dto.setUserId(user.getUserId());
        dto.setPermissions(user.getUserPermissions());
        return dto;
    }

    private User convertUserToEntity(UserDTO userDTO) {
        User user = new User();
        user.setUserId(userDTO.getUserId());
        user.setUsername(userDTO.getUsername());
        user.setEmail(userDTO.getEmail());
        return user;
    }

    private Team convertTeamToEntity(TeamDTO teamDTO) {
        Team team = new Team();
        team.setTeamId(teamDTO.getTeamId());
        team.setTeamName(teamDTO.getTeamName());
        team.setIconName(teamDTO.getIconName());
        team.setMembers(teamDTO.getMembers().stream()
                .map(this::convertUserToEntity)
                .collect(Collectors.toSet()));
        return team;
    }

    private Category convertCategoryToEntity(CategoryDTO categoryDTO) {
        Category category = new Category();
        category.setCategoryId(categoryDTO.getCategoryId());
        category.setCategoryName(categoryDTO.getCategoryName());
        category.setColor(categoryDTO.getColor());
        category.setTaskLists(categoryDTO.getTaskLists().stream()
                .map(this::convertTaskListToEntity)
                .collect(Collectors.toSet()));
        return category;
    }

    private TaskList convertTaskListToEntity(TaskListDTO taskListDTO) {
        TaskList taskList = new TaskList();
        taskList.setTaskListId(taskListDTO.getTaskListId());
        taskList.setTaskListName(taskListDTO.getTaskListName());
        taskList.setColor(taskListDTO.getColor());
        taskList.setEntries(taskListDTO.getEntries().stream()
                .map(this::convertListEntryToEntity)
                .collect(Collectors.toSet()));
        return taskList;
    }

    private ListEntry convertListEntryToEntity(ListEntryDTO entryDTO) {
        ListEntry entry = new ListEntry();
        entry.setEntryId(entryDTO.getEntryId());
        entry.setEntryName(entryDTO.getEntryName());
        entry.setIsChecked(entryDTO.getIsChecked());
        entry.setDueDate(entryDTO.getDueDate());
        if (entryDTO.getDueDate() != null)
            entry.setWarningThreshold(entryDTO.getWarningThreshold());
        else
            entry.setWarningThreshold(null);
        if (entryDTO.getFile() != null)
            entry.setFile(convertFileToEntity(entryDTO.getFile()));
        entry.setAssignedUsers(entryDTO.getAssignedUsers().stream()
                .map(this::convertUserToEntity)
                .collect(Collectors.toSet()));
        entry.setAssignedTeams(entryDTO.getAssignedTeams().stream()
                .map(this::convertTeamToEntity)
                .collect(Collectors.toSet()));
        return entry;
    }

    private File convertFileToEntity(FileDTO fileDTO) {
        File file = new File();
        file.setFileId(fileDTO.getFileId());
        file.setFileName(fileDTO.getFileName());
        file.setFileSize(fileDTO.getFileSize());
        file.setFileType(fileDTO.getFileType());
        if (fileDTO.getFileDataBase64() != null)
            file.setFileData(Base64.getDecoder().decode(fileDTO.getFileDataBase64()));

        return file;
    }

    public List<ProjectDTO> getProjectsByUserId(String userId) {
        User user = userDataPool.findByUserId(userId);

        List<Project> ownedProjects = projectRepository.findByOwnerUserId(userId);
        List<ProjectDTO> ownedProjectDTOs = ownedProjects.stream()
                .map(project -> {
                    project.setOwner(user);
                    ProjectDTO dto = convertToDTO(project);
                    dto.setIsOwner(true);
                    return dto;
                })
                .collect(Collectors.toList());

        List<Project> memberProjects = projectRepository.findByMembersUserId(userId);
        List<ProjectDTO> memberProjectDTOs = memberProjects.stream()
                .map(project -> {
                    ProjectDTO dto = convertToDTO(project);
                    dto.setIsOwner(project.getOwner().getUserId().equals(userId));
                    return dto;
                })
                .collect(Collectors.toList());

        List<ProjectDTO> allProjects = new ArrayList<>();
        allProjects.addAll(ownedProjectDTOs);
        allProjects.addAll(memberProjectDTOs);

        return allProjects.stream()
                .distinct()
                .collect(Collectors.toList());
    }

    public void deleteProject(Long projectId) {
        projectRepository.deleteById(projectId);
    }

    public boolean isProjectOwner(Long projectId, String userId) {
        if (projectId == null || userId == null) {
            
            return false;
        }

        

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> {
                    
                    return new ResourceNotFoundException("Project not found with id: " + projectId);
                });

        if (project.getOwner() == null) {
            
            return false;
        }

        String ownerId = project.getOwner().getUserId();
        

        boolean isOwner = ownerId.toLowerCase().equals(userId.toLowerCase());
        
        return isOwner;
    }

    public Map<String, Boolean> getMemberPermissions(Long projectId, String userId) {
        if (projectId == null || userId == null) {
            throw new IllegalArgumentException("Project ID and User ID cannot be null");
        }

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        if (isProjectOwner(projectId, userId)) {
            
            return Map.of(
                    "settings", true,
                    "edit", true,
                    "delete", true,
                    "invite", true);
        }

        // Get permissions from database
        ProjectMember member = project.getProjectMembers().stream()
                .filter(m -> m.getUserId().equals(userId))
                .findFirst()
                .orElse(null);

        if (member != null) {
            
            return member.getPermissions();
        }

        // If user is not a project member, return default permissions
        
        return Map.of(
                "settings", false,
                "edit", false,
                "delete", false,
                "invite", false);
    }



    public void addUserToProject(Long projectId, String userId) {
        if (projectId == null || userId == null) {
            throw new IllegalArgumentException("Project ID and User ID cannot be null");
        }

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + projectId));

        User user = userDataPool.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        // Check if user is already a project member
        if (project.getMembers().contains(user)) {
            throw new IllegalStateException("User is already a member of this project");
        }

        // Add user to project
        project.getMembers().add(user);
        projectRepository.save(project);

        // Create recent activity record
        recentActivityService.createActivity(
                userId,
                "joined",
                "Project",
                projectId);
    }

    public ProjectDTO updateProject(Long projectId, ProjectDTO projectDTO) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        project.setProjectName(projectDTO.getProjectName());
        project.setDescription(projectDTO.getDescription());
        // project.getCreatedAt();
        project.setDueDate(projectDTO.getDueDate());

        Project updatedProject = projectRepository.save(project);
        return convertToDTO(updatedProject);
    }

}
