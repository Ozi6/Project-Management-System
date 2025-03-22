package com.backend.PlanWise.dto;

public class ProjectDTO {
    private Integer id;
    private String name;
    private String owner;
    private Integer progress;
    private String status;
    private boolean isOwner;
    
    public ProjectDTO() {}
    
    public ProjectDTO(Integer id, String name, String owner, Integer progress, String status, boolean isOwner) {
        this.id = id;
        this.name = name;
        this.owner = owner;
        this.progress = progress;
        this.status = status;
        this.isOwner = isOwner;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getOwner() {
        return owner;
    }

    public void setOwner(String owner) {
        this.owner = owner;
    }

    public Integer getProgress() {
        return progress;
    }

    public void setProgress(Integer progress) {
        this.progress = progress;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public boolean isOwner() {
        return isOwner;
    }

    public void setOwner(boolean owner) {
        isOwner = owner;
    }
}