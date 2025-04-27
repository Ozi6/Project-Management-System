package com.backend.PlanWise.DataTransferObjects;

public class PollVoteDTO
{
    public Long getOptionId()
    {
        return optionId;
    }

    public void setOptionId(Long optionId)
    {
        this.optionId = optionId;
    }

    private Long optionId;

    public String getUserId()
    {
        return userId;
    }

    public void setUserId(String userId)
    {
        this.userId = userId;
    }

    private String userId;

    public Long getPollId()
    {
        return pollId;
    }

    public void setPollId(Long pollId)
    {
        this.pollId = pollId;
    }

    private Long pollId;
}
