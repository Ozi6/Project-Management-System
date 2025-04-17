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
}
