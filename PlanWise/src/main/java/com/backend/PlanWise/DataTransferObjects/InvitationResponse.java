package com.backend.PlanWise.DataTransferObjects;

import java.time.Instant;

public class InvitationResponse
{
    private Integer invitationId;
    private String email;
    private Long projectId;
    private String status;
    private Instant invitedAt;

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

    public Instant getInvitedAt()
    {
        return invitedAt;
    }

    public void setInvitedAt(Instant invitedAt)
    {
        this.invitedAt = invitedAt;
    }
}