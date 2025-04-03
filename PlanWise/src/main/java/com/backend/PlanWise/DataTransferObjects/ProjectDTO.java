package com.backend.PlanWise.DataTransferObjects;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

public class ProjectDTO {
    private Long projectId; 
    private String projectName; // 
    private String description;
    private String ownerId;
    private LocalDate createdAt;
    private LocalDate lastUpdated;
    private LocalDate dueDate;
    private boolean isPublic;
    private boolean isArchived;
    private String backgroundImageUrl;
    private String inviteToken;

    private boolean isOwner;
    private Set<ProjectMemberDTO> members = new HashSet<>();
    private Set<CategoryDTO> categories = new HashSet<>();
    private Set<TeamDTO> teams = new HashSet<>(); 

    public ProjectDTO() {
        this.members = new HashSet<>();
        this.categories = new HashSet<>();
    }

    public ProjectDTO(Long id, String name, String description, String ownerId) {
        this();
        this.projectId = id;
        this.projectName = name;
        this.description = description;
        this.ownerId = ownerId;
    }

    public Long getProjectId() {
        return projectId;
    }
    public String getInviteToken() {
        return inviteToken;
    }
    public boolean isOwner() {
        return isOwner;
    }
    public void setIsOwner(boolean owner) {
        isOwner = owner;
    }

    public void setInviteToken(String inviteToken) {
        this.inviteToken = inviteToken;
    }
    public void setProjectId(Long id) {
        this.projectId = id;
    }

    public String getProjectName() {
        return projectName;
    }

    public void setProjectName(String name) {
        this.projectName = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getOwnerId() {
        return ownerId;
    }

    private UserDTO owner; // Add this field to store the owner object

    public UserDTO getOwner() {
        return owner;
    }

    public void setOwner(UserDTO owner) {
        this.owner = new UserDTO();
        this.owner.setUserId(owner.getUserId());
        this.owner.setUsername(owner.getUsername());
        this.owner.setEmail(owner.getEmail());
    }

    public LocalDate getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDate createdAt) {
        this.createdAt = createdAt;
    }
    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }

    public LocalDate getDueDate(){
        return dueDate;
    }
    

    public LocalDate getLastUpdated() {
        return lastUpdated;
    }

    public void setLastUpdated(LocalDate lastUpdated) {
        this.lastUpdated = lastUpdated;
    }

    public boolean isPublic() {
        return isPublic;
    }

    public void setPublic(boolean isPublic) {
        this.isPublic = isPublic;
    }

    public boolean isArchived() {
        return isArchived;
    }

    public void setArchived(boolean isArchived) {
        this.isArchived = isArchived;
    }

    public String getBackgroundImageUrl() {
        return backgroundImageUrl;
    }

    public void setBackgroundImageUrl(String backgroundImageUrl) {
        this.backgroundImageUrl = backgroundImageUrl;
    }

    public Set<ProjectMemberDTO> getMembers() {
        return members;
    }

    public void setMembers(Set<ProjectMemberDTO> members) {
        this.members = members;
    }

    public Set<CategoryDTO> getCategories() {
        return categories;
    }

    public void setCategories(Set<CategoryDTO> categories) {
        this.categories = categories;
    }

    public Set<TeamDTO> getTeams() {
        return teams;
    }

    public void setTeams(Set<TeamDTO> teams) {
        this.teams = teams;
    }
}