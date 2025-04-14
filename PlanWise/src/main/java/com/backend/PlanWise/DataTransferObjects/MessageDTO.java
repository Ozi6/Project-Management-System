package com.backend.PlanWise.DataTransferObjects;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MessageDTO {
    private Long id;
    private Integer projectId;
    private String senderId;
    private String content;
    private LocalDateTime timestamp;
    private Long channelId;
    
    // Additional fields for UI display
    private String senderName;
    private String senderAvatar;
}