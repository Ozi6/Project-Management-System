package com.planwise.service;

import com.planwise.dto.TeamDTO;
import com.planwise.model.Team;
import com.planwise.model.TeamMember;
import com.planwise.model.TeamMemberId;
import com.planwise.repository.TeamRepository;
import com.planwise.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TeamService {
    private final TeamRepository teamRepository;
    private final ProjectRepository projectRepository;

    @Transactional
    public TeamDTO createTeam(TeamDTO teamDTO) {
        if (teamDTO.getName() == null || teamDTO.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Team name cannot be empty");
        }

        if (teamDTO.getProjectId() == null) {
            throw new IllegalArgumentException("Project ID is required");
        }

        Team team = new Team();
        team.setName(teamDTO.getName());
        team.setIconName(teamDTO.getIconName() != null ? teamDTO.getIconName() : "Users");
        team.setProject(projectRepository.findById(teamDTO.getProjectId())
                .orElseThrow(() -> new IllegalArgumentException("Project not found")));

        Team savedTeam = teamRepository.save(team);
        return convertToDTO(savedTeam);
    }

    @Transactional
    public TeamDTO updateTeam(Long id, TeamDTO teamDTO) {
        Team team = teamRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Team not found"));

        if (teamDTO.getName() != null && !teamDTO.getName().trim().isEmpty()) {
            team.setName(teamDTO.getName());
        }

        if (teamDTO.getIconName() != null) {
            team.setIconName(teamDTO.getIconName());
        }

        Team updatedTeam = teamRepository.save(team);
        return convertToDTO(updatedTeam);
    }

    @Transactional
    public void deleteTeam(Long id) {
        teamRepository.deleteById(id);
    }

    public List<TeamDTO> getTeamsByProject(Long projectId) {
        return teamRepository.findByProjectId(projectId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private TeamDTO convertToDTO(Team team) {
        TeamDTO dto = new TeamDTO();
        dto.setId(team.getId());
        dto.setName(team.getName());
        dto.setIconName(team.getIconName());
        dto.setProjectId(team.getProject().getId());
        dto.setCreatedAt(team.getCreatedAt().toString());
        dto.setUpdatedAt(team.getUpdatedAt().toString());
        return dto;
    }
}