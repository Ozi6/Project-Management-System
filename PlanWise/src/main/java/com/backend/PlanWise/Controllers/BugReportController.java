package com.backend.PlanWise.Controllers;

import com.backend.PlanWise.DataTransferObjects.BugCommentDTO;
import com.backend.PlanWise.DataTransferObjects.BugReportDTO;
import com.backend.PlanWise.servicer.BugReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bugreports")
@CrossOrigin(origins = {"http://localhost:5173"}, allowCredentials = "true")
public class BugReportController {

    @Autowired
    private BugReportService bugReportService;

    @GetMapping
    public ResponseEntity<List<BugReportDTO>> getAllBugReports() {
        try {
            return ResponseEntity.ok(bugReportService.getAllBugReports());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<BugReportDTO> getBugReportById(@PathVariable Long id) {
        try {
            BugReportDTO report = bugReportService.getBugReportById(id);
            if (report != null) {
                return ResponseEntity.ok(report);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<BugReportDTO>> getBugReportsByUserId(@PathVariable String userId) {
        try {
            return ResponseEntity.ok(bugReportService.getBugReportsByUserId(userId));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/user/{userId}")
    public ResponseEntity<BugReportDTO> createBugReport(@RequestBody BugReportDTO bugReportDTO, @PathVariable String userId) {
        try {
            BugReportDTO createdReport = bugReportService.createBugReport(bugReportDTO, userId);
            return new ResponseEntity<>(createdReport, HttpStatus.CREATED);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/{bugId}/comments/user/{userId}")
    public ResponseEntity<BugCommentDTO> addComment(@PathVariable Long bugId, @RequestBody BugCommentDTO commentDTO, @PathVariable String userId) {
        try {
            BugCommentDTO addedComment = bugReportService.addComment(bugId, commentDTO, userId);
            return new ResponseEntity<>(addedComment, HttpStatus.CREATED);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<BugReportDTO> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> statusUpdate) {
        try {
            String newStatus = statusUpdate.get("status");
            if (newStatus == null) {
                return ResponseEntity.badRequest().build();
            }
            
            BugReportDTO updatedReport = bugReportService.updateBugReportStatus(id, newStatus);
            return ResponseEntity.ok(updatedReport);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}