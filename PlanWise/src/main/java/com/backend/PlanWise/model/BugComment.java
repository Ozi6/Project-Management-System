package com.backend.PlanWise.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "bug_comments")
public class BugComment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "comment_id")
    private Long commentId;
    
    @ManyToOne
    @JoinColumn(name = "bug_id", nullable = false)
    private BugReport bugReport;
    
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Column(name = "comment", columnDefinition = "TEXT", nullable = false)
    private String comment;
    
    @Column(name = "commented_at", nullable = false)
    private LocalDateTime commentedAt;
    
    // Getters and setters
    public Long getCommentId() {
        return commentId;
    }
    
    public void setCommentId(Long commentId) {
        this.commentId = commentId;
    }
    
    public BugReport getBugReport() {
        return bugReport;
    }
    
    public void setBugReport(BugReport bugReport) {
        this.bugReport = bugReport;
    }
    
    public User getUser() {
        return user;
    }
    
    public void setUser(User user) {
        this.user = user;
    }
    
    public String getComment() {
        return comment;
    }
    
    public void setComment(String comment) {
        this.comment = comment;
    }
    
    public LocalDateTime getCommentedAt() {
        return commentedAt;
    }
    
    public void setCommentedAt(LocalDateTime commentedAt) {
        this.commentedAt = commentedAt;
    }
}