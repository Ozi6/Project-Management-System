package com.backend.PlanWise.servicer;

import com.backend.PlanWise.DataPool.BugCommentDataPool;
import com.backend.PlanWise.DataPool.BugReportDataPool;
import com.backend.PlanWise.DataPool.UserDataPool;
import com.backend.PlanWise.DataTransferObjects.BugCommentDTO;
import com.backend.PlanWise.DataTransferObjects.BugReportDTO;
import com.backend.PlanWise.DataTransferObjects.UserDTO;
import com.backend.PlanWise.model.BugComment;
import com.backend.PlanWise.model.BugReport;
import com.backend.PlanWise.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class BugReportService {

    @Autowired
    private BugReportDataPool bugReportDataPool;
    
    @Autowired
    private BugCommentDataPool bugCommentDataPool;
    
    @Autowired
    private UserDataPool userDataPool;

    public List<BugReportDTO> getAllBugReports() {
        return bugReportDataPool.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<BugReportDTO> getBugReportsByUserId(String userId) {
        return bugReportDataPool.findByReportedByUserId(userId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public BugReportDTO getBugReportById(Long id) {
        return bugReportDataPool.findById(id)
                .map(this::convertToDTO)
                .orElse(null);
    }
    
    @Transactional
    public BugReportDTO createBugReport(BugReportDTO bugReportDTO, String userId) {
        User user = userDataPool.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));
        
        BugReport bugReport = new BugReport();
        
        // Generate a unique incident ID if not provided
        if (bugReportDTO.getIncidentId() == null || bugReportDTO.getIncidentId().isEmpty()) {
            bugReport.setIncidentId("INC-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        } else {
            bugReport.setIncidentId(bugReportDTO.getIncidentId());
        }
        
        bugReport.setIssueTitle(bugReportDTO.getIssueTitle());
        bugReport.setDescription(bugReportDTO.getDescription());
        bugReport.setCategory(bugReportDTO.getCategory());
        bugReport.setPriority(bugReportDTO.getPriority());
        bugReport.setStatus("Open"); // Default status
        bugReport.setReportedBy(user);
        bugReport.setReportedAt(LocalDateTime.now());
        
        BugReport savedReport = bugReportDataPool.save(bugReport);
        return convertToDTO(savedReport);
    }
    
    @Transactional
    public BugCommentDTO addComment(Long bugId, BugCommentDTO commentDTO, String userId) {
        BugReport bugReport = bugReportDataPool.findById(bugId)
                .orElseThrow(() -> new RuntimeException("Bug report not found with ID: " + bugId));
        
        User user = userDataPool.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));
        
        BugComment comment = new BugComment();
        comment.setComment(commentDTO.getComment());
        comment.setUser(user);
        comment.setBugReport(bugReport);
        comment.setCommentedAt(LocalDateTime.now());
        
        BugComment savedComment = bugCommentDataPool.save(comment);
        
        return convertCommentToDTO(savedComment);
    }
    
    @Transactional
    public BugReportDTO updateBugReportStatus(Long id, String status) {
        BugReport bugReport = bugReportDataPool.findById(id)
                .orElseThrow(() -> new RuntimeException("Bug report not found with ID: " + id));
        
        bugReport.setStatus(status);
        
        BugReport updatedReport = bugReportDataPool.save(bugReport);
        return convertToDTO(updatedReport);
    }
    
    private BugReportDTO convertToDTO(BugReport bugReport) {
        BugReportDTO dto = new BugReportDTO();
        dto.setBugId(bugReport.getBugId());
        dto.setIncidentId(bugReport.getIncidentId());
        dto.setIssueTitle(bugReport.getIssueTitle());
        dto.setDescription(bugReport.getDescription());
        dto.setCategory(bugReport.getCategory());
        dto.setPriority(bugReport.getPriority());
        dto.setStatus(bugReport.getStatus());
        dto.setReportedAt(bugReport.getReportedAt());
        
        if (bugReport.getReportedBy() != null) {
            UserDTO reporterDTO = new UserDTO();
            reporterDTO.setUserId(bugReport.getReportedBy().getUserId());
            reporterDTO.setUsername(bugReport.getReportedBy().getUsername());
            reporterDTO.setEmail(bugReport.getReportedBy().getEmail());
            dto.setReportedBy(reporterDTO);
        }
        
        // Get comments and convert them to DTOs
        List<BugCommentDTO> commentDTOs = bugCommentDataPool.findByBugReportBugId(bugReport.getBugId())
            .stream()
            .map(this::convertCommentToDTO)
            .collect(Collectors.toList());
        
        dto.setComments(commentDTOs);
        dto.setCommentCount(commentDTOs.size());
        
        return dto;
    }
    
    private BugCommentDTO convertCommentToDTO(BugComment comment) {
        BugCommentDTO dto = new BugCommentDTO();
        dto.setCommentId(comment.getCommentId());
        dto.setBugId(comment.getBugReport().getBugId());
        dto.setComment(comment.getComment());
        dto.setCommentedAt(comment.getCommentedAt());
        
        if (comment.getUser() != null) {
            UserDTO authorDTO = new UserDTO();
            authorDTO.setUserId(comment.getUser().getUserId());
            authorDTO.setUsername(comment.getUser().getUsername());
            authorDTO.setEmail(comment.getUser().getEmail());
            dto.setAuthor(authorDTO);
        }
        
        return dto;
    }
}