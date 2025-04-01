package com.backend.PlanWise.Controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.backend.PlanWise.DataTransferObjects.RecentActivityDTO;
import com.backend.PlanWise.servicer.RecentActivityService;

@RestController
@RequestMapping("/api/activities")
public class RecentActivityController {

    @Autowired
    private RecentActivityService recentActivityService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<RecentActivityDTO>> getUserRecentActivities(@PathVariable String userId) {
        List<RecentActivityDTO> activities = recentActivityService.getUserRecentActivities(userId);
        return ResponseEntity.ok(activities);
    }

    @PostMapping
    public ResponseEntity<RecentActivityDTO> createActivity(
            @RequestParam String userId,
            @RequestParam String action,
            @RequestParam String entityType,
            @RequestParam Long entityId) {
        RecentActivityDTO activity = recentActivityService.createActivity(userId, action, entityType, entityId);
        return ResponseEntity.ok(activity);
    }

    @GetMapping("/user/{userId}/recent-activities")
    public ResponseEntity<List<RecentActivityDTO>> getRecentActivities(@PathVariable String userId) {
        List<RecentActivityDTO> activities = recentActivityService.getUserRecentActivities(userId);
        return ResponseEntity.ok(activities);
    }
}