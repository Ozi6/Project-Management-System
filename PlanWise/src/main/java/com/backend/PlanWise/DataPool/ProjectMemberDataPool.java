package com.backend.PlanWise.DataPool;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.backend.PlanWise.model.ProjectMember;

@Repository
public interface ProjectMemberDataPool extends JpaRepository<ProjectMember, Long> {

    List<ProjectMember> findByProjectId(Long projectId);

    List<ProjectMember> findByUserId(String userId);

    Optional<ProjectMember> findByProjectIdAndUserId(Long projectId, String userId);

    @Query("SELECT pm FROM ProjectMember pm WHERE pm.projectId = :projectId AND pm.userId = :userId")
    Optional<ProjectMember> findProjectMember(@Param("projectId") Long projectId, @Param("userId") String userId);

    boolean existsByProjectIdAndUserId(Long projectId, String userId);

    void deleteByProjectIdAndUserId(Long projectId, String userId);
}