package com.backend.PlanWise.servicer;

import com.backend.PlanWise.DataTransferObjects.AudioMessageDTO;
import com.backend.PlanWise.model.Message;
import com.backend.PlanWise.model.VoiceMessage;
import com.backend.PlanWise.repository.MessageRepository;
import com.backend.PlanWise.repository.VoiceMessageRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Base64;

@Service
public class MessageService
{

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private VoiceMessageRepository voiceMessageRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Transactional
    public Message createAudioMessage(AudioMessageDTO audioMessageDTO)
    {
        byte[] audioData;
        try{
            audioData = Base64.getDecoder().decode(audioMessageDTO.getAudioDataBase64());
        }catch(IllegalArgumentException e){
            throw new RuntimeException("Invalid base64 audio data", e);
        }

        Message message = new Message();
        message.setSenderId(audioMessageDTO.getSenderId());
        message.setChannelId(audioMessageDTO.getChannelId());
        message.setProjectId(audioMessageDTO.getProjectId());
        message.setContent(audioMessageDTO.getContent() != null ? audioMessageDTO.getContent() : "Voice message");
        message.setTimestamp(LocalDateTime.now());
        message = messageRepository.save(message);

        VoiceMessage voiceMessage = new VoiceMessage();
        voiceMessage.setMessage(message);
        voiceMessage.setAudioData(audioData);
        voiceMessage.setFileType(audioMessageDTO.getFileType());
        voiceMessage.setFileSize(audioMessageDTO.getFileSize());
        voiceMessage.setDurationSeconds(audioMessageDTO.getDurationSeconds());
        voiceMessage.setWaveformData(audioMessageDTO.getWaveformData());
        voiceMessageRepository.save(voiceMessage);

        message.setVoiceMessage(voiceMessage);
        messageRepository.save(message);

        messagingTemplate.convertAndSend(
                "/topic/channel/" + audioMessageDTO.getChannelId(),
                message
        );

        return message;
    }
}