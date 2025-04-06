package com.backend.PlanWise.DataTransferObjects;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

public class ListEntryDTO
{
    private Long entryId;
    private String entryName;
    private Boolean isChecked;
    private FileDTO file;
    private LocalDate dueDate;
    private Integer warningThreshold;
    private LocalDateTime createdAt;
    private Set<UserDTO> assignedUsers = new HashSet<>();
    private Set<TeamDTO> assignedTeams = new HashSet<>();

    public Long getEntryId()
    {
        return entryId;
    }

    public void setEntryId(Long entryId)
    {
        this.entryId = entryId;
    }

    public String getEntryName()
    {
        return entryName;
    }

    public void setEntryName(String entryName)
    {
        this.entryName = entryName;
    }

    public Boolean getIsChecked()
    {
        return isChecked;
    }

    public void setIsChecked(Boolean checked)
    {
        isChecked = checked;
    }

    public FileDTO getFile()
    {
        return file;
    }

    public void setFile(FileDTO file)
    {
        this.file = file;
    }

    public LocalDate getDueDate()
    {
        return dueDate;
    }

    public void setDueDate(LocalDate dueDate)
    {
        this.dueDate = dueDate;
    }

    public Integer getWarningThreshold()
    {
        return warningThreshold;
    }

    public void setWarningThreshold(Integer warningThreshold)
    {
        this.warningThreshold = warningThreshold;
    }

    public Set<UserDTO> getAssignedUsers()
    {
        return assignedUsers;
    }

    public void setAssignedUsers(Set<UserDTO> assignedUsers)
    {
        this.assignedUsers = assignedUsers;
    }

    public Set<TeamDTO> getAssignedTeams()
    {
        return assignedTeams;
    }

    public void setAssignedTeams(Set<TeamDTO> assignedTeams)
    {
        this.assignedTeams = assignedTeams;
    }

    public LocalDateTime getCreatedAt()
    {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt)
    {
        this.createdAt = createdAt;
    }
}