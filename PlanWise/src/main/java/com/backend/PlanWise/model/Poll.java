package com.backend.PlanWise.model;

import com.backend.PlanWise.DataTransferObjects.PollDTO;
import com.backend.PlanWise.DataTransferObjects.PollOptionDTO;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "polls")
public class Poll
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "message_id", nullable = false)
    private Message message;

    @Column(nullable = false)
    private String question;

    @Column(name = "is_multiple_choice")
    private boolean isMultipleChoice = false;

    @Column(name = "expires_at")
    private LocalDateTime expiresAt;

    @OneToMany(mappedBy = "poll", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PollOption> options;

    public List<PollOption> getOptions()
    {
        return options;
    }

    public void setOptions(List<PollOption> options)
    {
        this.options = options;
    }

    public LocalDateTime getExpiresAt()
    {
        return expiresAt;
    }

    public void setExpiresAt(LocalDateTime expiresAt)
    {
        this.expiresAt = expiresAt;
    }

    public boolean isMultipleChoice()
    {
        return isMultipleChoice;
    }

    public void setMultipleChoice(boolean multipleChoice)
    {
        isMultipleChoice = multipleChoice;
    }

    public String getQuestion()
    {
        return question;
    }

    public void setQuestion(String question)
    {
        this.question = question;
    }

    public Message getMessage()
    {
        return message;
    }

    public void setMessage(Message message)
    {
        this.message = message;
    }

    public Long getId()
    {
        return id;
    }

    public void setId(Long id)
    {
        this.id = id;
    }

    public PollDTO convertToDTO()
    {
        PollDTO dto = new PollDTO();
        dto.setId(this.id);
        dto.setMessageId(this.message != null ? this.message.getId() : null);
        dto.setQuestion(this.question);
        dto.setMultipleChoice(this.isMultipleChoice);
        dto.setExpiresAt(this.expiresAt);
        dto.setChannelId(this.message != null && this.message.getChannel() != null ? this.message.getChannel().getChannelId() : null);
        int totalVotes = 0;
        List<PollOptionDTO> optionDTOs = new java.util.ArrayList<>();
        if(this.options != null)
        {
            for(PollOption option : this.options)
            {
                PollOptionDTO optionDTO = new PollOptionDTO();
                optionDTO.setId(option.getId());
                optionDTO.setOptionText(option.getOptionText());
                int votesCount = option.getVotes() != null ? option.getVotes().size() : 0;
                optionDTO.setVotes(votesCount);
                totalVotes += votesCount;
                optionDTOs.add(optionDTO);
            }
        }
        dto.setOptions(optionDTOs);
        dto.setTotalVotes(totalVotes);
        return dto;
    }
}
