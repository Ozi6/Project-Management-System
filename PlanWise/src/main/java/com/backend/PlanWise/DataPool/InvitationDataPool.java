package com.backend.PlanWise.DataPool;

import com.backend.PlanWise.model.Invitation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InvitationDataPool extends JpaRepository<Invitation, Integer>
{
    Optional<Invitation> findByEmailAndProjectId(String email, Long projectId);
    List<Invitation> findByEmailAndStatus(String email, String status);
    List<Invitation> findByProjectId(int projectId);
}
