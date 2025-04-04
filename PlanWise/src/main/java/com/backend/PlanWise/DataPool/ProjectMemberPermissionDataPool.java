package com.backend.PlanWise.DataPool;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.backend.PlanWise.model.ProjectMemberPermission;

@Repository
public interface ProjectMemberPermissionDataPool extends JpaRepository<ProjectMemberPermission, Long> {

    @Query("SELECT p FROM ProjectMemberPermission p WHERE p.projectId = :projectId AND p.userId = :userId")
    List<ProjectMemberPermission> findByProjectIdAndUserId(@Param("projectId") Long projectId,
            @Param("userId") String userId);

    @Query("SELECT p FROM ProjectMemberPermission p WHERE p.projectId = :projectId AND p.userId = :userId AND p.permissionName = :permissionName")
    Optional<ProjectMemberPermission> findByProjectIdAndUserIdAndPermissionName(
            @Param("projectId") Long projectId,
            @Param("userId") String userId,
            @Param("permissionName") String permissionName);

    @Query("SELECT COUNT(p) > 0 FROM ProjectMemberPermission p WHERE p.projectId = :projectId AND p.userId = :userId AND p.permissionName = :permissionName")
    boolean existsByProjectIdAndUserIdAndPermissionName(
            @Param("projectId") Long projectId,
            @Param("userId") String userId,
            @Param("permissionName") String permissionName);

    @Query("DELETE FROM ProjectMemberPermission p WHERE p.projectId = :projectId AND p.userId = :userId")
    void deleteByProjectIdAndUserId(@Param("projectId") Long projectId, @Param("userId") String userId);
}