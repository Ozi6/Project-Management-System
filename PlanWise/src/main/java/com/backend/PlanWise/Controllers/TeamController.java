package com.backend.PlanWise.Controllers;

import com.backend.PlanWise.DataTransferObjects.TeamDTO;
import com.backend.PlanWise.servicer.TeamServicer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/teams")
public class TeamController {

    @Autowired
    private TeamServicer teamServicer;

    @PostMapping
    public ResponseEntity<TeamDTO> createTeam(@RequestBody TeamDTO teamDTO) {
        return ResponseEntity.ok(teamServicer.createTeam(teamDTO));
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<TeamDTO>> getTeamsByProject(@PathVariable Long projectId) {
        return ResponseEntity.ok(teamServicer.getTeamsByProject(projectId));
    }

    @DeleteMapping("/{teamId}")
    public ResponseEntity<Void> deleteTeam(@PathVariable Long teamId) {
        teamServicer.deleteTeam(teamId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{teamId}")
    public ResponseEntity<TeamDTO> updateTeam(@PathVariable Long teamId,
            @RequestBody TeamDTO teamDTO) {
        teamDTO.setTeamId(teamId);
        return ResponseEntity.ok(teamServicer.updateTeam(teamDTO));
    }

    @PutMapping("/members/{memberId}/team")
    public ResponseEntity<Map<String, String>> updateMemberTeam(
            @PathVariable String memberId,
            @RequestBody Map<String, Long> request) {
        Long teamId = request.get("teamId");
        teamServicer.updateMemberTeam(memberId, teamId);
        return ResponseEntity.ok(Map.of("status", "success", "message", "The participant's team is successfully updated"));
    }

    @GetMapping("/members/{memberId}")
    public ResponseEntity<Map<String, Long>> getMemberTeam(@PathVariable String memberId) {
        Long teamId = teamServicer.getMemberTeamId(memberId);
        return ResponseEntity.ok(Map.of("teamId", teamId != null ? teamId : -1L));
    }

    @DeleteMapping("/{teamId}/members")
    public ResponseEntity<Void> deleteTeamMembers(@PathVariable Long teamId) {
        teamServicer.deleteTeamMembers(teamId);
        return ResponseEntity.noContent().build();
    }
}