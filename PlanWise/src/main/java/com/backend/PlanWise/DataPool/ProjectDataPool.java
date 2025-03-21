package com.backend.PlanWise.DataPool;

import com.backend.PlanWise.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectDataPool extends JpaRepository<Project, Long> {
    @Query("SELECT DISTINCT p FROM Project p " +
            "LEFT JOIN FETCH p.categories c " +
            "LEFT JOIN FETCH c.taskLists tl " +
            "LEFT JOIN FETCH tl.entries e " +
            "WHERE p.owner.userId = :userId")
    List<Project> findByOwnerUserId(@Param("userId") Long userId);

    @Query("SELECT DISTINCT p FROM Project p " +
            "LEFT JOIN FETCH p.categories c " +
            "LEFT JOIN FETCH c.taskLists tl " +
            "LEFT JOIN FETCH tl.entries e " +
            "WHERE :userId MEMBER OF p.members")
    List<Project> findByMembersUserId(@Param("userId") Long userId);
}