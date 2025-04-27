package com.backend.PlanWise.Controllers;

import com.backend.PlanWise.model.VoiceChannelJoinRequest;
import com.backend.PlanWise.model.VoiceChannelLeaveRequest;
import com.backend.PlanWise.model.WebRTCSignal;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import java.util.Collections;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Controller
public class VoiceChannelController
{
    private final Map<String, Map<String, String>> voiceChannelUsers = new ConcurrentHashMap<>();

    @MessageMapping("/voice/{channelId}/join")
    @SendTo("/topic/voice/{channelId}/users")
    public Map<String, String> joinVoiceChannel(@DestinationVariable String channelId,
                                                @Payload VoiceChannelJoinRequest request)
    {
        Map<String, String> users = voiceChannelUsers.computeIfAbsent(channelId, k -> new ConcurrentHashMap<>());
        users.put(request.getUserId(), request.getUsername());
        System.out.println("User joined channel " + channelId + ": " + request.getUserId() + " (" + request.getUsername() + ")");
        System.out.println("Current users in channel " + channelId + ": " + users);
        return users;
    }

    @MessageMapping("/voice/{channelId}/leave")
    @SendTo("/topic/voice/{channelId}/users")
    public Map<String, String> leaveVoiceChannel(@DestinationVariable String channelId,
                                                 @Payload VoiceChannelLeaveRequest request)
    {
        Map<String, String> users = voiceChannelUsers.get(channelId);
        if(users != null)
        {
            users.remove(request.getUserId());
            System.out.println("User left channel " + channelId + ": " + request.getUserId());
            if(users.isEmpty())
            {
                voiceChannelUsers.remove(channelId);
                System.out.println("Channel " + channelId + " is now empty and removed.");
            }
            else
                System.out.println("Current users in channel " + channelId + ": " + users);
        }
        return users != null ? users : Collections.emptyMap();
    }

    @MessageMapping("/voice/{channelId}/signal")
    @SendTo("/topic/voice/{channelId}/signal")
    public WebRTCSignal relaySignal(@Payload WebRTCSignal signal)
    {
        return signal;
    }
}