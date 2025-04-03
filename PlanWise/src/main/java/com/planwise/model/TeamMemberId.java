package com.planwise.model;

import jakarta.persistence.Embeddable;
import lombok.Data;
import java.io.Serializable;

@Data
@Embeddable
public class TeamMemberId implements Serializable {
    private Long teamId;
    private String userId;
}