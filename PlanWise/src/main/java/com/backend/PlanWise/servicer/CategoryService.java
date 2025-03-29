package com.backend.PlanWise.servicer;

import com.backend.PlanWise.DataPool.CategoryDataPool;
import com.backend.PlanWise.DataPool.ProjectDataPool;
import com.backend.PlanWise.DataPool.TaskListDataPool;
import com.backend.PlanWise.DataTransferObjects.CategoryDTO;
import com.backend.PlanWise.DataTransferObjects.ListEntryDTO;
import com.backend.PlanWise.DataTransferObjects.TaskListDTO;
import com.backend.PlanWise.model.Category;
import com.backend.PlanWise.model.Project;
import com.backend.PlanWise.model.TaskList;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class CategoryService
{

    @Autowired
    private CategoryDataPool categoryDataPool;

    @Autowired
    private ProjectDataPool projectDataPool;

    @Autowired
    private TaskListDataPool taskListDataPool;

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

        CategoryDTO savedCategoryDTO = new CategoryDTO();
        savedCategoryDTO.setCategoryId(savedCategory.getCategoryId());
        savedCategoryDTO.setCategoryName(savedCategory.getCategoryName());
        savedCategoryDTO.setColor(savedCategory.getColor());

        return savedCategoryDTO;
    }

    public Set<CategoryDTO> getCategoriesByProjectId(Long projectId)
    {
        List<Category> categories = categoryDataPool.findByProjectProjectId(projectId);
        return categories.stream().map(category -> {
            CategoryDTO categoryDTO = new CategoryDTO();
            categoryDTO.setCategoryId(category.getCategoryId());
            categoryDTO.setCategoryName(category.getCategoryName());
            categoryDTO.setColor(category.getColor());

            Set<TaskList> taskLists = new HashSet<>(taskListDataPool.findByCategoryCategoryId(category.getCategoryId()));
            Set<TaskListDTO> taskListDTOs = taskLists.stream().map(taskList -> {
                TaskListDTO taskListDTO = new TaskListDTO();
                taskListDTO.setTaskListId(taskList.getTaskListId());
                taskListDTO.setTaskListName(taskList.getTaskListName());
                taskListDTO.setColor(taskList.getColor());

                if(taskList.getEntries() != null)
                {
                    Set<ListEntryDTO> entryDTOs = taskList.getEntries().stream().map(entry -> {
                        ListEntryDTO entryDTO = new ListEntryDTO();
                        entryDTO.setEntryId(entry.getEntryId());
                        entryDTO.setEntryName(entry.getEntryName());
                        entryDTO.setIsChecked(entry.getIsChecked());
                        entryDTO.setDueDate(entry.getDueDate());
                        entryDTO.setWarningThreshold(entry.getWarningThreshold());
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

    public CategoryDTO updateCategory(Long categoryId, CategoryDTO categoryDTO)
    {
        Category existingCategory = categoryDataPool.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        existingCategory.setCategoryName(categoryDTO.getCategoryName());
        existingCategory.setColor(categoryDTO.getColor());
        existingCategory.setUpdatedAt(LocalDateTime.now());
        Category updatedCategory = categoryDataPool.save(existingCategory);
        CategoryDTO updatedCategoryDTO = new CategoryDTO();
        updatedCategoryDTO.setCategoryId(updatedCategory.getCategoryId());
        updatedCategoryDTO.setCategoryName(updatedCategory.getCategoryName());
        updatedCategoryDTO.setColor(updatedCategory.getColor());
        return updatedCategoryDTO;
    }
}