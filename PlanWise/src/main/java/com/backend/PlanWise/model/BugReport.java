package com.backend.PlanWise.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "bug_reports")
public class BugReport {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "bug_id")
    private Long bugId;
    
    @Column(name = "incident_id", nullable = false, unique = true)
    private String incidentId;
    
    @Column(name = "issue_title", nullable = false)
    private String issueTitle;
    
    @Column(name = "description", columnDefinition = "TEXT", nullable = false)
    private String description;
    
    @Column(name = "category", nullable = false)
    private String category;
    
    @Column(name = "priority", nullable = false)
    private String priority;
    
    @Column(name = "status", nullable = false)
    private String status;
    
    @ManyToOne
    @JoinColumn(name = "reported_by", nullable = false)
    private User reportedBy;
    
    @Column(name = "reported_at", nullable = false)
    private LocalDateTime reportedAt;
    
    @OneToMany(mappedBy = "bugReport", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<BugComment> comments = new HashSet<>();
    
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
    
    public String getCategory() {
        return category;
    }
    
    public void setCategory(String category) {
        this.category = category;
    }
    
    public String getPriority() {
        return priority;
    }
    
    public void setPriority(String priority) {
        this.priority = priority;
    }
    
    public String getStatus() {
        return status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }
    
    public User getReportedBy() {
        return reportedBy;
    }
    
    public void setReportedBy(User reportedBy) {
        this.reportedBy = reportedBy;
    }
    
    public LocalDateTime getReportedAt() {
        return reportedAt;
    }
    
    public void setReportedAt(LocalDateTime reportedAt) {
        this.reportedAt = reportedAt;
    }
    
    public Set<BugComment> getComments() {
        return comments;
    }
    
    public void setComments(Set<BugComment> comments) {
        this.comments = comments;
    }
}