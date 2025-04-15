package com.backend.PlanWise.DataTransferObjects;

import java.time.LocalDateTime;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MessageDTO
{
    public Long getId()
    {
        return id;
    }

    public void setId(Long id)
    {
        this.id = id;
    }

    public Integer getProjectId()
    {
        return projectId;
    }

    public void setProjectId(Integer projectId)
    {
        this.projectId = projectId;
    }

    public String getSenderId()
    {
        return senderId;
    }

    public void setSenderId(String senderId)
    {
        this.senderId = senderId;
    }

    public @Size(max = 65535) String getContent()
    {
        return content;
    }

    public void setContent(@Size(max = 65535) String content)
    {
        this.content = content;
    }

    public LocalDateTime getTimestamp()
    {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp)
    {
        this.timestamp = timestamp;
    }

    public Long getChannelId()
    {
        return channelId;
    }

    public void setChannelId(Long channelId)
    {
        this.channelId = channelId;
    }

    public String getSenderName()
    {
        return senderName;
    }

    public void setSenderName(String senderName)
    {
        this.senderName = senderName;
    }

    public String getSenderAvatar()
    {
        return senderAvatar;
    }

    public void setSenderAvatar(String senderAvatar)
    {
        this.senderAvatar = senderAvatar;
    }

    private Long id;
    private Integer projectId;
    private String senderId;

    @Size(max = 65535) // MySQL TEXT type limit
    private String content;

    private LocalDateTime timestamp;
    private Long channelId;

    private String senderName;
    private String senderAvatar;
    private LocalDateTime editedAt;
    private boolean isEdited;

    public LocalDateTime getEditedAt()
    {
        return editedAt;
    }

    public void setEditedAt(LocalDateTime editedAt)
    {
        this.editedAt = editedAt;
    }

    public boolean isEdited()
    {
        return isEdited;
    }

    public void setEdited(boolean edited)
    {
        isEdited = edited;
    }
}