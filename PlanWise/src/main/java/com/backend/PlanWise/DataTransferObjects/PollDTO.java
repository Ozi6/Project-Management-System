package com.backend.PlanWise.DataTransferObjects;

import java.time.LocalDateTime;
import java.util.List;

public class PollDTO
{
    public Long getId()
    {
        return id;
    }

    public void setId(Long id)
    {
        this.id = id;
    }

    public Long getMessageId()
    {
        return messageId;
    }

    public void setMessageId(Long messageId)
    {
        this.messageId = messageId;
    }

    public String getQuestion()
    {
        return question;
    }

    public void setQuestion(String question)
    {
        this.question = question;
    }

    public boolean isMultipleChoice()
    {
        return isMultipleChoice;
    }

    public void setMultipleChoice(boolean multipleChoice)
    {
        isMultipleChoice = multipleChoice;
    }

    public LocalDateTime getExpiresAt()
    {
        return expiresAt;
    }

    public void setExpiresAt(LocalDateTime expiresAt)
    {
        this.expiresAt = expiresAt;
    }

    public List<PollOptionDTO> getOptions()
    {
        return options;
    }

    public void setOptions(List<PollOptionDTO> options)
    {
        this.options = options;
    }

    public Long getChannelId()
    {
        return channelId;
    }

    public void setChannelId(Long channelId)
    {
        this.channelId = channelId;
    }

    public int getTotalVotes()
    {
        return totalVotes;
    }

    public void setTotalVotes(int totalVotes)
    {
        this.totalVotes = totalVotes;
    }

    private Long id;
    private Long messageId;
    private String question;
    private boolean isMultipleChoice;
    private LocalDateTime expiresAt;
    private List<PollOptionDTO> options;
    private Long channelId;
    private int totalVotes;
}