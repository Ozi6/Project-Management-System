package com.backend.PlanWise.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "TaskLists")
public class TaskList {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "task_list_id")
    private Long taskListId;

    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @Column(name = "task_list_name", nullable = false)
    private String taskListName;

    @Column(name = "color", nullable = false)
    private String color;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "taskList", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<ListEntry> entries = new HashSet<>();

    public Long getTaskListId()
    {
        return taskListId;
    }

    public void setTaskListId(Long taskListId)
    {
        this.taskListId = taskListId;
    }

    public Category getCategory()
    {
        return category;
    }

    public void setCategory(Category category)
    {
        this.category = category;
    }

    public String getTaskListName()
    {
        return taskListName;
    }

    public void setTaskListName(String taskListName)
    {
        this.taskListName = taskListName;
    }

    public String getColor()
    {
        return color;
    }

    public void setColor(String color)
    {
        this.color = color;
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

    public Set<ListEntry> getEntries()
    {
        return entries;
    }

    public void setEntries(Set<ListEntry> entries)
    {
        this.entries = entries;
    }
}