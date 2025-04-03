package com.backend.PlanWise.DataTransferObjects;

import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

public class ProjectSettingsDTO {
    @JsonProperty("projectName")
    private String projectName;
    @JsonProperty("description")
    private String projectDescription;
    @JsonIgnore
    private MultipartFile backgroundImage;
    @JsonProperty("isPublic")
    private boolean isPublic;
    @JsonProperty("backgroundImageUrl")
    private String backgroundImageUrl;

    public String getProjectName() {
        return projectName;
    }

    public void setProjectName(String projectName) {
        this.projectName = projectName;
    }

    public String getProjectDescription() {
        return projectDescription;
    }

    public void setProjectDescription(String projectDescription) {
        this.projectDescription = projectDescription;
    }

    public MultipartFile getBackgroundImage() {
        return backgroundImage;
    }

    public void setBackgroundImage(MultipartFile backgroundImage) {
        this.backgroundImage = backgroundImage;
    }

    public boolean isPublic() {
        return isPublic;
    }

    public void setPublic(boolean isPublic) {
        this.isPublic = isPublic;
    }

    public String getBackgroundImageUrl() {
        return backgroundImageUrl;
    }

    public void setBackgroundImageUrl(String backgroundImageUrl) {
        this.backgroundImageUrl = backgroundImageUrl;
    }
}