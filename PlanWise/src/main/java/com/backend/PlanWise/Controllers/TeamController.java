package com.backend.PlanWise.Controllers;

import com.backend.PlanWise.DataTransferObjects.TeamDTO;
import com.backend.PlanWise.servicer.TeamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/teams")
public class TeamController
{
    @Autowired
    private TeamService teamService;

    @PostMapping("/{teamId}/members")
    public ResponseEntity<Void> addMemberToTeam(
            @PathVariable Long teamId,
            @RequestParam String userId)
    {
        teamService.addUserToTeam(userId, teamId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{teamId}/members")
    public ResponseEntity<Void> removeMemberFromTeam(
            @PathVariable Long teamId,
            @RequestParam String userId)
    {
        teamService.removeUserFromTeam(userId, teamId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{teamId}")
    public ResponseEntity<TeamDTO> getTeamWithMembers(@PathVariable Long teamId)
    {
        TeamDTO team = teamService.getTeamWithMembers(teamId);
        return ResponseEntity.ok(team);
    }
}
