package com.backend.PlanWise.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "ListEntries")
public class ListEntry {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "entry_id")
    private Long entryId;

    @ManyToOne
    @JoinColumn(name = "task_list_id", nullable = false)
    private TaskList taskList;

    @Column(name = "EntryName", nullable = false)
    private String entryName;

    @Column(name = "IsChecked")
    private Boolean isChecked = false;

    @ManyToOne
    @JoinColumn(name = "file_id")
    private File file;

    @Column(name = "DueDate")
    private LocalDate dueDate;

    @Column(name = "WarningThreshold")
    private Integer warningThreshold;

    @Column(name = "CreatedAt")
    @CreationTimestamp
    private LocalDateTime createdAt;

    @Column(name = "UpdatedAt")
    private LocalDateTime updatedAt;

    @ManyToMany
    @JoinTable(
            name = "entry_user_assignments",
            joinColumns = @JoinColumn(name = "entry_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private Set<User> assignedUsers = new HashSet<>();

    @ManyToMany
    @JoinTable(
            name = "EntryTeamAssignments",
            joinColumns = @JoinColumn(name = "entry_id"),
            inverseJoinColumns = @JoinColumn(name = "team_id")
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