package com.backend.PlanWise.Controllers;

import com.backend.PlanWise.DataTransferObjects.PollDTO;
import com.backend.PlanWise.DataTransferObjects.PollVoteDTO;
import com.backend.PlanWise.model.Message;
import com.backend.PlanWise.model.Poll;
import com.backend.PlanWise.repository.MessageRepository;
import com.backend.PlanWise.repository.PollRepository;
import com.backend.PlanWise.servicer.PollService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class PollWebSocketController
{
    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private PollService pollService;

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private PollRepository pollRepository;

    @MessageMapping("/poll/{channelId}/vote")
    public void processPollVote(
            @DestinationVariable Long channelId,
            @Payload PollVoteDTO voteDTO)
    {

        try{
            PollDTO updatedPoll = pollService.voteOnPoll(
                    voteDTO.getPollId(),
                    voteDTO.getOptionId(),
                    voteDTO.getUserId()
            );

            if(updatedPoll.getChannelId() == null)
            {
                Poll poll = pollRepository.findById(voteDTO.getPollId())
                        .orElseThrow(() -> new RuntimeException("Poll not found"));
                Message message = poll.getMessage();
                updatedPoll.setChannelId(message.getChannelId());
                updatedPoll.setMessageId(message.getId());
            }
            messagingTemplate.convertAndSend("/topic/channel/" + channelId + "/poll", updatedPoll);
        }catch(Exception e){
            System.err.println("Error processing poll vote: " + e.getMessage());
        }
    }
}