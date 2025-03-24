package com.backend.PlanWise.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "Projects")
public class Project {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ProjectID")
    private Long projectId;

    @Column(name = "ProjectName", nullable = false)
    private String project_name;

    @Column
    private String Description;

    @ManyToOne
    @JoinColumn(name = "OwnerID")
    private User owner;

    @Column
    private LocalDateTime CreatedAt;

    @Column
    private LocalDateTime UpdatedAt;

    @ManyToMany
    @JoinTable(
            name = "ProjectMembers",
            joinColumns = @JoinColumn(name = "projectId"),
            inverseJoinColumns = @JoinColumn(name = "userId")
    )
    private Set<User> members = new HashSet<>();

    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL)
    private Set<Team> teams = new HashSet<>();

    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL)
    private Set<Category> categories = new HashSet<>();

    public Long getProjectId()
    {
        return projectId;
    }

    public void setProjectId(Long projectId)
    {
        this.projectId = projectId;
    }

    public String getProjectName()
    {
        return project_name;
    }

    public void setProjectName(String projectName)
    {
        this.project_name = projectName;
    }

    public String getDescription()
    {
        return Description;
    }

    public void setDescription(String description)
    {
        this.Description = description;
    }

    public User getOwner()
    {
        return owner;
    }

    public void setOwner(User owner)
    {
        this.owner = owner;
    }

    public LocalDateTime getCreatedAt()
    {
        return CreatedAt;
    }

    public void setCreatedAt(LocalDateTime createdAt)
    {
        this.CreatedAt = createdAt;
    }

    public LocalDateTime getUpdatedAt()
    {
        return UpdatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt)
    {
        this.UpdatedAt = updatedAt;
    }

    public Set<User> getMembers()
    {
        return members;
    }

    public void setMembers(Set<User> members)
    {
        this.members = members;
    }

    public Set<Team> getTeams()
    {
        return teams;
    }

    public void setTeams(Set<Team> teams)
    {
        this.teams = teams;
    }

    public Set<Category> getCategories()
    {
        return categories;
    }

    public void setCategories(Set<Category> categories)
    {
        this.categories = categories;
    }
}