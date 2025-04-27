package com.backend.PlanWise.repository;

import com.backend.PlanWise.model.Poll;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PollRepository extends JpaRepository<Poll, Long>
{

}