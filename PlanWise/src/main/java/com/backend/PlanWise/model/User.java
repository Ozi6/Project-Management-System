package com.backend.PlanWise.model;

import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "users")
public class User
{
    @Id
    @Column(name = "user_id")
    private String userId;
    
    @Column(nullable = false, length = 50)
    private String username;
    
    @Column(nullable = false, unique = true, length = 100)
    private String email;

    public String getProfileImageUrl()
    {
        return profileImageUrl;
    }

    public void setProfileImageUrl(String profileImageUrl)
    {
        this.profileImageUrl = profileImageUrl;
    }

    @Column(name = "profile_image_url", length = 255)
    private String profileImageUrl;

    @OneToMany(mappedBy = "owner")
    private Set<Project> ownedProjects = new HashSet<>();

    @ManyToMany(mappedBy = "members")
    private Set<Project> memberProjects = new HashSet<>();

    @ManyToMany(mappedBy = "members")
    private Set<Team> teams = new HashSet<>();
    
    // Getters and setters
    public String getUserId() {
        return userId;
    }
    
    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getUsername()
    {
        return username;
    }

    public void setUsername(String username)
    {
        this.username = username;
    }

    public String getEmail()
    {
        return email;
    }

    public void setEmail(String email)
    {
        this.email = email;
    }

}