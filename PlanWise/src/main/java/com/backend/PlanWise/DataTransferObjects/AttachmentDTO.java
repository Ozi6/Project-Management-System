package com.backend.PlanWise.DataTransferObjects;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class AttachmentDTO
{
    private Long messageId;

    public byte[] getFileData()
    {
        return fileData;
    }

    public void setFileData(byte[] fileData)
    {
        this.fileData = fileData;
    }

    private byte[] fileData;

    public Long getId()
    {
        return id;
    }

    public void setId(Long id)
    {
        this.id = id;
    }

    public String getFileName()
    {
        return fileName;
    }

    public void setFileName(String fileName)
    {
        this.fileName = fileName;
    }

    public String getFileType()
    {
        return fileType;
    }

    public void setFileType(String fileType)
    {
        this.fileType = fileType;
    }

    public Long getFileSize()
    {
        return fileSize;
    }

    public void setFileSize(Long fileSize)
    {
        this.fileSize = fileSize;
    }

    public LocalDateTime getUploadedAt()
    {
        return uploadedAt;
    }

    public void setUploadedAt(LocalDateTime uploadedAt)
    {
        this.uploadedAt = uploadedAt;
    }

    private Long id;
    private String fileName;
    private String fileType;
    private Long fileSize;
    private LocalDateTime uploadedAt;

    public AttachmentDTO(Long id, String fileName, String fileType, Long fileSize, LocalDateTime uploadedAt)
    {
        this.id = id;
        this.fileName = fileName;
        this.fileType = fileType;
        this.fileSize = fileSize;
        this.uploadedAt = uploadedAt;
    }

    public AttachmentDTO(Long id, String fileName, String fileType, Long fileSize, LocalDateTime uploadedAt, byte[] fileData)
    {
        this.id = id;
        this.fileName = fileName;
        this.fileType = fileType;
        this.fileSize = fileSize;
        this.uploadedAt = uploadedAt;
        this.fileData = fileData;
    }

    public AttachmentDTO(Long id, String fileName, String fileType, Long fileSize, LocalDateTime uploadedAt, byte[] fileData, Long messageId) {
        this.id = id;
        this.fileName = fileName;
        this.fileType = fileType;
        this.fileSize = fileSize;
        this.uploadedAt = uploadedAt;
        this.fileData = fileData;
        this.messageId = messageId;
    }
}
