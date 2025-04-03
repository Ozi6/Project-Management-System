package com.planwise.dto;

import lombok.Data;
import java.util.Set;

@Data
public class TeamDTO {
    private Long id;
    private String name;
    private String iconName;
    private Long projectId;
    private Set<String> memberIds;
    private String createdAt;
    private String updatedAt;
}