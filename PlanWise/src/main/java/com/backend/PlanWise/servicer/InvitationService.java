package com.backend.PlanWise.servicer;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.backend.PlanWise.DataPool.InvitationDataPool;
import com.backend.PlanWise.DataPool.ProjectDataPool;
import com.backend.PlanWise.DataPool.UserDataPool;
import com.backend.PlanWise.DataTransferObjects.InvitationRequest;
import com.backend.PlanWise.Exceptions.InvalidInvitationException;
import com.backend.PlanWise.Exceptions.ResourceNotFoundException;
import com.backend.PlanWise.model.Invitation;
import com.backend.PlanWise.model.Project;
import com.backend.PlanWise.model.User;

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

        LocalDateTime now = LocalDateTime.now();
        invitation.setInvitedAt(now);
        invitation.setExpiresAt(now.plusHours(12));

        Invitation savedInvitation = invitationRepository.save(invitation);

        String invitationLink = generateInvitationLink(savedInvitation.getInvitationId());

        sendInvitationEmail(request.getEmail(), project.getProjectName(), invitationLink);

        return savedInvitation;
    }

    private String generateInvitationLink(int invitationId)
    {
        return "http://localhost:5173/invitations/" + invitationId;
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
    public void acceptInvitation(int invitationId, String email)
    {
        Invitation invitation = invitationRepository.findById(invitationId)
                .orElseThrow(() -> new ResourceNotFoundException("Invitation not found"));
        if (!"Pending".equals(invitation.getStatus()))
            throw new IllegalStateException("Invitation is not in pending state");
        addUserToProject(email, invitation.getProjectId());
        if(invitation.getToken() == null)
        {
            invitation.setStatus("Accepted");
            invitationRepository.save(invitation);
        }
    }

    @Transactional
    public void declineInvitation(int invitationId)
    {
        Invitation invitation = invitationRepository.findById(invitationId)
                .orElseThrow(() -> new ResourceNotFoundException("Invitation not found"));
        if(!"Pending".equals(invitation.getStatus()))
            throw new IllegalStateException("Invitation is not in pending state");
        invitation.setStatus("Declined");
        invitationRepository.save(invitation);
    }

    public Invitation createGeneralInvite(Long projectId)
    {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        Optional<Invitation> existingInvitation = invitationRepository.findByEmailAndProjectId(
                null, project.getProjectId());

        if(existingInvitation.isPresent())
            return existingInvitation.get();

        Invitation invitation = new Invitation();
        invitation.setProjectId(project.getProjectId());
        invitation.setStatus("Pending");

        LocalDateTime now = LocalDateTime.now();
        invitation.setInvitedAt(now);
        invitation.setExpiresAt(now.plusHours(12));

        Invitation savedInvitation = invitationRepository.save(invitation);

        String token = UUID.randomUUID().toString();
        invitation.setToken(token);

        String invitationLink = generateInvitationLink(savedInvitation.getInvitationId());

        return invitationRepository.save(invitation);
    }

    public Invitation getValidInvitation(Integer id, String token)
    {
        Optional<Invitation> invitationOpt = invitationRepository.findById(id);

        if(invitationOpt.isEmpty())
            throw new InvalidInvitationException("No invitation found with ID: " + id);

        Invitation invitation = invitationOpt.get();

        if(!invitation.getToken().equals(token))
            throw new InvalidInvitationException("Token mismatch. Expected: " + invitation.getToken() +
                    ", Received: " + token);

        if(!invitation.getExpiresAt().isAfter(LocalDateTime.now()))
            throw new InvalidInvitationException("Invitation expired on: " + invitation.getExpiresAt());

        System.out.println("Pending vs " + invitation.getStatus());
        if(!"Pending".toLowerCase().equals(invitation.getStatus().toLowerCase()))
            throw new InvalidInvitationException("Invalid invitation status: " + invitation.getStatus());

        return invitation;
    }

    @Transactional
    private void addUserToProject(String email, Long projectId)
    {
        User user = userRepository.findByEmail(email);
        if(user == null)
            throw new ResourceNotFoundException("User not found with email: " + email);

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + projectId));

        if(!project.getMembers().contains(user))
        {
            project.getMembers().add(user);
            projectRepository.save(project);

        }
    }

    public List<Invitation> getPendingInvitationsForUser(String userId)
    {
        return invitationRepository.findByEmailAndStatus(userId, "Pending");
    }
}