package com.backend.PlanWise.servicer;

import com.backend.PlanWise.DataTransferObjects.*;
import com.backend.PlanWise.model.*;
import com.backend.PlanWise.DataPool.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProjectServicer
{

    @Autowired
    private ProjectDataPool projectRepository;

    @Autowired
    private UserService userService;

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

    public List<ProjectDTO> getProjectsByUserId(String userId)
    {
        List<Project> ownedProjects = projectRepository.findByOwnerUserId(userId);
        List<Project> memberProjects = projectRepository.findByMembersUserId(userId);
        return ownedProjects.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private ProjectDTO convertToDTO(Project project)
    {
        ProjectDTO dto = new ProjectDTO();
        dto.setProjectId(project.getProjectId());
        dto.setProjectName(project.getProjectName());
        dto.setDescription(project.getDescription());
        dto.setCreatedAt(project.getCreatedAt());

        UserDTO ownerDTO = new UserDTO();
        ownerDTO.setUserId(project.getOwner().getUserId());
        ownerDTO.setUsername(project.getOwner().getUsername());
        ownerDTO.setEmail(project.getOwner().getEmail());
        dto.setOwner(ownerDTO);

        dto.setMembers(project.getMembers().stream()
                .map(this::convertUserToDTO)
                .collect(Collectors.toSet()));

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

        return dto;
    }

    private UserDTO convertUserToDTO(User user)
    {
        UserDTO dto = new UserDTO();
        dto.setUserId(user.getUserId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
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
        dto.setWarningThreshold(entry.getWarningThreshold());

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
        // Create or retrieve local user record from Clerk ID
        User owner = userService.getOrCreateLocalUser(
            projectDTO.getOwner().getUserId(),
            projectDTO.getOwner().getEmail(),
            projectDTO.getOwner().getUsername()
        );

        // Now use the local user ID which exists in your database
        Project project = new Project();
        project.setProjectName(projectDTO.getProjectName());
        project.setDescription(projectDTO.getDescription());
        project.setOwner(owner);
        // other fields...

        Project savedProject = projectRepository.save(project);
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
        entry.setWarningThreshold(entryDTO.getWarningThreshold());
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
}
