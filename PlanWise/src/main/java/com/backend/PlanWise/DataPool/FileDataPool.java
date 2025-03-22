package com.backend.PlanWise.DataPool;

import com.backend.PlanWise.model.File;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FileDataPool extends JpaRepository<File, Long>
{
    List<File> findByUploadedByUserId(Long userId);
}