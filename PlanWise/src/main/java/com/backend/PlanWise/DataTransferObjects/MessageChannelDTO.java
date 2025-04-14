package com.backend.PlanWise.DataTransferObjects;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MessageChannelDTO
{
    public Long getChannelId()
    {
        return channelId;
    }

    public void setChannelId(Long channelId)
    {
        this.channelId = channelId;
    }

    public String getChannelName()
    {
        return channelName;
    }

    public void setChannelName(String channelName)
    {
        this.channelName = channelName;
    }

    public String getChannelType()
    {
        return channelType;
    }

    public void setChannelType(String channelType)
    {
        this.channelType = channelType;
    }

    public Long getProjectId()
    {
        return projectId;
    }

    public void setProjectId(Long projectId)
    {
        this.projectId = projectId;
    }

    public Long getTeamId()
    {
        return teamId;
    }

    public void setTeamId(Long teamId)
    {
        this.teamId = teamId;
    }

    public LocalDateTime getCreatedAt()
    {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt)
    {
        this.createdAt = createdAt;
    }

    public Integer getUnreadCount()
    {
        return unreadCount;
    }

    public void setUnreadCount(Integer unreadCount)
    {
        this.unreadCount = unreadCount;
    }

    public String getLastMessageContent()
    {
        return lastMessageContent;
    }

    public void setLastMessageContent(String lastMessageContent)
    {
        this.lastMessageContent = lastMessageContent;
    }

    public String getLastMessageSender()
    {
        return lastMessageSender;
    }

    public void setLastMessageSender(String lastMessageSender)
    {
        this.lastMessageSender = lastMessageSender;
    }

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