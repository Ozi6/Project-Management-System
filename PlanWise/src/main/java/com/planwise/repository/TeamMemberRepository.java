package com.planwise.repository;

import com.planwise.model.TeamMember;
import com.planwise.model.TeamMemberId;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TeamMemberRepository extends JpaRepository<TeamMember, TeamMemberId> {
    List<TeamMember> findByTeamId(Long teamId);

    List<TeamMember> findByUserId(String userId);

    boolean existsByTeamIdAndUserId(Long teamId, String userId);
}