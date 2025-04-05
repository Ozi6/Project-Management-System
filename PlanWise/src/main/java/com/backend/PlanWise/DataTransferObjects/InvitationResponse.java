package com.backend.PlanWise.DataTransferObjects;

import java.time.LocalDateTime;

public class InvitationResponse
{
    private Integer invitationId;
    private String email;
    private Long projectId;
    private String status;
    private LocalDateTime invitedAt;

    public LocalDateTime getExpiresAt()
    {
        return expiresAt;
    }

    public void setExpiresAt(LocalDateTime expiresAt)
    {
        this.expiresAt = expiresAt;
    }

    private LocalDateTime expiresAt;

    public Integer getInvitationId()
    {
        return invitationId;
    }

    public void setInvitationId(Integer invitationId)
    {
        this.invitationId = invitationId;
    }

    public String getEmail()
    {
        return email;
    }

    public void setEmail(String email)
    {
        this.email = email;
    }

    public Long getProjectId()
    {
        return projectId;
    }

    public void setProjectId(Long projectId)
    {
        this.projectId = projectId;
    }

    public String getStatus()
    {
        return status;
    }

    public void setStatus(String status)
    {
        this.status = status;
    }

    public LocalDateTime getInvitedAt()
    {
        return invitedAt;
    }

    public void setInvitedAt(LocalDateTime invitedAt)
    {
        this.invitedAt = invitedAt;
    }
}