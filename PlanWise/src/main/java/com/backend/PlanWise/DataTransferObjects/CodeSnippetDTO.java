package com.backend.PlanWise.DataTransferObjects;

import lombok.Data;

@Data
public class CodeSnippetDTO
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

    public String getLanguage()
    {
        return language;
    }

    public void setLanguage(String language)
    {
        this.language = language;
    }

    public String getCodeContent()
    {
        return codeContent;
    }

    public void setCodeContent(String codeContent)
    {
        this.codeContent = codeContent;
    }

    private Long id;
    private Long messageId;
    private String language;
    private String codeContent;
}