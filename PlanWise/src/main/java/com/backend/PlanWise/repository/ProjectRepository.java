package com.backend.PlanWise.repository;

import com.backend.PlanWise.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Integer> {
    // Custom methods here
}