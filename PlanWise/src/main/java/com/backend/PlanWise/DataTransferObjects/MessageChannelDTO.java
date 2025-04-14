package com.backend.PlanWise.DataTransferObjects;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MessageChannelDTO {
    private Long channelId;
    private String channelName;
    private String channelType;
    private Long projectId;
    private Long teamId;
    private LocalDateTime createdAt;
    private Integer unreadCount;
    private String lastMessageContent;
    private String lastMessageSender;
}