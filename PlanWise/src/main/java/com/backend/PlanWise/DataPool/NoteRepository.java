package com.backend.PlanWise.DataPool;

import com.backend.PlanWise.model.Notes;
import com.backend.PlanWise.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NoteRepository extends JpaRepository<Notes, Long> {
    List<Notes> findByProjectOrderByCreatedAtDesc(Project project);
    List<Notes> findByProjectProjectIdOrderByCreatedAtDesc(Long projectId);
    List<Notes> findByUserIdOrderByCreatedAtDesc(String userId);
}