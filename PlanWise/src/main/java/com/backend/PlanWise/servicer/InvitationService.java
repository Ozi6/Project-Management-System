package com.backend.PlanWise.servicer;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.backend.PlanWise.DataTransferObjects.InvitationRequest;
import com.backend.PlanWise.Exceptions.ResourceNotFoundException;
import com.backend.PlanWise.model.Invitation;
import com.backend.PlanWise.model.Project;
import com.backend.PlanWise.model.User;
import com.backend.PlanWise.DataPool.InvitationDataPool;
import com.backend.PlanWise.DataPool.ProjectDataPool;
import com.backend.PlanWise.DataPool.UserDataPool;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class InvitationService
{

    @Autowired
    private InvitationDataPool invitationRepository;

    @Autowired
    private ProjectDataPool projectRepository;

    @Autowired
    private UserDataPool userRepository;

    @Autowired
    private JavaMailSender emailSender;

    @Transactional
    public Invitation inviteUserByEmail(InvitationRequest request)
    {
        Project project = projectRepository.findById(request.getProjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        Optional<User> existingUser = Optional.ofNullable(userRepository.findByEmail(request.getEmail()));

        Optional<Invitation> existingInvitation = invitationRepository.findByEmailAndProjectId(
                request.getEmail(), project.getProjectId());

        if(existingInvitation.isPresent())
            return existingInvitation.get();

        Invitation invitation = new Invitation();
        invitation.setEmail(request.getEmail());
        invitation.setProjectId(project.getProjectId());
        invitation.setStatus("Pending");

        Instant now = Instant.now();
        invitation.setInvitedAt(now);
        invitation.setExpiresAt(now.plus(12, ChronoUnit.HOURS));

        Invitation savedInvitation = invitationRepository.save(invitation);

        String invitationLink = generateInvitationLink(savedInvitation.getInvitationId());

        sendInvitationEmail(request.getEmail(), project.getProjectName(), invitationLink);

        return savedInvitation;
    }

    private String generateInvitationLink(int invitationId)
    {
        return "https://localhost:5173/invitations/" + invitationId;
    }

    public Invitation getInvitationById(int invitationId)
    {
        return invitationRepository.findById(invitationId)
                .orElseThrow(() -> new ResourceNotFoundException("Invitation not found with id: " + invitationId));
    }

    private void sendInvitationEmail(String to, String projectName, String invitationLink)
    {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("no-reply-planwise@gmail.com");
        message.setTo(to);
        message.setSubject("You've been invited to collaborate on " + projectName);
        message.setText("Hello,\n\n" +
                "You have been invited to collaborate on the project '" + projectName + "' in PlanWise.\n\n" +
                "Click the link below to accept the invitation:\n" +
                invitationLink + "\n\n" +
                "If you don't have an account yet, you'll be able to create one after clicking the link.\n\n" +
                "The PlanWise Team");

        emailSender.send(message);
    }

    @Transactional
    public void acceptInvitation(int invitationId)
    {
        Invitation invitation = invitationRepository.findById(invitationId)
                .orElseThrow(() -> new ResourceNotFoundException("Invitation not found"));

        invitation.setStatus("Accepted");
        invitationRepository.save(invitation);

        addUserToProject(invitation.getEmail(), invitation.getProjectId());
    }

    @Transactional
    public void declineInvitation(int invitationId)
    {
        Invitation invitation = invitationRepository.findById(invitationId)
                .orElseThrow(() -> new ResourceNotFoundException("Invitation not found"));

        invitation.setStatus("Declined!");
        invitationRepository.save(invitation);
    }

    private void addUserToProject(String userId, Long projectId)
    {
        // Add to project_members table
        // This would be a call to a ProjectMemberRepository or similar
    }

    public List<Invitation> getPendingInvitationsForUser(String userId)
    {
        return invitationRepository.findByEmailAndStatus(userId, "Pending");
    }
}