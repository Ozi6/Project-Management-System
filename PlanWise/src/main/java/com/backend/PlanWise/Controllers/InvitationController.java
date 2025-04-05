package com.backend.PlanWise.Controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.backend.PlanWise.DataTransferObjects.InvitationRequest;
import com.backend.PlanWise.DataTransferObjects.InvitationResponse;
import com.backend.PlanWise.model.Invitation;
import com.backend.PlanWise.servicer.InvitationService;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/invitations")
public class InvitationController
{

    @Autowired
    private InvitationService invitationService;

    @PostMapping
    public ResponseEntity<InvitationResponse> createEmailInvite(@RequestBody InvitationRequest request)
    {
        Invitation invitation = invitationService.inviteUserByEmail(request);
        return ResponseEntity.ok(mapToResponse(invitation));
    }

    @PostMapping("/general/{projectId}")
    public ResponseEntity<InvitationResponse> createGeneralInvite(@PathVariable Long projectId)
    {
        Invitation invitation = invitationService.createGeneralInvite(projectId);
        return ResponseEntity.ok(mapToResponse(invitation));
    }

    @GetMapping("/{id}")
    public ResponseEntity<InvitationResponse> getInvitation(
            @PathVariable Integer id,
            @RequestParam(required = false) String token)
    {
        if(token != null)
        {
            Invitation invitation = invitationService.getValidInvitation(id, token);
            return ResponseEntity.ok(mapToResponse(invitation));
        }
        else
        {
            Invitation invitation = invitationService.getInvitationById(id);
            return ResponseEntity.ok(mapToResponse(invitation));
        }
    }

    @GetMapping("/internal/{invitationId}")
    public ResponseEntity<InvitationResponse> getInvitationById(@PathVariable int invitationId) {
        Invitation invitation = invitationService.getInvitationById(invitationId);
        return ResponseEntity.ok(mapToResponse(invitation));
    }

    @PostMapping("/{invitationId}/respond")
    public ResponseEntity<Void> respondToInvitation(
            @PathVariable int invitationId,
            @RequestBody Map<String, Object> request)
    {
        boolean accept = (Boolean) request.get("accept");
        String token = (String) request.get("token");
        String email = (String) request.get("email");
        if(accept)
        {
            if(email == null || email.isEmpty())
                throw new IllegalArgumentException("Email is required to accept invitation");

            if(token != null)
                invitationService.getValidInvitation(invitationId, token);

            invitationService.acceptInvitation(invitationId, email);
        }
        else
            invitationService.declineInvitation(invitationId);

        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<InvitationResponse>> getPendingInvitationsForUser(@PathVariable String userId)
    {
        List<Invitation> invitations = invitationService.getPendingInvitationsForUser(userId);
        List<InvitationResponse> responses = invitations.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
        return new ResponseEntity<>(responses, HttpStatus.OK);
    }

    private InvitationResponse mapToResponse(Invitation invitation)
    {
        InvitationResponse response = new InvitationResponse();
        response.setInvitationId(invitation.getInvitationId());
        response.setExpiresAt(invitation.getExpiresAt());
        response.setEmail(invitation.getEmail());
        response.setProjectId(invitation.getProjectId());
        response.setStatus(invitation.getStatus());
        response.setInvitedAt(invitation.getInvitedAt());
        return response;
    }
}