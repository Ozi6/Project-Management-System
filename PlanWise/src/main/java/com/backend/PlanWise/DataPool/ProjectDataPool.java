package com.backend.PlanWise.DataPool;

import com.backend.PlanWise.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Repository
public interface ProjectDataPool extends JpaRepository<Project, Long> {
        @Query("SELECT DISTINCT p FROM Project p " +
                        "LEFT JOIN FETCH p.categories c " +                        "LEFT JOIN FETCH c.taskLists tl " +
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

        @Query("SELECT DISTINCT p FROM Project p " +
                        "LEFT JOIN FETCH p.members m " + // Join with ProjectMember to get members
                        "LEFT JOIN FETCH p.categories c " +
                        "LEFT JOIN FETCH c.taskLists tl " +
                        "LEFT JOIN FETCH tl.entries e " +
                        "WHERE p.projectId = :projectId")
        Project findByIdWithMembers(@Param("projectId") Long projectId);

        @Query("SELECT p FROM Project p " +
                        "LEFT JOIN FETCH p.categories c " +
                        "LEFT JOIN FETCH c.taskLists t " +
                        "LEFT JOIN FETCH t.entries e " +
                        "WHERE p.projectId = :projectId")
        Project findByIdWithFullHierarchy(@Param("projectId") Long projectId);

        @Query(value = "SELECT progress_percentage FROM project_progress_history " +
                        "WHERE project_id = :projectId AND recorded_date <= :date " +
                        "ORDER BY recorded_date DESC LIMIT 1", nativeQuery = true)
        Double findHistoricalProgressForDate(@Param("projectId") Long projectId, @Param("date") LocalDate date);

        @Query(value = "SELECT recorded_date, progress_percentage FROM project_progress_history " +
                        "WHERE project_id = :projectId AND recorded_date BETWEEN :startDate AND :endDate " +
                        "ORDER BY recorded_date", nativeQuery = true)
        Map<LocalDate, Double> findProgressHistoryBetweenDates(
                        @Param("projectId") Long projectId,
                        @Param("startDate") LocalDate startDate,
                        @Param("endDate") LocalDate endDate);

        // New methods for dashboard statistics
        @Query(value = "SELECT COUNT(*) FROM projects WHERE owner_id = :userId OR " +
                        "project_id IN (SELECT project_id FROM project_members WHERE user_id = :userId)", nativeQuery = true)
        Integer countUserProjects(@Param("userId") String userId);

        @Query(value = "SELECT COUNT(*) FROM projects WHERE (owner_id = :userId OR " +
                        "project_id IN (SELECT project_id FROM project_members WHERE user_id = :userId)) " +
                        "AND created_at >= :startDate", nativeQuery = true)
        Integer countProjectsCreatedSince(@Param("userId") String userId, @Param("startDate") LocalDate startDate);

        @Query(value = "SELECT COUNT(*) FROM task_lists tl " +
                        "JOIN categories c ON tl.category_id = c.category_id " +
                        "JOIN projects p ON c.project_id = p.project_id " +
                        "WHERE (p.owner_id = :userId OR p.project_id IN " +
                        "(SELECT project_id FROM project_members WHERE user_id = :userId)) " +
                        "AND tl.created_at >= :startDate", nativeQuery = true)
        Integer countTaskListsCreatedSince(@Param("userId") String userId, @Param("startDate") LocalDate startDate);

        @Query(value = "SELECT COUNT(*) FROM list_entries le " +
                        "JOIN task_lists tl ON le.task_list_id = tl.task_list_id " +
                        "JOIN categories c ON tl.category_id = c.category_id " +
                        "JOIN projects p ON c.project_id = p.project_id " +
                        "WHERE (p.owner_id = :userId OR p.project_id IN " +
                        "(SELECT project_id FROM project_members WHERE user_id = :userId)) " +
                        "AND le.created_at >= :startDate", nativeQuery = true)
        Integer countEntriesCreatedSince(@Param("userId") String userId, @Param("startDate") LocalDate startDate);

        @Query(value = "SELECT COUNT(*) FROM task_lists tl " +
                        "JOIN categories c ON tl.category_id = c.category_id " +
                        "JOIN projects p ON c.project_id = p.project_id " +
                        "WHERE (p.owner_id = :userId OR p.project_id IN " +
                        "(SELECT project_id FROM project_members WHERE user_id = :userId))", nativeQuery = true)
        Integer countTotalTaskLists(@Param("userId") String userId);

        @Query(value = "SELECT COUNT(*) FROM list_entries le " +
                        "JOIN task_lists tl ON le.task_list_id = tl.task_list_id " +
                        "JOIN categories c ON tl.category_id = c.category_id " +
                        "JOIN projects p ON c.project_id = p.project_id " +
                        "WHERE (p.owner_id = :userId OR p.project_id IN " +
                        "(SELECT project_id FROM project_members WHERE user_id = :userId))", nativeQuery = true)
        Integer countTotalEntries(@Param("userId") String userId);

        @Query(value = "SELECT COUNT(*) FROM list_entries le " +
                        "JOIN task_lists tl ON le.task_list_id = tl.task_list_id " +
                        "JOIN categories c ON tl.category_id = c.category_id " +
                        "JOIN projects p ON c.project_id = p.project_id " +
                        "WHERE (p.owner_id = :userId OR p.project_id IN " +
                        "(SELECT project_id FROM project_members WHERE user_id = :userId)) " +
                        "AND le.is_checked = true", nativeQuery = true)
        Integer countCompletedEntries(@Param("userId") String userId);

        @Query(value = "SELECT COUNT(*) FROM list_entries le " +
                        "JOIN task_lists tl ON le.task_list_id = tl.task_list_id " +
                        "JOIN categories c ON tl.category_id = c.category_id " +
                        "JOIN projects p ON c.project_id = p.project_id " +
                        "WHERE (p.owner_id = :userId OR p.project_id IN " +
                        "(SELECT project_id FROM project_members WHERE user_id = :userId)) " +
                        "AND le.is_checked = true " +
                        "AND le.updated_at >= :startDate", nativeQuery = true)
        Integer countEntriesCompletedSince(@Param("userId") String userId, @Param("startDate") LocalDate startDate);

        @Query("SELECT CASE WHEN COUNT(u) > 0 THEN true ELSE false END " +
                "FROM Project p JOIN p.members u " +
                "WHERE p.projectId = :projectId AND u.userId = :userId")
        boolean existsUserInProject(@Param("projectId") Long projectId, @Param("userId") String userId);
}