package com.backend.PlanWise.DataPool;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.backend.PlanWise.model.RecentActivity;

@Repository
public interface RecentActivityDataPool extends JpaRepository<RecentActivity, Long> {
    List<RecentActivity> findByUserIdOrderByActivityTimeDesc(String userId);
}