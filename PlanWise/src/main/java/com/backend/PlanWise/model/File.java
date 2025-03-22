package com.backend.PlanWise.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "Files")
public class File {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long fileId;

    @Column(nullable = false)
    private String fileName;

    @Column(nullable = false)
    private Integer fileSize;

    @Column(nullable = false)
    private String fileType;

    @Lob
    @Column(columnDefinition = "LONGBLOB")
    private byte[] fileData;

    @ManyToOne
    @JoinColumn(name = "uploadedBy", nullable = false)
    private User uploadedBy;

    @Column
    private LocalDateTime uploadedAt;

    public Long getFileId()
    {
        return fileId;
    }

    public void setFileId(Long fileId)
    {
        this.fileId = fileId;
    }

    public String getFileName()
    {
        return fileName;
    }

    public void setFileName(String fileName)
    {
        this.fileName = fileName;
    }

    public Integer getFileSize()
    {
        return fileSize;
    }

    public void setFileSize(Integer fileSize)
    {
        this.fileSize = fileSize;
    }

    public String getFileType()
    {
        return fileType;
    }

    public void setFileType(String fileType)
    {
        this.fileType = fileType;
    }

    public byte[] getFileData()
    {
        return fileData;
    }

    public void setFileData(byte[] fileData)
    {
        this.fileData = fileData;
    }

    public User getUploadedBy()
    {
        return uploadedBy;
    }

    public void setUploadedBy(User uploadedBy)
    {
        this.uploadedBy = uploadedBy;
    }

    public LocalDateTime getUploadedAt()
    {
        return uploadedAt;
    }

    public void setUploadedAt(LocalDateTime uploadedAt)
    {
        this.uploadedAt = uploadedAt;
    }
}