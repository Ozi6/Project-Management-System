package com.backend.PlanWise.DataTransferObjects;

public class FileDTO
{
    private Long fileId;
    private String fileName;
    private Integer fileSize;
    private String fileType;
    private String fileDataBase64;

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

    public String getFileDataBase64()
    {
        return fileDataBase64;
    }

    public void setFileDataBase64(String fileDataBase64)
    {
        this.fileDataBase64 = fileDataBase64;
    }
}