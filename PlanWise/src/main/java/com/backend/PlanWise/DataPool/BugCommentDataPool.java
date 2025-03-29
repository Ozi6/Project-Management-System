package com.backend.PlanWise.DataPool;

import com.backend.PlanWise.model.BugComment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BugCommentDataPool extends JpaRepository<BugComment, Long> {
    List<BugComment> findByBugReportBugId(Long bugId);
}