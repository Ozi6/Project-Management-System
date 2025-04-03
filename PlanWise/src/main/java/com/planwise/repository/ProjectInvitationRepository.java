package com.planwise.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.planwise.model.ProjectInvitation;

public interface ProjectInvitationRepository extends JpaRepository<ProjectInvitation, Long> {
    Optional<ProjectInvitation> findByToken(String token);
    Optional<ProjectInvitation> findByEmailAndProjectId(String email, Long projectId);
} 