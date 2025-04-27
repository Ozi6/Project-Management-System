package com.backend.PlanWise.repository;

import com.backend.PlanWise.model.PollVote;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PollVoteRepository extends JpaRepository<PollVote, Long>
{
    boolean existsByPollIdAndUserId(Long pollId, String userId);
    Optional<PollVote> findByPollIdAndUserId(Long pollId, String userId);
}