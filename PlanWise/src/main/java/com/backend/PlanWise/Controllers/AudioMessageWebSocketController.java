package com.backend.PlanWise.Controllers;

import com.backend.PlanWise.DataTransferObjects.AudioMessageDTO;
import com.backend.PlanWise.servicer.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Controller;

@Controller
public class AudioMessageWebSocketController
{
    @Autowired
    private MessageService messageService;

    @MessageMapping("/audio/{channelId}/send")
    public void processAudioMessage(
            @DestinationVariable Long channelId,
            @Payload AudioMessageDTO audioMessageDTO)
    {
        try{
            audioMessageDTO.setChannelId(channelId);
            messageService.createAudioMessage(audioMessageDTO);
        }catch(Exception e){
            System.err.println("Error processing audio message: " + e.getMessage());
        }
    }
}