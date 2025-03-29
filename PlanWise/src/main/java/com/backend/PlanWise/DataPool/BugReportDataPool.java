package com.backend.PlanWise.DataPool;

import com.backend.PlanWise.model.BugReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BugReportDataPool extends JpaRepository<BugReport, Long> {
    List<BugReport> findByReportedByUserId(String userId);
    List<BugReport> findByStatus(String status);
    List<BugReport> findByPriority(String priority);
}