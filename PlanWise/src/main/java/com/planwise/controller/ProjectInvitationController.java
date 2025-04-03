package com.planwise.controller;

import com.planwise.dto.ProjectInvitationDTO;
import com.planwise.service.ProjectInvitationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/projects/{projectId}/invite")
public class ProjectInvitationController {
    private final ProjectInvitationService invitationService;

    public ProjectInvitationController(ProjectInvitationService invitationService) {
        this.invitationService = invitationService;
    }

    @PostMapping
    public ResponseEntity<ProjectInvitationDTO> createInvitation(
            @PathVariable Long projectId,
            @RequestBody ProjectInvitationDTO request) {
        ProjectInvitationDTO invitation = invitationService.createInvitation(projectId, request.getEmail());
        return ResponseEntity.ok(invitation);
    }

    @GetMapping("/link")
    public ResponseEntity<ProjectInvitationDTO> generateInvitationLink(
            @PathVariable Long projectId) {
        ProjectInvitationDTO invitation = invitationService.generateInvitationLink(projectId);
        return ResponseEntity.ok(invitation);
    }

    @GetMapping("/accept")
    public ResponseEntity<String> acceptInvitation(
            @RequestParam String token,
            @RequestParam String userId) {
        try {
            invitationService.acceptInvitation(token, userId);
            return ResponseEntity.ok("Invitation accepted successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}