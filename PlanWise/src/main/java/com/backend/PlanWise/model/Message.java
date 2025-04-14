package com.backend.PlanWise.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "messages")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Message
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

    public String getContent()
    {
        return content;
    }

    public void setContent(String content)
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

    public User getSender()
    {
        return sender;
    }

    public void setSender(User sender)
    {
        this.sender = sender;
    }

    public MessageChannel getChannel()
    {
        return channel;
    }

    public void setChannel(MessageChannel channel)
    {
        this.channel = channel;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "project_id", nullable = false)
    private Integer projectId;
    
    @Column(name = "sender_id", nullable = false, length = 100)
    private String senderId;  // Changed from Long to String
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;
    
    @Column(nullable = false)
    private LocalDateTime timestamp;
    
    @Column(name = "channel_id", nullable = false)
    private Long channelId;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "sender_id", referencedColumnName = "user_id", insertable = false, updatable = false)
    private User sender;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "channel_id", referencedColumnName = "channel_id", insertable = false, updatable = false)
    private MessageChannel channel;
}