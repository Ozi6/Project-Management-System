package com.backend.PlanWise.Controllers;

import com.backend.PlanWise.DataTransferObjects.AudioChunkDTO;
import com.backend.PlanWise.servicer.AudioChunkService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Controller;

@Controller
public class AudioMessageWebSocketController
{
    @Autowired
    private AudioChunkService audioChunkService;

    @MessageMapping("/audio/{channelId}/send")
    public void processAudioChunk(
            @DestinationVariable Long channelId,
            @Payload AudioChunkDTO chunkDTO)
    {
        try{
            System.out.println("Received chunk for channel " + channelId +
                    ", messageId: " + chunkDTO.getMessageId() +
                    ", chunkIndex: " + chunkDTO.getChunkIndex() +
                    ", chunkSize: " + chunkDTO.getAudioDataChunk().length());

            audioChunkService.processAudioChunk(channelId, chunkDTO);
        }catch(Exception e){
            System.err.println("Error processing audio chunk for messageId " + chunkDTO.getMessageId() + ": " + e.getMessage());
        }
    }
}