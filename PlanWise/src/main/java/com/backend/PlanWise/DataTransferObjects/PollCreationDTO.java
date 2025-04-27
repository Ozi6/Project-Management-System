package com.backend.PlanWise.DataTransferObjects;

import java.time.LocalDateTime;
import java.util.List;

public class PollCreationDTO
{
    public String getQuestion()
    {
        return question;
    }

    public void setQuestion(String question)
    {
        this.question = question;
    }

    public List<String> getOptions()
    {
        return options;
    }

    public void setOptions(List<String> options)
    {
        this.options = options;
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

    public Long getMessageId()
    {
        return messageId;
    }

    public void setMessageId(Long messageId)
    {
        this.messageId = messageId;
    }

    private String question;
    private List<String> options;
    private boolean isMultipleChoice;
    private LocalDateTime expiresAt;
    private Long messageId;

    public String getUserId()
    {
        return userId;
    }

    public void setUserId(String userId)
    {
        this.userId = userId;
    }

    String userId;
}