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
            log.info("Created file storage directory at: {}", this.fileStorageLocation);
        } catch (IOException ex) {
            log.error("Could not create the directory where the uploaded files will be stored: {}", ex.getMessage());
            throw new FileStorageException("Could not create the directory where the uploaded files will be stored.",
                    ex);
        }
    }

    public Path getFileStorageLocation() {
        log.info("Getting file storage location: {}", fileStorageLocation);
        return fileStorageLocation;
    }

    public FileDTO uploadFile(MultipartFile file, String userId) throws IOException {
        log.info("Uploading file: {}, userId: {}", file.getOriginalFilename(), userId);
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
            log.info("Storing file at: {}", targetLocation);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            fileEntity = fileDataPool.save(fileEntity);
            log.info("Successfully saved file entity with id: {}", fileEntity.getFileId());

            return convertToDTO(fileEntity);
        } catch (IOException ex) {
            log.error("Could not store file {}. Please try again!", fileName, ex);
            throw new RuntimeException("Could not store file " + fileName + ". Please try again!", ex);
        }
    }

    public FileDTO getFileById(Long fileId) {
        log.info("Getting file by id: {}", fileId);
        File file = getFileEntity(fileId);
        return convertToDTO(file);
    }

    public String storeFile(MultipartFile file) {
        String fileName = StringUtils.cleanPath(file.getOriginalFilename());
        log.info("Storing file: {}", fileName);
        try {
            if (fileName.contains("..")) {
                log.warn("Invalid file path sequence: {}", fileName);
                throw new FileStorageException("Invalid file path sequence " + fileName);
            }

            log.info("File details - Name: {}, Size: {}, Content Type: {}",
                    fileName, file.getSize(), file.getContentType());

            String fileExtension = StringUtils.getFilenameExtension(fileName);
            String newFileName = UUID.randomUUID().toString() + "." + fileExtension;
            Path targetLocation = this.fileStorageLocation.resolve(newFileName);

            log.info("File storage location exists: {}", Files.exists(this.fileStorageLocation));
            log.info("File storage location is writable: {}", Files.isWritable(this.fileStorageLocation));
            log.info("Storing file at location: {}", targetLocation);

            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            log.info("File successfully copied to target location");
            log.info("Target file exists: {}", Files.exists(targetLocation));
            log.info("Target file size: {} bytes", Files.size(targetLocation));

            String imageUrl = "/api/files/name/" + newFileName;
            log.info("Successfully stored file. URL: {}", imageUrl);
            return imageUrl;
        } catch (IOException ex) {
            log.error("Failed to store file {}: {}", fileName, ex.getMessage(), ex);
            throw new FileStorageException("Could not store file " + fileName, ex);
        }
    }

    @Transactional
    public void deleteFile(Long fileId) {
        log.info("Deleting file with id: {}", fileId);
        List<ListEntry> entriesWithFile = listEntryDataPool.findByFileFileId(fileId);

        for (ListEntry entry : entriesWithFile) {
            entry.setFile(null);
            listEntryDataPool.save(entry);
        }

        File file = getFileEntity(fileId);
        try {
            Path filePath = this.fileStorageLocation.resolve(file.getFileName()).normalize();
            log.info("Deleting file at path: {}", filePath);
            Files.deleteIfExists(filePath);
            fileDataPool.delete(file);
            log.info("Successfully deleted file with id: {}", fileId);
        } catch (IOException ex) {
            log.error("Could not delete file {}. Please try again!", file.getFileName(), ex);
            throw new RuntimeException("Could not delete file " + file.getFileName() + ". Please try again!", ex);
        }
    }

    public File getFileEntity(Long fileId) {
        log.info("Getting file entity by id: {}", fileId);
        return fileDataPool.findById(fileId)
                .orElseThrow(() -> {
                    log.error("File not found with id: {}", fileId);
                    return new RuntimeException("File not found with id: " + fileId);
                });
    }

    public FileDTO convertToDTO(File file) {
        log.info("Converting file to DTO: {}", file.getFileName());
        FileDTO dto = new FileDTO();
        dto.setFileId(file.getFileId());
        dto.setFileName(file.getFileName());
        dto.setOriginalFileName(file.getOriginalFileName());
        dto.setFileType(file.getFileType());
        dto.setFileSize(file.getFileSize());
        dto.setUploadedBy(file.getUploadedBy().getUserId());
        dto.setUploadedAt(file.getUploadedAt());
        dto.setUrl("/api/files/name/" + file.getFileName());
        log.info("Successfully converted file to DTO with url: {}", dto.getUrl());
        return dto;
    }

    @Transactional
    public void deleteAllFilesByIds(List<Long> fileIds) {
        if (fileIds != null && !fileIds.isEmpty())
            fileDataPool.deleteAllByIds(fileIds);
    }
}
