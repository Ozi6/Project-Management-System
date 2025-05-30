package com.backend.PlanWise.servicer;

import java.time.LocalDateTime;
import java.util.Base64;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.backend.PlanWise.DataPool.CategoryDataPool;
import com.backend.PlanWise.DataPool.ProjectDataPool;
import com.backend.PlanWise.DataPool.TaskListDataPool;
import com.backend.PlanWise.DataTransferObjects.CategoryDTO;
import com.backend.PlanWise.DataTransferObjects.FileDTO;
import com.backend.PlanWise.DataTransferObjects.ListEntryDTO;
import com.backend.PlanWise.DataTransferObjects.TaskListDTO;
import com.backend.PlanWise.DataTransferObjects.TeamDTO;
import com.backend.PlanWise.DataTransferObjects.UserDTO;
import com.backend.PlanWise.model.Category;
import com.backend.PlanWise.model.File;
import com.backend.PlanWise.model.Project;
import com.backend.PlanWise.model.TaskList;
import com.backend.PlanWise.model.Team;
import com.backend.PlanWise.model.User;

import jakarta.transaction.Transactional;

@Service
public class CategoryService
{

    @Autowired
    private CategoryDataPool categoryDataPool;

    @Autowired
    private ProjectDataPool projectDataPool;

    @Autowired
    private TaskListDataPool taskListDataPool;

    @Autowired
    private ListEntryService listEntryService;

    @Autowired
    private RecentActivityService recentActivityService; // Add this

    public CategoryDTO createCategory(CategoryDTO categoryDTO, Long projectId)
    {
        Project project = projectDataPool.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        Category category = new Category();
        category.setCategoryName(categoryDTO.getCategoryName());
        category.setColor(categoryDTO.getColor());
        category.setProject(project);

        LocalDateTime now = LocalDateTime.now();
        category.setCreatedAt(now);
        category.setUpdatedAt(now);

        Category savedCategory = categoryDataPool.save(category);

        // Create recent activity
        String userId = project.getOwner().getUserId(); // or get current user from security context
        recentActivityService.createSimpleActivity(
            userId,
            savedCategory.getProject().getProjectId(),
            "CREATE",
            "CATEGORY",
            savedCategory.getCategoryId()
        );

        CategoryDTO savedCategoryDTO = new CategoryDTO();
        savedCategoryDTO.setCategoryId(savedCategory.getCategoryId());
        savedCategoryDTO.setCategoryName(savedCategory.getCategoryName());
        savedCategoryDTO.setColor(savedCategory.getColor());

        return savedCategoryDTO;
    }

    @Autowired
    private UserService userService;

    @Autowired
    private TeamService teamService;

    public Set<CategoryDTO> getCategoriesByProjectId(Long projectId)
    {
        List<Category> categories = categoryDataPool.findByProjectProjectId(projectId);
        return categories.stream().map(category ->
        {
            CategoryDTO categoryDTO = new CategoryDTO();
            categoryDTO.setCategoryId(category.getCategoryId());
            categoryDTO.setCategoryName(category.getCategoryName());
            categoryDTO.setColor(category.getColor());

            Set<TaskList> taskLists = new HashSet<>(taskListDataPool.findByCategoryCategoryId(category.getCategoryId()));
            Set<TaskListDTO> taskListDTOs = taskLists.stream().map(taskList ->
            {
                TaskListDTO taskListDTO = new TaskListDTO();
                taskListDTO.setTaskListId(taskList.getTaskListId());
                taskListDTO.setTaskListName(taskList.getTaskListName());
                taskListDTO.setColor(taskList.getColor());

                if(taskList.getEntries() != null)
                {
                    Set<ListEntryDTO> entryDTOs = taskList.getEntries().stream().map(entry ->
                    {
                        ListEntryDTO entryDTO = new ListEntryDTO();
                        entryDTO.setEntryId(entry.getEntryId());
                        entryDTO.setEntryName(entry.getEntryName());
                        entryDTO.setIsChecked(entry.getIsChecked());
                        entryDTO.setDueDate(entry.getDueDate());

                        if(entry.getDueDate() != null)
                            entryDTO.setWarningThreshold(entry.getWarningThreshold() != null ? entry.getWarningThreshold() : 1);
                        else
                            entryDTO.setWarningThreshold(null);

                        if(entry.getFile() != null)
                            entryDTO.setFile(toDTO(entry.getFile()));

                        Set<UserDTO> userDTOs = new HashSet<>();
                        for(User user : entry.getAssignedUsers())
                            userDTOs.add(userService.convertToDTO(user));
                        entryDTO.setAssignedUsers(userDTOs);

                        Set<TeamDTO> teamDTOs = new HashSet<>();
                        for(Team team : entry.getAssignedTeams())
                            teamDTOs.add(teamService.convertToTeamDTO(team));
                        entryDTO.setAssignedTeams(teamDTOs);

                        return entryDTO;
                    }).collect(Collectors.toSet());
                    taskListDTO.setEntries(entryDTOs);
                }

                return taskListDTO;
            }).collect(Collectors.toSet());

            categoryDTO.setTaskLists(taskListDTOs);
            return categoryDTO;
        }).collect(Collectors.toSet());
    }

