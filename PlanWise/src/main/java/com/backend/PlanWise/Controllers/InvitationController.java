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
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/invitations")
public class InvitationController
{

    @Autowired
    private InvitationService invitationService;

    @PostMapping
    public ResponseEntity<InvitationResponse> inviteUser(@RequestBody InvitationRequest request)
    {
        Invitation invitation = invitationService.inviteUserByEmail(request);
        return new ResponseEntity<>(mapToResponse(invitation), HttpStatus.CREATED);
    }

    @PutMapping("/{invitationId}/accept")
    public ResponseEntity<Void> acceptInvitation(@PathVariable int invitationId)
    {
        invitationService.acceptInvitation(invitationId);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PutMapping("/{invitationId}/decline")
    public ResponseEntity<Void> declineInvitation(@PathVariable int invitationId)
    {
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
        response.setEmail(invitation.getEmail());
        response.setProjectId(invitation.getProjectId());
        response.setStatus(invitation.getStatus());
        response.setInvitedAt(invitation.getInvitedAt());
        return response;
    }
}