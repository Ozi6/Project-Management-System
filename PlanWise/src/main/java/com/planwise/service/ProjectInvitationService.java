package com.planwise.service;

import com.planwise.dto.ProjectInvitationDTO;
import com.planwise.model.Project;
import com.planwise.model.ProjectInvitation;
import com.planwise.repository.ProjectInvitationRepository;
import com.planwise.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.regex.Pattern;

@Service
public class ProjectInvitationService {
    private final ProjectInvitationRepository invitationRepository;
    private final ProjectRepository projectRepository;
    private final ProjectMemberService memberService;
    private final EmailService emailService;
    private final String baseUrl;
    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[A-Za-z0-9+_.-]+@(.+)$");

    public ProjectInvitationService(
            ProjectInvitationRepository invitationRepository,
            ProjectRepository projectRepository,
            ProjectMemberService memberService,
            EmailService emailService,
            @Value("${app.base-url}") String baseUrl) {
        this.invitationRepository = invitationRepository;
        this.projectRepository = projectRepository;
        this.memberService = memberService;
        this.emailService = emailService;
        this.baseUrl = baseUrl;
    }

    @Transactional
    public ProjectInvitationDTO createInvitation(Long projectId, String email) {
        if (!isValidEmail(email)) {
            throw new RuntimeException("Invalid email format");
        }

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        // Проверяем, не существует ли уже приглашение для этого email
        Optional<ProjectInvitation> existingInvitation = invitationRepository
                .findByEmailAndProjectId(email, projectId);

        if (existingInvitation.isPresent()) {
            ProjectInvitation invitation = existingInvitation.get();
            if (!invitation.isUsed() && invitation.getExpiresAt().isAfter(LocalDateTime.now())) {
                return createInvitationDTO(invitation);
            }
        }

        ProjectInvitation invitation = new ProjectInvitation();
        invitation.setProject(project);
        invitation.setEmail(email);

        invitation = invitationRepository.save(invitation);
        ProjectInvitationDTO dto = createInvitationDTO(invitation);

        // Отправляем email с приглашением
        try {
            emailService.sendInvitationEmail(email, dto.getInvitationLink());
        } catch (Exception e) {
            throw new RuntimeException("Failed to send invitation email: " + e.getMessage());
        }

        return dto;
    }

    @Transactional
    public ProjectInvitationDTO generateInvitationLink(Long projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        ProjectInvitation invitation = new ProjectInvitation();
        invitation.setProject(project);
        invitation.setEmail("public_invitation"); // Специальный маркер для публичных приглашений

        invitation = invitationRepository.save(invitation);
        return createInvitationDTO(invitation);
    }

    @Transactional
    public void acceptInvitation(String token, String userId) {
        ProjectInvitation invitation = invitationRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid invitation token"));

        if (invitation.isUsed()) {
            throw new RuntimeException("Invitation has already been used");
        }

        if (invitation.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Invitation has expired");
        }

        // Добавляем пользователя в проект с ролью "member"
        memberService.addMember(invitation.getProject().getId(), userId, "member");

        invitation.setUsed(true);
        invitationRepository.save(invitation);
    }

    private ProjectInvitationDTO createInvitationDTO(ProjectInvitation invitation) {
        ProjectInvitationDTO dto = new ProjectInvitationDTO();
        dto.setEmail(invitation.getEmail());
        dto.setInvitationLink(baseUrl + "/accept-invitation?token=" + invitation.getToken());
        return dto;
    }

    private boolean isValidEmail(String email) {
        return email != null && EMAIL_PATTERN.matcher(email).matches();
    }
}