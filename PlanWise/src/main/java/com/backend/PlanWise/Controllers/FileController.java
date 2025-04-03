package com.backend.PlanWise.Controllers;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.backend.PlanWise.DataPool.FileDataPool;
import com.backend.PlanWise.DataTransferObjects.FileDTO;
import com.backend.PlanWise.model.File;
import com.backend.PlanWise.servicer.FileService;

@RestController
@RequestMapping("/api/files")
public class FileController {
    private static final Logger log = LoggerFactory.getLogger(FileController.class);

    @Autowired
    private FileService fileService;

    @Autowired
    private FileDataPool fileRepository;

    @PostMapping("/upload")
    public ResponseEntity<FileDTO> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam String userId) throws IOException {
        log.info("Uploading file: {}, userId: {}", file.getOriginalFilename(), userId);
        FileDTO fileDTO = fileService.uploadFile(file, userId);
        log.info("Successfully uploaded file: {}", fileDTO.getFileName());
        return ResponseEntity.ok(fileDTO);
    }

    @GetMapping("/{fileId}")
    public ResponseEntity<FileDTO> getFile(@PathVariable Long fileId) {
        log.info("Getting file by id: {}", fileId);
        FileDTO fileDTO = fileService.getFileById(fileId);
        log.info("Successfully retrieved file: {}", fileDTO.getFileName());
        return ResponseEntity.ok(fileDTO);
    }

    private MediaType getMediaTypeForFileName(String fileName) {
        String extension = fileName.substring(fileName.lastIndexOf(".") + 1).toLowerCase();
        switch (extension) {
            case "jpg":
            case "jpeg":
                return MediaType.IMAGE_JPEG;
            case "png":
                return MediaType.IMAGE_PNG;
            case "gif":
                return MediaType.IMAGE_GIF;
            case "pdf":
                return MediaType.APPLICATION_PDF;
            default:
                return MediaType.APPLICATION_OCTET_STREAM;
        }
    }

    @GetMapping("/name/{fileName}")
    public ResponseEntity<byte[]> getFileByName(@PathVariable String fileName) {
        log.info("Getting file by name: {}", fileName);
        try {
            Path filePath = fileService.getFileStorageLocation().resolve(fileName).normalize();
            log.info("Resolved file path: {}", filePath);
            log.info("File exists: {}", Files.exists(filePath));

            if (!Files.exists(filePath)) {
                log.error("File not found: {}", filePath);
                return ResponseEntity.notFound().build();
            }

            byte[] fileContent = Files.readAllBytes(filePath);
            log.info("Successfully read file. Size: {} bytes", fileContent.length);

            MediaType mediaType = getMediaTypeForFileName(fileName);
            log.info("Determined media type: {}", mediaType);

            return ResponseEntity.ok()
                    .contentType(mediaType)
                    .body(fileContent);
        } catch (IOException e) {
            log.error("Could not read file: {}", fileName, e);
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{fileId}")
    public ResponseEntity<Void> deleteFile(@PathVariable Long fileId) {
        log.info("Deleting file with id: {}", fileId);
        fileService.deleteFile(fileId);
        log.info("Successfully deleted file with id: {}", fileId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<FileDTO>> getFilesByUser(@PathVariable String userId) {
        log.info("Getting files for user: {}", userId);
        List<File> files = fileRepository.findByUploadedByUserId(userId);
        List<FileDTO> fileDTOs = files.stream()
                .map(fileService::convertToDTO)
                .collect(Collectors.toList());
        log.info("Successfully retrieved {} files for user: {}", fileDTOs.size(), userId);
        return ResponseEntity.ok(fileDTOs);
    }
}
