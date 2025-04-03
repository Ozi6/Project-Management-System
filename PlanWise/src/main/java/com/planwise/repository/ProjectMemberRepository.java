package com.planwise.repository;

import com.planwise.model.ProjectMember;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProjectMemberRepository extends JpaRepository<ProjectMember, Long> {
    List<ProjectMember> findByProjectId(Long projectId);

    List<ProjectMember> findByUserId(String userId);

    boolean existsByProjectIdAndUserId(Long projectId, String userId);
}