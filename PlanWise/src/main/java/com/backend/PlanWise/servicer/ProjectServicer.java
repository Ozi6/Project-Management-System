package com.backend.PlanWise.servicer;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

import com.backend.PlanWise.DataPool.TeamDataPool;
import com.backend.PlanWise.Exceptions.ResourceNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.backend.PlanWise.DataPool.ProjectDataPool;
import com.backend.PlanWise.DataPool.UserDataPool;
import com.backend.PlanWise.DataTransferObjects.CategoryDTO;
import com.backend.PlanWise.DataTransferObjects.FileDTO;
import com.backend.PlanWise.DataTransferObjects.ListEntryDTO;
import com.backend.PlanWise.DataTransferObjects.ProjectDTO;
import com.backend.PlanWise.DataTransferObjects.TaskListDTO;
import com.backend.PlanWise.DataTransferObjects.TeamDTO;
import com.backend.PlanWise.DataTransferObjects.UserDTO;
import com.backend.PlanWise.model.Category;
import com.backend.PlanWise.model.File;
import com.backend.PlanWise.model.ListEntry;
import com.backend.PlanWise.model.Project;
import com.backend.PlanWise.model.TaskList;
import com.backend.PlanWise.model.Team;
import com.backend.PlanWise.model.User;
import com.backend.PlanWise.Exceptions.AccessDeniedException;

@Service
public class ProjectServicer
{

    private static final Logger log = LoggerFactory.getLogger(ProjectServicer.class);

    @Autowired
    private ProjectDataPool projectRepository;
    @Autowired
    private UserDataPool userDataPool;

    @Autowired
    private UserService userService;

    @Autowired
    private RecentActivityService recentActivityService;

