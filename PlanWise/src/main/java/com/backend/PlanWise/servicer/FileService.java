package com.backend.PlanWise.servicer;

import com.backend.PlanWise.DataPool.FileDataPool;
import com.backend.PlanWise.DataPool.UserDataPool;
import com.backend.PlanWise.DataTransferObjects.FileDTO;
import com.backend.PlanWise.model.File;
import com.backend.PlanWise.model.User;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.List;

@Service
public class FileService
{

    @Autowired
    private FileDataPool fileDataPool;

    @Autowired
    private UserDataPool userDataPool;

    public FileDTO uploadFile(MultipartFile file, String userId) throws IOException
    {
        User user = userDataPool.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        File newFile = new File();
        newFile.setFileName(StringUtils.cleanPath(file.getOriginalFilename()));
        newFile.setFileSize((int) file.getSize());
        newFile.setFileType(file.getContentType());
        newFile.setFileData(file.getBytes());
        newFile.setUploadedBy(user);
        newFile.setUploadedAt(LocalDateTime.now());

        File savedFile = fileDataPool.save(newFile);
        return convertToDTO(savedFile);
    }

    public FileDTO getFileById(Long fileId)
    {
        File file = fileDataPool.findById(fileId)
                .orElseThrow(() -> new RuntimeException("File not found with id: " + fileId));
        return convertToDTO(file);
    }

    public void deleteFile(Long fileId)
    {
        fileDataPool.deleteById(fileId);
    }

    public File getFileEntity(Long fileId)
    {
        return fileDataPool.findById(fileId)
                .orElseThrow(() -> new RuntimeException("File not found with id: " + fileId));
    }

    public FileDTO convertToDTO(File file)
    {
        FileDTO dto = new FileDTO();
        dto.setFileId(file.getFileId());
        dto.setFileName(file.getFileName());
        dto.setFileSize(file.getFileSize());
        dto.setFileType(file.getFileType());
        if (file.getFileData() != null) {
            dto.setFileDataBase64(Base64.getEncoder().encodeToString(file.getFileData()));
        }
        return dto;
    }

    @Transactional
    public void deleteAllFilesByIds(List<Long> fileIds)
    {
        if(fileIds != null && !fileIds.isEmpty())
            fileDataPool.deleteAllByIds(fileIds);
    }
}
