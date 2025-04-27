package com.backend.PlanWise.DataTransferObjects;

public class PollOptionDTO
{
    private Long id;
    private String optionText;
    private int votes;

    public Long getId()
    {
        return id;
    }

    public void setId(Long id)
    {
        this.id = id;
    }

    public String getOptionText()
    {
        return optionText;
    }

    public void setOptionText(String optionText)
    {
        this.optionText = optionText;
    }

    public int getVotes()
    {
        return votes;
    }

    public void setVotes(int votes)
    {
        this.votes = votes;
    }
}
