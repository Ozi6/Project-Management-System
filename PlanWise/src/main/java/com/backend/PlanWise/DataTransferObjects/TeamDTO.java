package com.backend.PlanWise.DataTransferObjects;

import java.util.HashSet;
import java.util.Set;

public class TeamDTO
{
    public Long getTeamId()
    {
        return teamId;
    }

    public void setTeamId(Long teamId)
    {
        this.teamId = teamId;
    }

    public String getTeamName()
    {
        return teamName;
    }

    public void setTeamName(String teamName)
    {
        this.teamName = teamName;
    }

    public String getIconName()
    {
        return iconName;
    }

    public void setIconName(String iconName)
    {
        this.iconName = iconName;
    }

    public Set<UserDTO> getMembers()
    {
        return members;
    }

    public void setMembers(Set<UserDTO> members)
    {
        this.members = members;
    }

    private Long teamId;
    private String teamName;
    private String iconName;
    private Set<UserDTO> members = new HashSet<>();
}