package com.backend.PlanWise.servicer;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import com.backend.PlanWise.DataPool.FileDataPool;
import com.backend.PlanWise.DataPool.ListEntryDataPool;
import com.backend.PlanWise.DataPool.UserDataPool;
import com.backend.PlanWise.DataTransferObjects.FileDTO;
import com.backend.PlanWise.exception.FileStorageException;
import com.backend.PlanWise.model.File;
import com.backend.PlanWise.model.ListEntry;
import com.backend.PlanWise.model.User;

import jakarta.transaction.Transactional;

@Service
public class FileService {

    private static final Logger log = LoggerFactory.getLogger(FileService.class);

    @Autowired
    private FileDataPool fileDataPool;

    @Autowired
    private UserDataPool userDataPool;

    @Autowired
    private ListEntryDataPool listEntryDataPool;
    private final Path fileStorageLocation;

    @Autowired
    public FileService(@Value("${file.upload-dir}") String uploadDir) {
        this.fileStorageLocation = Paths.get(uploadDir)
                .toAbsolutePath().normalize();

        try {
            Files.createDirectories(this.fileStorageLocation);
            
        } catch (IOException ex) {
         
            throw new FileStorageException("Could not create the directory where the uploaded files will be stored.",
                    ex);
        }
    }

    public Path getFileStorageLocation() {
        
        return fileStorageLocation;
    }

    public FileDTO uploadFile(MultipartFile file, String userId) throws IOException {
        
        User user = userDataPool.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        String fileName = StringUtils.cleanPath(file.getOriginalFilename());
        String uniqueFileName = UUID.randomUUID().toString() + "_" + fileName;

        File fileEntity = new File();
        fileEntity.setFileName(uniqueFileName);
        fileEntity.setOriginalFileName(fileName);
        fileEntity.setFileType(file.getContentType());
        fileEntity.setFileSize(file.getSize());
        fileEntity.setUploadedBy(user);
        fileEntity.setUploadedAt(LocalDateTime.now());

        try {
            Path targetLocation = this.fileStorageLocation.resolve(uniqueFileName);
            
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            fileEntity = fileDataPool.save(fileEntity);

            return convertToDTO(fileEntity);
        } catch (IOException ex) {
            
            throw new RuntimeException("Could not store file " + fileName + ". Please try again!", ex);
        }
    }

    public FileDTO getFileById(Long fileId) {
        
        File file = getFileEntity(fileId);
        return convertToDTO(file);
    }

    public String storeFile(MultipartFile file) {
        String fileName = StringUtils.cleanPath(file.getOriginalFilename());
        
        try {
            if (fileName.contains("..")) {
                
                throw new FileStorageException("Invalid file path sequence " + fileName);
            }

            String fileExtension = StringUtils.getFilenameExtension(fileName);
            String newFileName = UUID.randomUUID().toString() + "." + fileExtension;
            Path targetLocation = this.fileStorageLocation.resolve(newFileName);

 

            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            String imageUrl = "/api/files/name/" + newFileName;
            
            return imageUrl;
        } catch (IOException ex) {

            throw new FileStorageException("Could not store file " + fileName, ex);
        }
    }

    @Transactional
    public void deleteFile(Long fileId) {
        
        List<ListEntry> entriesWithFile = listEntryDataPool.findByFileFileId(fileId);

        for (ListEntry entry : entriesWithFile) {
            entry.setFile(null);
            listEntryDataPool.save(entry);
        }

        File file = getFileEntity(fileId);
        try {
            Path filePath = this.fileStorageLocation.resolve(file.getFileName()).normalize();
            
            Files.deleteIfExists(filePath);
            fileDataPool.delete(file);
            
        } catch (IOException ex) {
            
            throw new RuntimeException("Could not delete file " + file.getFileName() + ". Please try again!", ex);
        }
    }

    public File getFileEntity(Long fileId) {
        
        return fileDataPool.findById(fileId)
                .orElseThrow(() -> {
                    
                    return new RuntimeException("File not found with id: " + fileId);
                });
    }

    public FileDTO convertToDTO(File file) {

        FileDTO dto = new FileDTO();
        dto.setFileId(file.getFileId());
        dto.setFileName(file.getFileName());
        dto.setOriginalFileName(file.getOriginalFileName());
        dto.setFileType(file.getFileType());
        dto.setFileSize(file.getFileSize());
        dto.setUploadedBy(file.getUploadedBy().getUserId());
        dto.setUploadedAt(file.getUploadedAt());
        dto.setUrl("/api/files/name/" + file.getFileName());
        
        return dto;
    }

    @Transactional
    public void deleteAllFilesByIds(List<Long> fileIds) {
        if (fileIds != null && !fileIds.isEmpty())
            fileDataPool.deleteAllByIds(fileIds);
    }
}
