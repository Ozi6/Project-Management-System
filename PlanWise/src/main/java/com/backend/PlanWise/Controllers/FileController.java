package com.backend.PlanWise.Controllers;

import com.backend.PlanWise.DataPool.FileDataPool;
import com.backend.PlanWise.DataTransferObjects.FileDTO;
import com.backend.PlanWise.model.File;
import com.backend.PlanWise.servicer.FileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/files")
public class FileController
{
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
    public ResponseEntity<FileDTO> getFile(@PathVariable Long fileId)
    {
        FileDTO fileDTO = fileService.getFileById(fileId);
        return ResponseEntity.ok(fileDTO);
    }

    @DeleteMapping("/{fileId}")
    public ResponseEntity<Void> deleteFile(@PathVariable Long fileId)
    {
        fileService.deleteFile(fileId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<FileDTO>> getFilesByUser(@PathVariable String userId)
    {
        List<File> files = fileRepository.findByUploadedByUserId(userId);
        List<FileDTO> fileDTOs = files.stream()
                .map(fileService::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(fileDTOs);
    }
}
