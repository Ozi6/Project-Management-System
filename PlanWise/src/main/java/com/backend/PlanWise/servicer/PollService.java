package com.backend.PlanWise.servicer;

import com.backend.PlanWise.DataTransferObjects.PollCreationDTO;
import com.backend.PlanWise.DataTransferObjects.PollDTO;
import com.backend.PlanWise.DataTransferObjects.PollOptionDTO;
import com.backend.PlanWise.model.*;
import com.backend.PlanWise.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PollService
{
    @Autowired
    private PollRepository pollRepository;

    @Autowired
    private PollOptionRepository pollOptionRepository;

    @Autowired
    private PollVoteRepository pollVoteRepository;

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private MessageChannelRepository channelRepository;

    @Transactional
    public PollDTO createPoll(Long channelId, PollCreationDTO dto)
    {
        String userId = dto.getUserId();

        MessageChannel channel = channelRepository.findById(channelId)
                .orElseThrow(() -> new RuntimeException("Channel not found"));

        Message message = new Message();
        message.setSenderId(userId);
        message.setContent("📊 " + dto.getQuestion());
        message.setChannelId(channelId);
        message.setTimestamp(LocalDateTime.now());
        Long projectId = channelRepository.findProjectIdByChannelId(channelId);
        message.setProjectId(projectId.intValue());
        message = messageRepository.save(message);

        Poll poll = new Poll();
        poll.setMessage(message);
        poll.setQuestion(dto.getQuestion());
        poll.setMultipleChoice(dto.isMultipleChoice());
        poll.setExpiresAt(dto.getExpiresAt());
        poll = pollRepository.save(poll);

        List<PollOption> options = new ArrayList<>();
        for(String optionText : dto.getOptions())
        {
            PollOption option = new PollOption();
            option.setPoll(poll);
            option.setOptionText(optionText);
            options.add(option);
        }
        pollOptionRepository.saveAll(options);

        poll.setOptions(options);
        return convertToDTO(poll);
    }

    @Transactional
    public PollDTO voteOnPoll(Long pollId, Long optionId, String userId)
    {
        Poll poll = pollRepository.findById(pollId)
                .orElseThrow(() -> new RuntimeException("Poll not found"));

        PollOption option = pollOptionRepository.findById(optionId)
                .orElseThrow(() -> new RuntimeException("Option not found"));

        if(!option.getPoll().getId().equals(pollId))
            throw new RuntimeException("Option does not belong to this poll");

        if(pollVoteRepository.existsByPollIdAndUserId(pollId, userId))
            throw new RuntimeException("User has already voted");

        PollVote vote = new PollVote();
        vote.setPoll(poll);
        vote.setOption(option);
        vote.setUserId(userId);
        pollVoteRepository.save(vote);

        return convertToDTO(poll);
    }

    private PollDTO convertToDTO(Poll poll)
    {
        PollDTO dto = new PollDTO();
        dto.setId(poll.getId());
        dto.setMessageId(poll.getMessage().getId());
        dto.setQuestion(poll.getQuestion());
        dto.setMultipleChoice(poll.isMultipleChoice());
        dto.setExpiresAt(poll.getExpiresAt());
        dto.setChannelId(poll.getMessage().getChannelId());

        List<PollOptionDTO> optionDTOs = poll.getOptions().stream().map(option ->
        {
            PollOptionDTO optionDTO = new PollOptionDTO();
            optionDTO.setId(option.getId());
            optionDTO.setOptionText(option.getOptionText());
            optionDTO.setVotes(option.getVotes() != null ? option.getVotes().size() : 0);
            return optionDTO;
        }).collect(Collectors.toList());

        dto.setOptions(optionDTOs);
        dto.setTotalVotes(optionDTOs.stream().mapToInt(PollOptionDTO::getVotes).sum());

        return dto;
    }
}