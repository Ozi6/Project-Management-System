package com.backend.PlanWise.DataPool;

import com.backend.PlanWise.model.TaskList;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TaskListDataPool extends JpaRepository<TaskList, Long>
{
    List<TaskList> findByCategoryCategoryId(Long categoryId);

    @Modifying
    @Query("DELETE FROM TaskList t WHERE t.category.categoryId = :categoryId")
    void deleteByCategoryId(@Param("categoryId") Long categoryId);

    @Query("SELECT t.taskListId FROM TaskList t WHERE t.category.categoryId = :categoryId")
    List<Long> findTaskListIdsByCategoryId(@Param("categoryId") Long categoryId);
}