    public static FileDTO toDTO(File file)
    {
        FileDTO fileDTO = new FileDTO();
        fileDTO.setFileId(file.getFileId());
        fileDTO.setFileName(file.getFileName());
        fileDTO.setFileSize(file.getFileSize());
        fileDTO.setFileType(file.getFileType());
        fileDTO.setUploadedAt(file.getUploadedAt());

        if (file.getFileData() != null)
            fileDTO.setFileDataBase64(Base64.getEncoder().encodeToString(file.getFileData()));

        return fileDTO;
    }

    public CategoryDTO updateCategory(Long categoryId, CategoryDTO categoryDTO) {
        Category existingCategory = categoryDataPool.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        
        // Store old values if needed for activity
        String oldName = existingCategory.getCategoryName();
        String oldColor = existingCategory.getColor();
        
        existingCategory.setCategoryName(categoryDTO.getCategoryName());
        existingCategory.setColor(categoryDTO.getColor());
        existingCategory.setUpdatedAt(LocalDateTime.now());
        
        Category updatedCategory = categoryDataPool.save(existingCategory);
        
        // Create recent activity for category update
        recentActivityService.createSystemActivity(
            updatedCategory.getProject().getProjectId(),
            "UPDATE",
            "CATEGORY",
            updatedCategory.getCategoryId(),
            updatedCategory.getCategoryName()
        );
    
        CategoryDTO updatedCategoryDTO = new CategoryDTO();
        updatedCategoryDTO.setCategoryId(updatedCategory.getCategoryId());
        updatedCategoryDTO.setCategoryName(updatedCategory.getCategoryName());
        updatedCategoryDTO.setColor(updatedCategory.getColor());
        return updatedCategoryDTO;
    }

    @Transactional
    public void deleteCategory(Long categoryId) {
        // 1. First load the category with its project
        Category category = categoryDataPool.findById(categoryId)
            .orElseThrow(() -> new RuntimeException("Category not found"));
        
        // 2. Get all related task lists (for deletion)
        List<Long> taskListIds = taskListDataPool.findTaskListIdsByCategoryId(categoryId);
        
        // 3. Delete all entries in task lists
        if (!taskListIds.isEmpty()) {
            listEntryService.deleteAllByTaskListIds(taskListIds);
            taskListDataPool.deleteByCategoryId(categoryId);
        }
        
        // 4. Delete the category itself
        categoryDataPool.deleteById(categoryId);
        
        // 5. Create activity AFTER successful deletion
        recentActivityService.createSystemActivity(
            category.getProject().getProjectId(),  // Correct project ID
            "DELETE",
            "CATEGORY",
            categoryId,
            category.getCategoryName()
        );
    }
}