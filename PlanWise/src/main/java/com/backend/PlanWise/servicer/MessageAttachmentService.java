package com.backend.PlanWise.servicer;

import com.backend.PlanWise.DataPool.UserDataPool;
import com.backend.PlanWise.model.FileType;
import com.backend.PlanWise.model.Message;
import com.backend.PlanWise.model.MessageAttachment;
import com.backend.PlanWise.repository.MessageAttachmentRepository;
import com.backend.PlanWise.repository.MessageRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.time.LocalDateTime;

@Service
public class MessageAttachmentService
{

    @Autowired
    private MessageAttachmentRepository attachmentRepository;

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private UserDataPool userRepository;

    public Long storeAttachment(MultipartFile file, Long projectId, Long channelId, String userId, Long messageId) throws IOException
    {
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new EntityNotFoundException("Message not found"));

        MessageAttachment attachment = new MessageAttachment();
        attachment.setMessage(message);

        attachment.setFileName(file.getOriginalFilename());
        attachment.setFileSize(file.getSize());
        attachment.setFileType(FileType.fromMimeType(file.getContentType()));
        attachment.setUploadedAt(LocalDateTime.now());
        attachment.setMessage(message);

        attachment.setFileData(file.getBytes());

        if(file.getContentType() != null && file.getContentType().startsWith("image/"))
            attachment.setThumbnailData(generateThumbnail(file.getBytes()));

        MessageAttachment savedAttachment = attachmentRepository.save(attachment);
        return savedAttachment.getId();
    }

    public MessageAttachment getAttachment(Long attachmentId)
    {
        return attachmentRepository.findById(attachmentId)
                .orElseThrow(() -> new EntityNotFoundException("Attachment not found with id: " + attachmentId));
    }

    private byte[] generateThumbnail(byte[] imageData) throws IOException
    {
        try(InputStream is = new ByteArrayInputStream(imageData)){
            BufferedImage originalImage = ImageIO.read(is);
            if (originalImage == null) return null;

            int thumbnailWidth = 150;
            int thumbnailHeight = (int) (originalImage.getHeight() *
                    ((double) thumbnailWidth / originalImage.getWidth()));

            BufferedImage thumbnail = new BufferedImage(thumbnailWidth, thumbnailHeight,
                    BufferedImage.TYPE_INT_RGB);
            Graphics2D g2d = thumbnail.createGraphics();
            g2d.drawImage(originalImage.getScaledInstance(thumbnailWidth, thumbnailHeight,
                    Image.SCALE_SMOOTH), 0, 0, null);
            g2d.dispose();

            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            ImageIO.write(thumbnail, "jpg", baos);
            return baos.toByteArray();
        }
    }
}