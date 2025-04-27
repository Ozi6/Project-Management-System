package com.backend.PlanWise.model;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "poll_options")
public class PollOption
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "poll_id", nullable = false)
    private Poll poll;

    @Column(name = "option_text", nullable = false)
    private String optionText;

    @OneToMany(mappedBy = "option", cascade = CascadeType.ALL)
    private List<PollVote> votes;

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

    public String getOptionText()
    {
        return optionText;
    }

    public void setOptionText(String optionText)
    {
        this.optionText = optionText;
    }

    public List<PollVote> getVotes()
    {
        return votes;
    }

    public void setVotes(List<PollVote> votes)
    {
        this.votes = votes;
    }
}