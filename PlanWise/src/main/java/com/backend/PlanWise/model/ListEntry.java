package com.backend.PlanWise.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "ListEntries")
public class ListEntry
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long entryId;

    @ManyToOne
    @JoinColumn(name = "taskListId", nullable = false)
    private TaskList taskList;

    @Column(nullable = false)
    private String entryName;

    @Column
    private Boolean isChecked = false;

    @ManyToOne
    @JoinColumn(name = "fileId")
    private File file;

    @Column
    private LocalDateTime dueDate;

    @Column
    private Integer warningThreshold;

    @Column
    private LocalDateTime createdAt;

    @Column
    private LocalDateTime updatedAt;

    @ManyToMany
    @JoinTable(
            name = "EntryUserAssignments",
            joinColumns = @JoinColumn(name = "entryId"),
            inverseJoinColumns = @JoinColumn(name = "userId")
    )
    private Set<User> assignedUsers = new HashSet<>();

    @ManyToMany
    @JoinTable(
            name = "EntryTeamAssignments",
            joinColumns = @JoinColumn(name = "entryId"),
            inverseJoinColumns = @JoinColumn(name = "teamId")
    )
    private Set<Team> assignedTeams = new HashSet<>();

    public Long getEntryId()
    {
        return entryId;
    }

    public void setEntryId(Long entryId)
    {
        this.entryId = entryId;
    }

    public TaskList getTaskList()
    {
        return taskList;
    }

    public void setTaskList(TaskList taskList)
    {
        this.taskList = taskList;
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

    public File getFile()
    {
        return file;
    }

    public void setFile(File file)
    {
        this.file = file;
    }

    public LocalDateTime getDueDate()
    {
        return dueDate;
    }

    public void setDueDate(LocalDateTime dueDate)
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

    public LocalDateTime getCreatedAt()
    {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt)
    {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt()
    {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt)
    {
        this.updatedAt = updatedAt;
    }

    public Set<User> getAssignedUsers()
    {
        return assignedUsers;
    }

    public void setAssignedUsers(Set<User> assignedUsers)
    {
        this.assignedUsers = assignedUsers;
    }

    public Set<Team> getAssignedTeams()
    {
        return assignedTeams;
    }

    public void setAssignedTeams(Set<Team> assignedTeams)
    {
        this.assignedTeams = assignedTeams;
    }
}