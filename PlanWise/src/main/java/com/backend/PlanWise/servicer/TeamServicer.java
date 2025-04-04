package com.backend.PlanWise.servicer;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.backend.PlanWise.DataPool.ProjectDataPool;
import com.backend.PlanWise.DataPool.TeamDataPool;
import com.backend.PlanWise.DataPool.UserDataPool;
import com.backend.PlanWise.DataTransferObjects.TeamDTO;
import com.backend.PlanWise.DataTransferObjects.UserDTO;
import com.backend.PlanWise.exception.ResourceNotFoundException;
import com.backend.PlanWise.model.Project;
import com.backend.PlanWise.model.Team;
import com.backend.PlanWise.model.User;

@Service
@Transactional
public class TeamServicer {

    @Autowired
    private TeamDataPool teamRepository;

    @Autowired
    private ProjectDataPool projectRepository;

    @Autowired
    private UserDataPool userDataPool;

    public TeamDTO createTeam(TeamDTO teamDTO) {
        if (teamDTO.getTeamName() == null || teamDTO.getTeamName().trim().isEmpty()) {
            throw new IllegalArgumentException("The name of the team cannot be empty");
        }

        if (teamDTO.getProjectId() == null) {
            throw new IllegalArgumentException("ID The project is required");
        }

        Project project = projectRepository.findById(teamDTO.getProjectId())
                .orElseThrow(() -> new ResourceNotFoundException("The project was not found with ID: " + teamDTO.getProjectId()));

        Team team = new Team();
        team.setTeamName(teamDTO.getTeamName());
        team.setIconName(teamDTO.getIconName() != null ? teamDTO.getIconName() : "Users");
        team.setProject(project);
        team.setCreatedAt(LocalDateTime.now());
        team.setUpdatedAt(LocalDateTime.now());

        Team savedTeam = teamRepository.save(team);
        return convertToDTO(savedTeam);
    }

    public List<TeamDTO> getTeamsByProject(Long projectId) {
        return teamRepository.findByProjectProjectId(projectId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public void deleteTeam(Long teamId) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new ResourceNotFoundException("Team not found with ID: " + teamId));

        // Get the project before clearing members
        Project project = team.getProject();

        // Clear all members from the team
        team.getMembers().clear();
        teamRepository.save(team);

        // Remove team from project's teams collection
        if (project != null) {
            project.getTeams().remove(team);
            projectRepository.save(project);
        }

        // Finally delete the team
        teamRepository.delete(team);
    }

    private TeamDTO convertToDTO(Team team) {
        TeamDTO dto = new TeamDTO();
        dto.setTeamId(team.getTeamId());
        dto.setTeamName(team.getTeamName());
        dto.setIconName(team.getIconName());
        dto.setProjectId(team.getProject().getProjectId());

        // We convert the team members in UserDTO
        Set<UserDTO> memberDTOs = team.getMembers().stream()
                .map(user -> {
                    UserDTO userDTO = new UserDTO();
                    userDTO.setUserId(user.getUserId());
                    userDTO.setUsername(user.getUsername());
                    userDTO.setEmail(user.getEmail());
                    return userDTO;
                })
                .collect(Collectors.toSet());

        dto.setMembers(memberDTOs);
        return dto;
    }

    public TeamDTO updateTeam(TeamDTO teamDTO) {
        if (teamDTO.getTeamId() == null) {
            throw new IllegalArgumentException("Team ID is required");
        }
        if (teamDTO.getTeamName() == null || teamDTO.getTeamName().trim().isEmpty()) {
            throw new IllegalArgumentException("Team name cannot be empty");
        }

        Team team = teamRepository.findById(teamDTO.getTeamId())
                .orElseThrow(() -> new ResourceNotFoundException("Team not found with ID: " + teamDTO.getTeamId()));

        team.setTeamName(teamDTO.getTeamName());
        team.setIconName(teamDTO.getIconName() != null ? teamDTO.getIconName() : team.getIconName());
        team.setUpdatedAt(LocalDateTime.now());

        Team updatedTeam = teamRepository.save(team);
        return convertToDTO(updatedTeam);
    }

    public void updateMemberTeam(String memberId, Long teamId) {
        

        if (memberId == null) {
            throw new IllegalArgumentException("ID the participant cannot be empty");
        }

        // We get a user
        User user = userDataPool.findById(memberId)
                .orElseThrow(() -> new ResourceNotFoundException("The participant was not found with ID: " + memberId));
        

        // If teamId null, We delete the user from all commands
        if (teamId == null) {
            
            List<Team> userTeams = teamRepository.findByMembersUserId(memberId);
            for (Team team : userTeams) {
                team.getMembers().remove(user);
            }
            teamRepository.saveAll(userTeams);
            return;
        }

        // We get a team
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new ResourceNotFoundException("The team was not found with ID: " + teamId));
        

        // We delete the user from all other teams
        List<Team> userTeams = teamRepository.findByMembersUserId(memberId);
        
        for (Team userTeam : userTeams) {
            if (!userTeam.getTeamId().equals(teamId)) {
                userTeam.getMembers().remove(user);
            }
        }
        teamRepository.saveAll(userTeams);

        // Add the user to the new command
        team.getMembers().add(user);
        teamRepository.save(team);
        
    }

    public Long getMemberTeamId(String memberId) {
        if (memberId == null) {
            throw new IllegalArgumentException("ID the participant cannot be empty");
        }

        List<Team> userTeams = teamRepository.findByMembersUserId(memberId);
        if (userTeams.isEmpty()) {
            return null;
        }

        // Return ID first user command
        return userTeams.get(0).getTeamId();
    }

    public void deleteTeamMembers(Long teamId) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new ResourceNotFoundException("Team not found with ID: " + teamId));

        // Clear all members from the team
        team.getMembers().clear();
        teamRepository.save(team);
    }
}