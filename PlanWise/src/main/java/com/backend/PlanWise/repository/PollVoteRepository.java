package com.backend.PlanWise.repository;

import com.backend.PlanWise.model.PollVote;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PollVoteRepository extends JpaRepository<PollVote, Long>
{
    boolean existsByPollIdAndUserId(Long pollId, String userId);
}