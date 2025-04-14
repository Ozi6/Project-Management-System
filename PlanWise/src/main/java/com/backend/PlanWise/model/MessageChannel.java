package com.backend.PlanWise.model;

import java.time.LocalDateTime;
import java.util.Set;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "message_channels")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MessageChannel
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "channel_id")
    private Long channelId;
    
    @Column(name = "channel_name", nullable = false)
    private String channelName;
    
    @Column(name = "channel_type", nullable = false)
    private String channelType;
    
    @Column(name = "project_id", nullable = false)
    private Long projectId;
    
    @Column(name = "team_id")
    private Long teamId;

    public Set<Message> getMessages()
    {
        return messages;
    }

    public void setMessages(Set<Message> messages)
    {
        this.messages = messages;
    }

    public Project getProject()
    {
        return project;
    }

    public void setProject(Project project)
    {
        this.project = project;
    }

    public LocalDateTime getCreatedAt()
    {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt)
    {
        this.createdAt = createdAt;
    }

    public Long getTeamId()
    {
        return teamId;
    }

    public void setTeamId(Long teamId)
    {
        this.teamId = teamId;
    }

    public Long getProjectId()
    {
        return projectId;
    }

    public void setProjectId(Long projectId)
    {
        this.projectId = projectId;
    }

    public String getChannelType()
    {
        return channelType;
    }

    public void setChannelType(String channelType)
    {
        this.channelType = channelType;
    }

    public String getChannelName()
    {
        return channelName;
    }

    public void setChannelName(String channelName)
    {
        this.channelName = channelName;
    }

    public Long getChannelId()
    {
        return channelId;
    }

    public void setChannelId(Long channelId)
    {
        this.channelId = channelId;
    }

    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", referencedColumnName = "project_id", insertable = false, updatable = false)
    private Project project;
    
    @OneToMany(mappedBy = "channel")
    private Set<Message> messages;
}