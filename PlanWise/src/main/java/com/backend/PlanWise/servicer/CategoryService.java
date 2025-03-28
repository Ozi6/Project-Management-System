package com.backend.PlanWise.servicer;

import com.backend.PlanWise.DataPool.CategoryDataPool;
import com.backend.PlanWise.DataPool.ProjectDataPool;
import com.backend.PlanWise.DataTransferObjects.CategoryDTO;
import com.backend.PlanWise.model.Category;
import com.backend.PlanWise.model.Project;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class CategoryService
{

    @Autowired
    private CategoryDataPool categoryDataPool;

    @Autowired
    private ProjectDataPool projectDataPool;

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
}