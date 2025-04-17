package com.backend.PlanWise.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.*;
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

    public LocalDateTime getEditedAt()
    {
        return editedAt;
    }

    public void setEditedAt(LocalDateTime editedAt)
    {
        this.editedAt = editedAt;
        this.isEdited = true;
    }

    public boolean isEdited()
    {
        return isEdited;
    }

    public void setEdited(boolean edited)
    {
        isEdited = edited;
    }

    @Column(name = "edited_at")
    private LocalDateTime editedAt;

    @Column(name = "is_edited", nullable = false)
    private boolean isEdited = false;

    @OneToMany(mappedBy = "message", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<MessageAttachment> attachments = new ArrayList<>();

    public List<MessageAttachment> getAttachments()
    {
        return attachments;
    }

    public void setAttachments(List<MessageAttachment> attachments)
    {
        this.attachments = attachments;
    }

    public void addAttachment(MessageAttachment attachment)
    {
        attachments.add(attachment);
        attachment.setMessage(this);
    }

    public void removeAttachment(MessageAttachment attachment)
    {
        attachments.remove(attachment);
        attachment.setMessage(null);
    }

    public Poll getPoll()
    {
        return poll;
    }

    public void setPoll(Poll poll)
    {
        this.poll = poll;
    }

    @OneToOne(mappedBy = "message", cascade = CascadeType.ALL)
    private Poll poll;
}