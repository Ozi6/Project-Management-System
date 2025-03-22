package com.backend.PlanWise.DataPool;

import com.backend.PlanWise.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CategoryDataPool extends JpaRepository<Category, Long>
{
    List<Category> findByProjectProjectId(Long projectId);
}