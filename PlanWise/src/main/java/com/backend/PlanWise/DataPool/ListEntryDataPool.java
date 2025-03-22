package com.backend.PlanWise.DataPool;

import com.backend.PlanWise.model.ListEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ListEntryDataPool extends JpaRepository<ListEntry, Long>
{
    List<ListEntry> findByTaskListTaskListId(Long taskListId);
    List<ListEntry> findByAssignedUsersUserId(Long userId);
    List<ListEntry> findByAssignedTeamsTeamId(Long teamId);
    List<ListEntry> findByIsChecked(Boolean isChecked);
    List<ListEntry> findByDueDateBefore(LocalDateTime date);
}