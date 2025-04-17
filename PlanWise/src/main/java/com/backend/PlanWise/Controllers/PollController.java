package com.backend.PlanWise.Controllers;

import com.backend.PlanWise.DataTransferObjects.PollCreationDTO;
import com.backend.PlanWise.DataTransferObjects.PollDTO;
import com.backend.PlanWise.DataTransferObjects.PollVoteDTO;
import com.backend.PlanWise.repository.PollRepository;
import com.backend.PlanWise.servicer.PollService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/polls")
public class PollController
{
    @Autowired
    private PollService pollService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @PostMapping("/channel/{channelId}/create")
    public ResponseEntity<PollDTO> createPoll(
            @PathVariable Long channelId,
            @RequestBody PollCreationDTO pollCreationDTO)
    {
        PollDTO poll = pollService.createPoll(channelId, pollCreationDTO);
        messagingTemplate.convertAndSend("/topic/channel/" + channelId + "/poll", poll);
        return ResponseEntity.ok(poll);
    }

    @PostMapping("/{pollId}/vote")
    public ResponseEntity<PollDTO> voteOnPoll(
            @PathVariable Long pollId,
            @RequestBody PollVoteDTO pollVoteDTO)
    {
        PollDTO poll = pollService.voteOnPoll(pollId, pollVoteDTO.getOptionId(),
                pollVoteDTO.getUserId());
        messagingTemplate.convertAndSend("/topic/channel/" + poll.getChannelId() + "/poll", poll);
        return ResponseEntity.ok(poll);
    }
}