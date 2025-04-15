package com.backend.PlanWise.DataTransferObjects;

public class ReactionDTO
{
    private Long messageId;
    private String userId;
    private String reactionType;
    private Long channelId;

    public Long getMessageId()
    {
        return messageId;
    }

    public void setMessageId(Long messageId)
    {
        this.messageId = messageId;
    }

    public String getUserId()
    {
        return userId;
    }

    public void setUserId(String userId)
    {
        this.userId = userId;
    }

    public String getReactionType()
    {
        return reactionType;
    }

    public void setReactionType(String reactionType)
    {
        this.reactionType = reactionType;
    }

    public Long getChannelId()
    {
        return channelId;
    }

    public void setChannelId(Long channelId)
    {
        this.channelId = channelId;
    }
}
