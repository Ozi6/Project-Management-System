package com.backend.PlanWise.DataPool;

import com.backend.PlanWise.model.Team;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TeamDataPool extends JpaRepository<Team, Long>
{
    List<Team> findByProjectProjectId(Long projectId);
    List<Team> findByMembersUserId(Long userId);
}