package com.backend.PlanWise.DataTransferObjects;

import java.util.HashSet;
import java.util.Set;

public class TaskListDTO
{
    public Long getTaskListId()
    {
        return taskListId;
    }

    public void setTaskListId(Long taskListId)
    {
        this.taskListId = taskListId;
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

    public Set<ListEntryDTO> getEntries()
    {
        return entries;
    }

    public void setEntries(Set<ListEntryDTO> entries)
    {
        this.entries = entries;
    }

    private Long taskListId;
    private String taskListName;
    private String color;
    private Set<ListEntryDTO> entries = new HashSet<>();
}