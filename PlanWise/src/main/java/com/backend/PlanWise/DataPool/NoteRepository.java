package com.backend.PlanWise.DataPool;

import com.backend.PlanWise.model.Notes;
import com.backend.PlanWise.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NoteRepository extends JpaRepository<Notes, Long>
{
    List<Notes> findByProjectOrderByCreatedAtDesc(Project project);
    List<Notes> findByProjectProjectIdOrderByCreatedAtDesc(Long projectId);
    List<Notes> findByUser_UserIdOrderByCreatedAtDesc(String userId);
    @Query("SELECT n FROM Notes n WHERE n.project = :project AND (n.user.id = :userId OR n.shared = true) ORDER BY n.createdAt DESC")
    List<Notes> findByProjectAndUserOrSharedOrderByCreatedAtDesc(
            @Param("project") Project project,
            @Param("userId") String userId,
            @Param("shared") boolean shared);
}