package com.planwise.service;

import com.planwise.model.Project;
import com.planwise.model.ProjectMember;
import com.planwise.repository.ProjectMemberRepository;
import com.planwise.repository.ProjectRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProjectMemberService {
    private final ProjectMemberRepository memberRepository;
    private final ProjectRepository projectRepository;

    public ProjectMemberService(
            ProjectMemberRepository memberRepository,
            ProjectRepository projectRepository) {
        this.memberRepository = memberRepository;
        this.projectRepository = projectRepository;
    }

    @Transactional
    public void addMember(Long projectId, String userId, String role) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        ProjectMember member = new ProjectMember();
        member.setProject(project);
        member.setUserId(userId);
        member.setRole(role);

        // Устанавливаем базовые права доступа в зависимости от роли
        switch (role.toLowerCase()) {
            case "owner":
                member.setCanEdit(true);
                member.setCanDelete(true);
                member.setCanInvite(true);
                member.setCanManageSettings(true);
                break;
            case "admin":
                member.setCanEdit(true);
                member.setCanDelete(true);
                member.setCanInvite(true);
                member.setCanManageSettings(true);
                break;
            case "member":
                member.setCanEdit(true);
                member.setCanDelete(false);
                member.setCanInvite(false);
                member.setCanManageSettings(false);
                break;
            case "viewer":
                member.setCanEdit(false);
                member.setCanDelete(false);
                member.setCanInvite(false);
                member.setCanManageSettings(false);
                break;
            default:
                throw new RuntimeException("Invalid role");
        }

        memberRepository.save(member);
    }
}