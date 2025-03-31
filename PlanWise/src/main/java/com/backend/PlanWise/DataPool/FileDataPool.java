package com.backend.PlanWise.DataPool;

import com.backend.PlanWise.model.File;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FileDataPool extends JpaRepository<File, Long>
{
    List<File> findByUploadedByUserId(String userId);

    @Modifying
    @Query("DELETE FROM File f WHERE f.fileId IN :fileIds")
    void deleteAllByIds(@Param("fileIds") List<Long> fileIds);
}