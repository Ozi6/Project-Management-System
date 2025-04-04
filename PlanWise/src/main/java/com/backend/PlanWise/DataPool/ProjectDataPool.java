package com.backend.PlanWise.DataPool;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.backend.PlanWise.model.Project;

@Repository
public interface ProjectDataPool extends JpaRepository<Project, Long> {
        @Query("SELECT DISTINCT p FROM Project p " +
                        "LEFT JOIN FETCH p.categories c " +
                        "LEFT JOIN FETCH c.taskLists tl " +
                        "LEFT JOIN FETCH tl.entries e " +
                        "WHERE p.owner.userId = :userId")
        List<Project> findByOwnerUserId(@Param("userId") String userId);

        @Query("SELECT DISTINCT p FROM Project p " +
                        "JOIN p.members m " +
                        "LEFT JOIN FETCH p.categories c " +
                        "LEFT JOIN FETCH c.taskLists tl " +
                        "LEFT JOIN FETCH tl.entries e " +
                        "WHERE m.userId = :userId")
        List<Project> findByMembersUserId(@Param("userId") String userId);

        @Query("SELECT p FROM Project p " +
                        "LEFT JOIN FETCH p.members m " +
                        "LEFT JOIN FETCH p.owner o " +
                        "WHERE p.projectId = :id")
        Project findByIdWithMembers(@Param("id") Long id);
}