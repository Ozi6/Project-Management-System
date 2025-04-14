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
    private String senderId;  // Changed from Long to String
    private String senderName;
    private String senderAvatar;
    private String content;
    private LocalDateTime timestamp;
}