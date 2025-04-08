package com.backend.PlanWise.Controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.backend.PlanWise.DataTransferObjects.RecentActivityDTO;
import com.backend.PlanWise.servicer.RecentActivityService;

@RestController
@RequestMapping("/api/projects/{projectId}/activities")
public class RecentActivityController {
    @Autowired
    private RecentActivityService recentActivityService;

    @GetMapping
    public ResponseEntity<List<RecentActivityDTO>> getRecentActivities(
            @PathVariable Long projectId,
            @RequestParam(required = false) String entityType) {
        
        List<RecentActivityDTO> activities;
        if (entityType != null) {
            activities = recentActivityService.getRecentActivitiesByEntityType(projectId, entityType);
        } else {
            activities = recentActivityService.getRecentActivities(projectId);
        }
        
        return ResponseEntity.ok(activities);
    }

    @PatchMapping("/{activityId}/seen")
    public ResponseEntity<Void> markActivityAsSeen(
            @PathVariable Long projectId,
            @PathVariable Long activityId)
    {
        recentActivityService.markActivityAsSeen(projectId, activityId);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/mark-all-seen")
    public ResponseEntity<Void> markAllActivitiesAsSeen(
            @PathVariable Long projectId)
    {
        recentActivityService.markAllActivitiesAsSeen(projectId);
        return ResponseEntity.ok().build();
    }
}