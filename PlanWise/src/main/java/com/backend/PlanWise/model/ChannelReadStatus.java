package com.backend.PlanWise.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
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
@Table(name = "channel_read_status")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChannelReadStatus
{
    public Long getId()
    {
        return id;
    }

    public void setId(Long id)
    {
        this.id = id;
    }

    public Long getChannelId()
    {
        return channelId;
    }

    public void setChannelId(Long channelId)
    {
        this.channelId = channelId;
    }

    public String getUserId()
    {
        return userId;
    }

    public void setUserId(String userId)
    {
        this.userId = userId;
    }

    public LocalDateTime getLastReadTimestamp()
    {
        return lastReadTimestamp;
    }

    public void setLastReadTimestamp(LocalDateTime lastReadTimestamp)
    {
        this.lastReadTimestamp = lastReadTimestamp;
    }

    public MessageChannel getChannel()
    {
        return channel;
    }

    public void setChannel(MessageChannel channel)
    {
        this.channel = channel;
    }

    public User getUser()
    {
        return user;
    }

    public void setUser(User user)
    {
        this.user = user;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "channel_id", nullable = false)
    private Long channelId;
    
    @Column(name = "user_id", nullable = false)
    private String userId;
    
    @Column(name = "last_read_timestamp", nullable = false)
    private LocalDateTime lastReadTimestamp;
    
    @ManyToOne
    @JoinColumn(name = "channel_id", referencedColumnName = "channel_id", insertable = false, updatable = false)
    private MessageChannel channel;
    
    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "user_id", insertable = false, updatable = false)
    private User user;
}