    public List<ProjectDTO> getAllProjects()
    {
        return projectRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public ProjectDTO getProjectById(Long id)
    {
        return projectRepository.findById(id)
                .map(this::convertToDTO)
                .orElse(null);
    }

    private ProjectDTO convertToDTO(Project project)
    {
        ProjectDTO dto = new ProjectDTO();
        dto.setProjectId(project.getProjectId());
        dto.setProjectName(project.getProjectName());
        dto.setDescription(project.getDescription());
        dto.setCreatedAt(project.getCreatedAt());
        dto.setDueDate(project.getDueDate());
        dto.setLastUpdated(project.getUpdatedAt());

        UserDTO ownerDTO = new UserDTO();
        ownerDTO.setUserId(project.getOwner().getUserId());
        ownerDTO.setUsername(project.getOwner().getUsername());
        ownerDTO.setEmail(project.getOwner().getEmail());
        dto.setOwner(ownerDTO);

        Set<UserDTO> memberDTOs = project.getMembers().stream()
                .map(this::convertUserToDTO)
                .collect(Collectors.toSet());
        dto.setMembers(memberDTOs);

        dto.setTeams(project.getTeams().stream()
                .map(this::convertTeamToDTO)
                .collect(Collectors.toSet()));

        dto.setCategories(project.getCategories().stream()
                .map(category ->{
                    CategoryDTO categoryDTO = new CategoryDTO();
                    categoryDTO.setCategoryId(category.getCategoryId());
                    categoryDTO.setCategoryName(category.getCategoryName());
                    categoryDTO.setColor(category.getColor());

                    categoryDTO.setTaskLists(category.getTaskLists().stream()
                            .map(taskList ->{
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

        if(project.getBackgroundImage() != null)
            dto.setBackgroundImage(Base64.getEncoder().encodeToString(project.getBackgroundImage()));

        return dto;
    }

    private UserDTO convertUserToDTO(User user)
    {
        UserDTO dto = new UserDTO();
        dto.setUserId(user.getUserId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setProfileImageUrl(user.getProfileImageUrl());
        return dto;
    }

    private TeamDTO convertTeamToDTO(Team team)
    {
        TeamDTO dto = new TeamDTO();
        dto.setTeamId(team.getTeamId());
        dto.setTeamName(team.getTeamName());
        dto.setIconName(team.getIconName());

        dto.setMembers(team.getMembers().stream()
                .map(this::convertUserToDTO)
                .collect(Collectors.toSet()));

        return dto;
    }

    private CategoryDTO convertCategoryToDTO(Category category)
    {
        CategoryDTO dto = new CategoryDTO();
        dto.setCategoryId(category.getCategoryId());
        dto.setCategoryName(category.getCategoryName());
        dto.setColor(category.getColor());

        dto.setTaskLists(category.getTaskLists().stream()
                .map(this::convertTaskListToDTO)
                .collect(Collectors.toSet()));

        return dto;
    }

    private TaskListDTO convertTaskListToDTO(TaskList taskList)
    {
        TaskListDTO dto = new TaskListDTO();
        dto.setTaskListId(taskList.getTaskListId());
        dto.setTaskListName(taskList.getTaskListName());
        dto.setColor(taskList.getColor());

        dto.setEntries(taskList.getEntries().stream()
                .map(this::convertListEntryToDTO)
                .collect(Collectors.toSet()));

        return dto;
    }

    private ListEntryDTO convertListEntryToDTO(ListEntry entry)
    {
        ListEntryDTO dto = new ListEntryDTO();
        dto.setEntryId(entry.getEntryId());
        dto.setEntryName(entry.getEntryName());
        dto.setIsChecked(entry.getIsChecked());
        dto.setDueDate(entry.getDueDate());
        dto.setCreatedAt(entry.getCreatedAt());
        if(entry.getDueDate() != null)
            dto.setWarningThreshold(entry.getWarningThreshold() != null ? entry.getWarningThreshold() : 1);
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

    private FileDTO convertFileToDTO(File file)
    {
        FileDTO dto = new FileDTO();
        dto.setFileId(file.getFileId());
        dto.setFileName(file.getFileName());
        dto.setFileSize(file.getFileSize());
        dto.setFileType(file.getFileType());

        if (file.getFileData() != null)
            dto.setFileDataBase64(Base64.getEncoder().encodeToString(file.getFileData()));

        return dto;
    }

    public ProjectDTO createProject(ProjectDTO projectDTO)
    {
        User owner = userService.getOrCreateLocalUser(
            projectDTO.getOwner().getUserId(),
            projectDTO.getOwner().getEmail(),
            projectDTO.getOwner().getUsername(),
            projectDTO.getOwner().getProfileImageUrl()
        );

        Project project = new Project();
        project.setProjectName(projectDTO.getProjectName());
        project.setDescription(projectDTO.getDescription());
        project.setOwner(owner);
        project.setCreatedAt(projectDTO.getCreatedAt());
        LocalDate jjj = projectDTO.getDueDate();
        project.setDueDate(projectDTO.getDueDate());
        project.setUpdatedAt(projectDTO.getLastUpdated());

        Set<User> members = new HashSet<>();
        members.add(owner);
        project.setMembers(members);

        if(projectDTO.getMembers() != null && !projectDTO.getMembers().isEmpty())
        {
            Set<User> additionalMembers = projectDTO.getMembers().stream()
                    .filter(userDTO -> !userDTO.getUserId().equals(owner.getUserId()))
                    .map(userDTO -> userService.getOrCreateLocalUser(
                            userDTO.getUserId(),
                            userDTO.getEmail(),
                            userDTO.getUsername(),
                            userDTO.getProfileImageUrl()
                    ))
                    .collect(Collectors.toSet());
            members.addAll(additionalMembers);
        }

        log.info("💾 Saving project to database...");

        Project savedProject = projectRepository.save(project);

        recentActivityService.createActivity(
            owner.getUserId(),
            "created",
            "Project",
            savedProject.getProjectId()
        );

        return convertToDTO(savedProject);
    }

    private Project convertToEntity(ProjectDTO projectDTO)
    {
        Project project = new Project();
        project.setProjectName(projectDTO.getProjectName());
        project.setDescription(projectDTO.getDescription());
        project.setCreatedAt(projectDTO.getCreatedAt());

        project.setOwner(convertUserToEntity(projectDTO.getOwner()));
        project.setMembers(projectDTO.getMembers().stream()
                .map(this::convertUserToEntity)
                .collect(Collectors.toSet()));
        project.setTeams(projectDTO.getTeams().stream()
                .map(this::convertTeamToEntity)
                .collect(Collectors.toSet()));
        project.setCategories(projectDTO.getCategories().stream()
                .map(this::convertCategoryToEntity)
                .collect(Collectors.toSet()));

        return project;
    }

    private User convertUserToEntity(UserDTO userDTO)
    {
        User user = new User();
        user.setUserId(userDTO.getUserId());
        user.setUsername(userDTO.getUsername());
        user.setEmail(userDTO.getEmail());
        return user;
    }

    private Team convertTeamToEntity(TeamDTO teamDTO)
    {
        Team team = new Team();
        team.setTeamId(teamDTO.getTeamId());
        team.setTeamName(teamDTO.getTeamName());
        team.setIconName(teamDTO.getIconName());
        team.setMembers(teamDTO.getMembers().stream()
                .map(this::convertUserToEntity)
                .collect(Collectors.toSet()));
        return team;
    }

    private Category convertCategoryToEntity(CategoryDTO categoryDTO)
    {
        Category category = new Category();
        category.setCategoryId(categoryDTO.getCategoryId());
        category.setCategoryName(categoryDTO.getCategoryName());
        category.setColor(categoryDTO.getColor());
        category.setTaskLists(categoryDTO.getTaskLists().stream()
                .map(this::convertTaskListToEntity)
                .collect(Collectors.toSet()));
        return category;
    }

    private TaskList convertTaskListToEntity(TaskListDTO taskListDTO)
    {
        TaskList taskList = new TaskList();
        taskList.setTaskListId(taskListDTO.getTaskListId());
        taskList.setTaskListName(taskListDTO.getTaskListName());
        taskList.setColor(taskListDTO.getColor());
        taskList.setEntries(taskListDTO.getEntries().stream()
                .map(this::convertListEntryToEntity)
                .collect(Collectors.toSet()));
        return taskList;
    }

    private ListEntry convertListEntryToEntity(ListEntryDTO entryDTO)
    {
        ListEntry entry = new ListEntry();
        entry.setEntryId(entryDTO.getEntryId());
        entry.setEntryName(entryDTO.getEntryName());
        entry.setIsChecked(entryDTO.getIsChecked());
        entry.setDueDate(entryDTO.getDueDate());
        if(entryDTO.getDueDate() != null)
            entry.setWarningThreshold(entryDTO.getWarningThreshold());
        else
            entry.setWarningThreshold(null);
        if(entryDTO.getFile() != null)
            entry.setFile(convertFileToEntity(entryDTO.getFile()));
        entry.setAssignedUsers(entryDTO.getAssignedUsers().stream()
                .map(this::convertUserToEntity)
                .collect(Collectors.toSet()));
        entry.setAssignedTeams(entryDTO.getAssignedTeams().stream()
                .map(this::convertTeamToEntity)
                .collect(Collectors.toSet()));
        return entry;
    }

    private File convertFileToEntity(FileDTO fileDTO)
    {
        File file = new File();
        file.setFileId(fileDTO.getFileId());
        file.setFileName(fileDTO.getFileName());
        file.setFileSize(fileDTO.getFileSize());
        file.setFileType(fileDTO.getFileType());
        if(fileDTO.getFileDataBase64() != null)
            file.setFileData(Base64.getDecoder().decode(fileDTO.getFileDataBase64()));

        return file;
    }

    public List<ProjectDTO> getProjectsByUserId(String userId)
    {
        User user = userDataPool.findByUserId(userId);

        List<Project> ownedProjects = projectRepository.findByOwnerUserId(userId);
        List<ProjectDTO> ownedProjectDTOs = ownedProjects.stream()
                .map(project ->
                {
                    project.setOwner(user);
                    ProjectDTO dto = convertToDTO(project);
                    dto.setIsOwner(true);
                    return dto;
                })
                .collect(Collectors.toList());

        List<Project> memberProjects = projectRepository.findByMembersUserId(userId);
        List<ProjectDTO> memberProjectDTOs = memberProjects.stream()
                .map(project ->
                {
                    ProjectDTO dto = convertToDTO(project);
                    dto.setIsOwner(project.getOwner().getUserId().equals(userId));
                    return dto;
                })
                .collect(Collectors.toList());

        Map<Long, ProjectDTO> projectMap = new LinkedHashMap<>();
        memberProjectDTOs.forEach(dto -> projectMap.putIfAbsent(dto.getProjectId(), dto));
        ownedProjectDTOs.forEach(dto -> projectMap.put(dto.getProjectId(), dto));
        return new ArrayList<>(projectMap.values());
    }

    public List<UserDTO> getProjectMembers(Long projectId)
    {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + projectId));

        return project.getMembers().stream()
                .map(this::convertUserToDTO)
                .collect(Collectors.toList());
    }

    public void removeProjectMember(Long projectId, String userId)
    {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + projectId));

        if (project.getOwner().getUserId().equals(userId))
            throw new IllegalStateException("Cannot remove project owner");

        User memberToRemove = project.getMembers().stream()
                .filter(member -> member.getUserId().equals(userId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Member not found in project"));

        project.getMembers().remove(memberToRemove);
        project.getTeams().forEach(team -> team.getMembers().remove(memberToRemove));

        project.getCategories().forEach(category ->
                category.getTaskLists().forEach(taskList ->
                        taskList.getEntries().forEach(entry ->
                        {
                            entry.getAssignedUsers().remove(memberToRemove);
                            entry.getAssignedTeams().removeIf(team ->
                                    team.getMembers().contains(memberToRemove));
                        })
                )
        );

        projectRepository.save(project);

        recentActivityService.createActivity(
                userId,
                "removed",
                "Member",
                projectId
        );
    }

    public void deleteProject(Long projectId)
    {
        projectRepository.deleteById(projectId);
    }

    public ProjectDTO updateProject(Long projectId, ProjectDTO projectDTO)
    {
        Project existingProject = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + projectId));

        if(projectDTO.getProjectName() != null)
            existingProject.setProjectName(projectDTO.getProjectName());
        if(projectDTO.getDescription() != null)
            existingProject.setDescription(projectDTO.getDescription());
        if(projectDTO.getDueDate() != null)
            existingProject.setDueDate(projectDTO.getDueDate());
        if(projectDTO.getBackgroundImage() != null)
        {
            byte[] imageBytes = Base64.getDecoder().decode(projectDTO.getBackgroundImage());
            existingProject.setBackgroundImage(imageBytes);
        }
        Project updatedProject = projectRepository.save(existingProject);

        return convertToDTO(updatedProject);
    }
    public int getProjectProgress(Long projectId) {
        
        Project project = projectRepository.findByIdWithFullHierarchy(projectId);
                // .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + projectId));
        
        int totalEntries = 0;
        int completedEntries = 0;
        
      
        for (Category category : project.getCategories()) {
           
            for (TaskList taskList : category.getTaskLists()) {
              
                Set<ListEntry> entries = taskList.getEntries();
                totalEntries += entries.size();
                completedEntries += entries.stream()
                        .filter(entry -> entry.getIsChecked() != null && entry.getIsChecked())
                        .count();
            }
        }
        int progressPercentage = totalEntries > 0 
                ? (int) Math.round((double) completedEntries / totalEntries * 100) : 0;

              

        log.info("Project {} progress: {}/{} entries completed ({}%)", 
                projectId, completedEntries, totalEntries, progressPercentage);
        
        return progressPercentage;
    }

    
    public Map<String, Object> getDashboardStats(String userId) {
        log.info("Getting dashboard statistics for user {}", userId);
        
        LocalDate today = LocalDate.now();
        LocalDate oneMonthAgo = today.minusMonths(1);
        LocalDate oneWeekAgo = today.minusWeeks(1);
        
        Integer totalProjects = projectRepository.countUserProjects(userId);
        Integer newProjects = projectRepository.countProjectsCreatedSince(userId, oneMonthAgo);

        Integer totalTaskLists = projectRepository.countTotalTaskLists(userId);
        Integer totalEntries = projectRepository.countTotalEntries(userId);
        Integer newTaskLists = projectRepository.countTaskListsCreatedSince(userId, oneWeekAgo);
        Integer newEntries = projectRepository.countEntriesCreatedSince(userId, oneWeekAgo);

        Integer completedEntries = projectRepository.countCompletedEntries(userId);
        Integer newlyCompletedEntries = projectRepository.countEntriesCompletedSince(userId, oneMonthAgo);

        int projectsGrowthPercent = calculatePercentage(newProjects, totalProjects - newProjects);

        int inProgressGrowthPercent = calculatePercentage(
            newTaskLists + newEntries, 
            (totalTaskLists - newTaskLists) + (totalEntries - newEntries)
        );
        
     
        int completionPercent = totalEntries > 0 ? (completedEntries * 100) / totalEntries : 0;
        int newCompletionPercent = calculatePercentage(newlyCompletedEntries, completedEntries - newlyCompletedEntries);
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalProjects", totalProjects);
        stats.put("projectsGrowthPercent", projectsGrowthPercent);
        stats.put("inProgressGrowthPercent", inProgressGrowthPercent);
        stats.put("completionPercent", completionPercent);
        stats.put("completionGrowthPercent", newCompletionPercent);
        
        return stats;
    }


    private int calculatePercentage(int newValue, int oldValue) {
        if (oldValue == 0) {
            return newValue > 0 ? 100 : 0;
        }
        return (newValue * 100) / oldValue;
    }
    //comment to check fif this filed added to commit


    public boolean isProjectOwner(Long projectId, String userId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + projectId));
        
        return project.getOwner().getUserId().equals(userId);
    }

    public void verifyProjectOwner(Long projectId, String userId) {
        if (!isProjectOwner(projectId, userId)) {
            throw new AccessDeniedException("User is not the owner of this project");
        }
    }

    @Autowired
    private TeamDataPool teamDataPool;

    public List<TeamDTO> getProjectTeams(Long projectId)
    {
        List<Team> teams = teamDataPool.findByProjectProjectId(projectId);
        return teams.stream()
                .map(this::convertTeamToDTO)
                .collect(Collectors.toList());
    }

    public void addMemberToTeam(Long projectId, Long teamId, String userId)
    {
        Team team = teamDataPool.findById(teamId)
                .orElseThrow(() -> new ResourceNotFoundException("Team not found"));

        if(!team.getProject().getProjectId().equals(projectId))
            throw new ResourceNotFoundException("Team not found in this project");

        User user = userDataPool.findByUserId(userId);
        if(user == null)
            throw new ResourceNotFoundException("User not found");

        team.getMembers().add(user);
        teamDataPool.save(team);
    }

    public TeamDTO updateTeam(Long projectId, Long teamId, TeamDTO teamDTO)
    {
        Team team = teamDataPool.findById(teamId)
                .orElseThrow(() -> new ResourceNotFoundException("Team not found"));

        if(!team.getProject().getProjectId().equals(projectId))
            throw new ResourceNotFoundException("Team not found in this project");

        team.setTeamName(teamDTO.getTeamName());
        team.setIconName(teamDTO.getIconName());
        team.setUpdatedAt(LocalDateTime.now());

        Team updatedTeam = teamDataPool.save(team);
        return convertTeamToDTO(updatedTeam);
    }

    public void deleteTeam(Long projectId, Long teamId)
    {
        Team team = teamDataPool.findById(teamId)
                .orElseThrow(() -> new ResourceNotFoundException("Team not found"));

        if(!team.getProject().getProjectId().equals(projectId))
            throw new ResourceNotFoundException("Team not found in this project");

        teamDataPool.delete(team);
    }

    public TeamDTO createTeam(Long projectId, TeamDTO teamDTO)
    {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        Team team = new Team();
        team.setTeamName(teamDTO.getTeamName());
        team.setIconName(teamDTO.getIconName());
        team.setProject(project);
        team.setCreatedAt(LocalDateTime.now());
        team.setUpdatedAt(LocalDateTime.now());

        Team savedTeam = teamDataPool.save(team);
        return convertTeamToDTO(savedTeam);
    }
}