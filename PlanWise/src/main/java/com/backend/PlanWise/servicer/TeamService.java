package com.backend.PlanWise.servicer;

import com.backend.PlanWise.DataPool.ProjectDataPool;
import com.backend.PlanWise.DataPool.TeamDataPool;
import com.backend.PlanWise.DataPool.UserDataPool;
import com.backend.PlanWise.DataTransferObjects.TeamDTO;
import com.backend.PlanWise.DataTransferObjects.UserDTO;
import com.backend.PlanWise.Exceptions.ResourceNotFoundException;
import com.backend.PlanWise.model.Team;
import com.backend.PlanWise.model.User;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.stream.Collectors;

@Service
public class TeamService
{
    @Autowired
    private TeamDataPool teamRepository;

    @Autowired
    private UserDataPool userRepository;

    @Autowired
    private ProjectDataPool projectRepository;

    @Autowired
    private RecentActivityService recentActivityService;

    @Transactional
    public void addUserToTeam(String userId, Long teamId)
    {
        User user = userRepository.findByUserId(userId);
        if(user == null)
            throw new ResourceNotFoundException("User not found with userId: " + userId);

        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new ResourceNotFoundException("Team not found with id: " + teamId));

        if(!projectRepository.existsUserInProject(team.getProject().getProjectId(), user.getUserId()))
            throw new IllegalArgumentException("User is not a member of this project");

        if(!team.getMembers().contains(user))
        {
            team.getMembers().add(user);
            teamRepository.save(team);
            recentActivityService.createActivity(
                    user.getUserId(),
                    "joined",
                    "Team",
                    teamId
            );
        }
    }

    @Transactional
    public void removeUserFromTeam(String userId, Long teamId)
    {
        User user = userRepository.findByUserId(userId);
        if(user == null)
            throw new ResourceNotFoundException("User not found with userId: " + userId);

        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new ResourceNotFoundException("Team not found with id: " + teamId));

        if(team.getMembers().contains(user))
        {
            team.getMembers().remove(user);
            teamRepository.save(team);
        }
    }

    public TeamDTO getTeamWithMembers(Long teamId)
    {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new ResourceNotFoundException("Team not found with id: " + teamId));
        TeamDTO dto = new TeamDTO();
        dto.setTeamId(team.getTeamId());
        dto.setTeamName(team.getTeamName());
        dto.setIconName(team.getIconName());
        Set<UserDTO> memberDTOs = team.getMembers().stream()
                .map(this::convertToUserDTO)
                .collect(Collectors.toSet());
        dto.setMembers(memberDTOs);

        return dto;
    }

    private UserDTO convertToUserDTO(User user)
    {
        UserDTO dto = new UserDTO();
        dto.setUserId(user.getUserId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setProfileImageUrl(user.getProfileImageUrl());
        return dto;
    }
}
