package com.backend.PlanWise.DataPool;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.backend.PlanWise.model.RecentActivity;

@Repository
public interface RecentActivityDataPool extends JpaRepository<RecentActivity, Long> {
    @Query("SELECT ra FROM RecentActivity ra WHERE ra.project.projectId = :projectId ORDER BY ra.activityTime DESC")
    List<RecentActivity> findByProjectIdOrderByActivityTimeDesc(Long projectId);

   @Query("SELECT ra FROM RecentActivity ra WHERE ra.project.projectId = :projectId AND ra.entityType = :entityType ORDER BY ra.activityTime DESC")
    List<RecentActivity> findByProjectIdAndEntityTypeOrderByActivityTimeDesc(
        @Param("projectId") Long projectId, 
        @Param("entityType") String entityType
    );
}