package com.backend.PlanWise.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "poll_votes", uniqueConstraints =
{
        @UniqueConstraint(columnNames = {"poll_id", "user_id"})
})
public class PollVote
{
    public Long getId()
    {
        return id;
    }

    public void setId(Long id)
    {
        this.id = id;
    }

    public Poll getPoll()
    {
        return poll;
    }

    public void setPoll(Poll poll)
    {
        this.poll = poll;
    }

    public PollOption getOption()
    {
        return option;
    }

    public void setOption(PollOption option)
    {
        this.option = option;
    }

    public String getUserId()
    {
        return userId;
    }

    public void setUserId(String userId)
    {
        this.userId = userId;
    }

    public LocalDateTime getVotedAt()
    {
        return votedAt;
    }

    public void setVotedAt(LocalDateTime votedAt)
    {
        this.votedAt = votedAt;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "poll_id", nullable = false)
    private Poll poll;

    @ManyToOne
    @JoinColumn(name = "option_id", nullable = false)
    private PollOption option;

    @Column(name = "user_id", nullable = false)
    private String userId;

    @Column(name = "voted_at")
    private LocalDateTime votedAt = LocalDateTime.now();

}