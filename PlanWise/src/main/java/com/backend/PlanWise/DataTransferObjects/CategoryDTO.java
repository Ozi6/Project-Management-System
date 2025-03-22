package com.backend.PlanWise.DataTransferObjects;

import java.util.HashSet;
import java.util.Set;

public class CategoryDTO
{
    private Long categoryId;
    private String categoryName;
    private String color;
    private Set<TaskListDTO> taskLists = new HashSet<>();

    public Set<TaskListDTO> getTaskLists()
    {
        return taskLists;
    }

    public void setTaskLists(Set<TaskListDTO> taskLists)
    {
        this.taskLists = taskLists;
    }

    public String getColor()
    {
        return color;
    }

    public void setColor(String color)
    {
        this.color = color;
    }

    public String getCategoryName()
    {
        return categoryName;
    }

    public void setCategoryName(String categoryName)
    {
        this.categoryName = categoryName;
    }

    public Long getCategoryId()
    {
        return categoryId;
    }

    public void setCategoryId(Long categoryId)
    {
        this.categoryId = categoryId;
    }
}