package com.backend.PlanWise.DataTransferObjects;

import java.time.LocalDateTime;

public class BugCommentDTO {
    private Long commentId;
    private Long bugId;
    private String comment;
    private UserDTO author;
    private LocalDateTime commentedAt;
    
    // Getters and setters
    public Long getCommentId() {
        return commentId;
    }
    
    public void setCommentId(Long commentId) {
        this.commentId = commentId;
    }
    
    public Long getBugId() {
        return bugId;
    }
    
    public void setBugId(Long bugId) {
        this.bugId = bugId;
    }
    
    public String getComment() {
        return comment;
    }
    
    public void setComment(String comment) {
        this.comment = comment;
    }
    
    public UserDTO getAuthor() {
        return author;
    }
    
    public void setAuthor(UserDTO author) {
        this.author = author;
    }
    
    public LocalDateTime getCommentedAt() {
        return commentedAt;
    }
    
    public void setCommentedAt(LocalDateTime commentedAt) {
        this.commentedAt = commentedAt;
    }
}