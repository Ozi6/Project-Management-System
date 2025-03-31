package com.backend.PlanWise.DataPool;

import com.backend.PlanWise.model.ListEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ListEntryDataPool extends JpaRepository<ListEntry, Long>
{
    List<ListEntry> findByTaskListTaskListId(Long taskListId);
    List<ListEntry> findByAssignedUsersUserId(String userId);
    List<ListEntry> findByAssignedTeamsTeamId(Long teamId);
    List<ListEntry> findByIsChecked(Boolean isChecked);
    List<ListEntry> findByDueDateBefore(LocalDateTime date);

    @Modifying
    @Query("DELETE FROM ListEntry e WHERE e.taskList.taskListId = :taskListId")
    void deleteByTaskListTaskListId(@Param("taskListId") Long taskListId);

    @Query("SELECT e.file.fileId FROM ListEntry e WHERE e.taskList.taskListId = :taskListId AND e.file IS NOT NULL")
    List<Long> findFileIdsByTaskListId(@Param("taskListId") Long taskListId);

    @Query("SELECT e.file.fileId FROM ListEntry e WHERE e.taskList.taskListId IN :taskListIds AND e.file IS NOT NULL")
    List<Long> findFileIdsByTaskListIds(@Param("taskListIds") List<Long> taskListIds);

    @Modifying
    @Query("DELETE FROM ListEntry e WHERE e.taskList.taskListId IN :taskListIds")
    void deleteByTaskListIdIn(@Param("taskListIds") List<Long> taskListIds);
}