package com.backend.PlanWise.DataTransferObjects;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

public class ProjectDTO
{
    private Long projectId;
    private String projectName;
    private String description;
    private UserDTO owner;
    private LocalDateTime createdAt;
    private LocalDate dueDate;
    private LocalDateTime lastUpdated;
    private Set<UserDTO> members = new HashSet<>();
    private Set<TeamDTO> teams = new HashSet<>();
    private Set<CategoryDTO> categories = new HashSet<>();
    private boolean isOwner;
    private String backgroundImage;

    public boolean isOwner()
    {
        return isOwner;
    }

    public void setIsOwner(boolean owner)
    {
        isOwner = owner;
    }

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
        return projectName;
    }

    public void setProjectName(String projectName)
    {
        this.projectName = projectName;
    }

    public String getDescription()
    {
        return description;
    }

    public void setDescription(String description)
    {
        this.description = description;
    }

    public UserDTO getOwner()
    {
        return owner;
    }

    public void setOwner(UserDTO owner)
    {
        this.owner = owner;
    }

    public LocalDateTime getCreatedAt()
    {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt)
    {
        this.createdAt = createdAt;
    }

    public Set<UserDTO> getMembers()
    {
        return members;
    }

    public void setMembers(Set<UserDTO> members)
    {
        this.members = members;
    }

    public Set<TeamDTO> getTeams()
    {
        return teams;
    }

    public void setTeams(Set<TeamDTO> teams)
    {
        this.teams = teams;
    }

    public Set<CategoryDTO> getCategories()
    {
        return categories;
    }

    public void setCategories(Set<CategoryDTO> categories)
    {
        this.categories = categories;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }

    public LocalDateTime getLastUpdated()
    {
        return lastUpdated;
    }

    public void setLastUpdated(LocalDateTime lastUpdated)
    {
        this.lastUpdated = lastUpdated;
    }

    public String getBackgroundImage()
    {
        return backgroundImage;
    }

    public void setBackgroundImage(String backgroundImage)
    {
        this.backgroundImage = backgroundImage;
    }
}