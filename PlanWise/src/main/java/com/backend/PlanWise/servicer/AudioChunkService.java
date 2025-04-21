package com.backend.PlanWise.servicer;

import com.backend.PlanWise.DataTransferObjects.AudioChunkDTO;
import com.backend.PlanWise.DataTransferObjects.AudioMessageDTO;
import com.backend.PlanWise.model.AudioChunk;
import com.backend.PlanWise.model.Message;
import com.backend.PlanWise.model.VoiceMessage;
import com.backend.PlanWise.repository.MessageRepository;
import com.backend.PlanWise.repository.VoiceMessageRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class AudioChunkService {

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private VoiceMessageRepository voiceMessageRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    private final Map<String, Map<Integer, String>> audioChunksMap = new ConcurrentHashMap<>();
    private final Map<String, AudioChunkDTO> audioMetadataMap = new ConcurrentHashMap<>();

    public void processAudioChunk(Long channelId, AudioChunkDTO chunkDTO)
    {
        String messageId = chunkDTO.getMessageId();
        int chunkIndex = chunkDTO.getChunkIndex();
        int totalChunks = chunkDTO.getTotalChunks();

        if(chunkIndex == 0)
            audioMetadataMap.put(messageId, chunkDTO);

        audioChunksMap.computeIfAbsent(messageId, k -> new ConcurrentHashMap<>())
                .put(chunkIndex, chunkDTO.getAudioDataChunk());

        System.out.println("Stored chunk " + chunkIndex + " of " + totalChunks +
                " for messageId " + messageId);

        Map<Integer, String> chunks = audioChunksMap.get(messageId);
        if(chunks != null && chunks.size() == totalChunks)
            processFinalizedAudio(messageId, channelId);
    }

    private void processFinalizedAudio(String messageId, Long channelId)
    {
        try{
            Map<Integer, String> chunks = audioChunksMap.get(messageId);
            AudioChunkDTO metadata = audioMetadataMap.get(messageId);

            if(chunks == null || metadata == null)
            {
                System.err.println("Missing chunks or metadata for messageId: " + messageId);
                return;
            }

            StringBuilder combinedBase64 = new StringBuilder();
            for(int i = 0; i < metadata.getTotalChunks(); i++)
            {
                String chunk = chunks.get(i);
                if(chunk == null)
                {
                    System.err.println("Missing chunk " + i + " for messageId: " + messageId);
                    return;
                }
                combinedBase64.append(chunk);
            }

            AudioMessageDTO audioMessageDTO = new AudioMessageDTO();
            audioMessageDTO.setSenderId(metadata.getSenderId());
            audioMessageDTO.setChannelId(metadata.getChannelId());
            audioMessageDTO.setProjectId(metadata.getProjectId());
            audioMessageDTO.setContent(metadata.getContent());
            audioMessageDTO.setFileType(metadata.getFileType());
            audioMessageDTO.setFileSize(metadata.getFileSize());
            audioMessageDTO.setDurationSeconds(metadata.getDurationSeconds());
            audioMessageDTO.setWaveformData(metadata.getWaveformData());
            audioMessageDTO.setAudioDataBase64(combinedBase64.toString());
            createAudioMessage(audioMessageDTO);
            audioChunksMap.remove(messageId);
            audioMetadataMap.remove(messageId);

            System.out.println("Successfully processed complete audio message: " + messageId);

        }catch(Exception e){
            System.err.println("Error processing finalized audio for messageId " + messageId + ": " + e.getMessage());
            e.printStackTrace();
        }
    }

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
        message.setSenderId(audioMessageDTO.getSenderId());
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