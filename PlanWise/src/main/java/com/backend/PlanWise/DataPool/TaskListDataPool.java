package com.backend.PlanWise.DataPool;

import com.backend.PlanWise.model.TaskList;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TaskListDataPool extends JpaRepository<TaskList, Long>
{
    List<TaskList> findByCategoryCategoryId(Long categoryId);
}