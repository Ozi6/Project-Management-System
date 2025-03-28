package com.backend.PlanWise.Controllers;

import com.backend.PlanWise.DataTransferObjects.CategoryDTO;
import com.backend.PlanWise.servicer.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/categories")
public class CategoryController
{
    @Autowired
    private CategoryService categoryService;

    @PostMapping
    public ResponseEntity<CategoryDTO> createCategory(@RequestBody CategoryDTO categoryDTO, @RequestParam Long projectId)
    {
        CategoryDTO createdCategory = categoryService.createCategory(categoryDTO, projectId);
        return ResponseEntity.ok(createdCategory);
    }
}