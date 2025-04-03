package com.backend.PlanWise.model;

import jakarta.persistence.*;

import java.time.Instant;

@Entity
@Table(name = "invitations")
public class Invitation
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "invitation_id")
    private Integer invitationId;

    @Column(name = "email", nullable = false)
    private String email;

    @Column(name = "project_id", nullable = false)
    private Long projectId;

    @Column(name = "invited_at")
    private Instant invitedAt;

    public Instant getExpiresAt()
    {
        return expiresAt;
    }

    public void setExpiresAt(Instant expiresAt)
    {
        this.expiresAt = expiresAt;
    }

    @Column(name = "expires_at")
    private Instant expiresAt;

    @Column(name = "status")
    private String status;

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

    public Instant getInvitedAt()
    {
        return invitedAt;
    }

    public void setInvitedAt(Instant invitedAt)
    {
        this.invitedAt = invitedAt;
    }

    public String getStatus()
    {
        return status;
    }

    public void setStatus(String status)
    {
        this.status = status;
    }
}