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
        FileDTO fileDTO = fileService.uploadFile(file, userId);
        return ResponseEntity.ok(fileDTO);
    }

    @GetMapping("/{fileId}")
    public ResponseEntity<FileDTO> getFile(@PathVariable Long fileId) {
        
        FileDTO fileDTO = fileService.getFileById(fileId);
        
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
        
        try {
            Path filePath = fileService.getFileStorageLocation().resolve(fileName).normalize();
            

            if (!Files.exists(filePath)) {
                
                return ResponseEntity.notFound().build();
            }

            byte[] fileContent = Files.readAllBytes(filePath);
            

            MediaType mediaType = getMediaTypeForFileName(fileName);
            

            return ResponseEntity.ok()
                    .contentType(mediaType)
                    .body(fileContent);
        } catch (IOException e) {
            
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{fileId}")
    public ResponseEntity<Void> deleteFile(@PathVariable Long fileId) {
        
        fileService.deleteFile(fileId);
        
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<FileDTO>> getFilesByUser(@PathVariable String userId) {
        
        List<File> files = fileRepository.findByUploadedByUserId(userId);
        List<FileDTO> fileDTOs = files.stream()
                .map(fileService::convertToDTO)
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(fileDTOs);
    }
}
