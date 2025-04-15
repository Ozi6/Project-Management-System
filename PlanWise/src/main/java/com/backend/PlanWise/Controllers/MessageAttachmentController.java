package com.backend.PlanWise.Controllers;

import com.backend.PlanWise.DataTransferObjects.AttachmentDTO;
import com.backend.PlanWise.model.FileType;
import com.backend.PlanWise.model.Message;
import com.backend.PlanWise.model.MessageAttachment;
import com.backend.PlanWise.repository.MessageAttachmentRepository;
import com.backend.PlanWise.repository.MessageRepository;
import com.backend.PlanWise.servicer.MessageAttachmentService;
import jakarta.annotation.Resource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/messages")
public class MessageAttachmentController
{
    @Autowired
    private MessageAttachmentService attachmentService;

    @Autowired
    MessageRepository messageRepository;
    @Autowired
    MessageAttachmentRepository attachmentRepository;

    @PostMapping("/upload-attachment")
    public ResponseEntity<AttachmentDTO> uploadAttachment(
            @RequestParam("file") MultipartFile file,
            @RequestParam("messageId") Long messageId,
            @RequestParam("projectId") Integer projectId,
            @RequestParam("channelId") Long channelId,
            @RequestParam("userId") String userId)
    {
        try{
            if(file.isEmpty())
                return ResponseEntity.badRequest().body(null);

            MessageAttachment attachment = new MessageAttachment();
            attachment.setFileName(file.getOriginalFilename());
            attachment.setFileType(FileType.fromMimeType(file.getContentType()));
            attachment.setFileSize(file.getSize());
            attachment.setFileData(file.getBytes());
            attachment.setUploadedAt(LocalDateTime.now());

            if(attachment.getFileType() == FileType.IMAGE)
            {
                byte[] thumbnailData = generateThumbnail(file);
                attachment.setThumbnailData(thumbnailData);
            }

            Message message = messageRepository.findById(messageId)
                    .orElseThrow(() -> new RuntimeException("Message not found"));
            message.addAttachment(attachment);

            MessageAttachment savedAttachment = attachmentRepository.save(attachment);

            AttachmentDTO attachmentDTO = new AttachmentDTO(
                    savedAttachment.getId(),
                    savedAttachment.getFileName(),
                    savedAttachment.getFileType().name(),
                    savedAttachment.getFileSize(),
                    savedAttachment.getUploadedAt()
            );
            attachmentDTO.setFileData(savedAttachment.getFileData());

            return ResponseEntity.ok(attachmentDTO);
        }catch(IOException e){
            throw new RuntimeException("Failed to process file upload", e);
        }catch(RuntimeException e){
            return ResponseEntity.badRequest().body(null);
        }
    }

    private byte[] generateThumbnail(MultipartFile file) throws IOException
    {
        BufferedImage originalImage = ImageIO.read(file.getInputStream());
        int targetWidth = 100; // Adjust as needed
        int targetHeight = (int) (originalImage.getHeight() * ((double) targetWidth / originalImage.getWidth()));

        BufferedImage thumbnail = new BufferedImage(targetWidth, targetHeight, BufferedImage.TYPE_INT_ARGB);
        Graphics2D g = thumbnail.createGraphics();
        g.drawImage(originalImage.getScaledInstance(targetWidth, targetHeight, Image.SCALE_SMOOTH), 0, 0, null);
        g.dispose();

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        String format = file.getContentType().contains("png") ? "png" : "jpg";
        ImageIO.write(thumbnail, format, baos);
        return baos.toByteArray();
    }

    @GetMapping("/download-attachment/{attachmentId}")
    public ResponseEntity<Resource> downloadAttachment(@PathVariable Long attachmentId)
    {
        MessageAttachment attachment = attachmentService.getAttachment(attachmentId);
        String contentType = attachment.getFileType().getMimeTypePrefix() + "/" +
                (attachment.getFileType() == FileType.IMAGE ? "jpeg" :
                        attachment.getFileType() == FileType.DOCUMENT ? "pdf" :
                                attachment.getFileType() == FileType.AUDIO ? "mpeg" :
                                        attachment.getFileType() == FileType.VIDEO ? "mp4" : "octet-stream");

        ByteArrayResource byteArrayResource = new ByteArrayResource(attachment.getFileData());
        Resource resource = (Resource) byteArrayResource;

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + attachment.getFileName() + "\"")
                .contentType(MediaType.parseMediaType(contentType))
                .body(resource);
    }

    @GetMapping("/attachment-thumbnail/{attachmentId}")
    public ResponseEntity<Resource> getThumbnail(@PathVariable Long attachmentId)
    {
        MessageAttachment attachment = attachmentService.getAttachment(attachmentId);
        if(attachment.getThumbnailData() == null)
            return ResponseEntity.notFound().build();

        ByteArrayResource byteArrayResource = new ByteArrayResource(attachment.getThumbnailData());
        Resource resource = (Resource) byteArrayResource;

        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_JPEG)
                .body(resource);
    }
}