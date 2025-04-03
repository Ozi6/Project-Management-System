package com.planwise.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "project_members")
public class ProjectMember {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "project_id")
    private Project project;

    private String userId;
    private String role;
    private boolean canEdit;
    private boolean canDelete;
    private boolean canInvite;
    private boolean canManageSettings;
} 