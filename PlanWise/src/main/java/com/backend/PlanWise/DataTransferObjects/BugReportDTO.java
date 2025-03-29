package com.backend.PlanWise.DataTransferObjects;

import java.time.LocalDateTime;
import java.util.List;

public class BugReportDTO {
    private Long bugId;
    private String incidentId;
    private String issueTitle;
    private String description;
    private UserDTO reportedBy;
    private String status;
    private String priority;
    private String category;
    private LocalDateTime reportedAt;
    private List<BugCommentDTO> comments;
    private int commentCount;
    
    // Getters and setters
    public Long getBugId() {
        return bugId;
    }
    
    public void setBugId(Long bugId) {
        this.bugId = bugId;
    }
    
    public String getIncidentId() {
        return incidentId;
    }
    
    public void setIncidentId(String incidentId) {
        this.incidentId = incidentId;
    }
    
    public String getIssueTitle() {
        return issueTitle;
    }
    
    public void setIssueTitle(String issueTitle) {
        this.issueTitle = issueTitle;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public UserDTO getReportedBy() {
        return reportedBy;
    }
    
    public void setReportedBy(UserDTO reportedBy) {
        this.reportedBy = reportedBy;
    }
    
    public String getStatus() {
        return status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }
    
    public String getPriority() {
        return priority;
    }
    
    public void setPriority(String priority) {
        this.priority = priority;
    }
    
    public String getCategory() {
        return category;
    }
    
    public void setCategory(String category) {
        this.category = category;
    }
    
    public LocalDateTime getReportedAt() {
        return reportedAt;
    }
    
    public void setReportedAt(LocalDateTime reportedAt) {
        this.reportedAt = reportedAt;
    }
    
    public List<BugCommentDTO> getComments() {
        return comments;
    }
    
    public void setComments(List<BugCommentDTO> comments) {
        this.comments = comments;
    }
    
    public int getCommentCount() {
        return commentCount;
    }
    
    public void setCommentCount(int commentCount) {
        this.commentCount = commentCount;
    }
}