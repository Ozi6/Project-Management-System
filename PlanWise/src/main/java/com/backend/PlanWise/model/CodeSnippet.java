package com.backend.PlanWise.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "code_snippets")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CodeSnippet
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

    public Message getMessage()
    {
        return message;
    }

    public void setMessage(Message message)
    {
        this.message = message;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "message_id", nullable = false)
    private Long messageId;

    @Column(name = "language", nullable = false, length = 50)
    private String language;

    @Column(name = "code_content", nullable = false, columnDefinition = "LONGTEXT")
    private String codeContent;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "message_id", referencedColumnName = "id", insertable = false, updatable = false)
    private Message message;
}