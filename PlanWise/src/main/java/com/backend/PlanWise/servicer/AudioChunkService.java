package com.backend.PlanWise.servicer;

import com.backend.PlanWise.DataPool.MessageReactionRepository;
import com.backend.PlanWise.DataPool.UserDataPool;
import com.backend.PlanWise.DataTransferObjects.*;
import com.backend.PlanWise.model.AudioChunk;
import com.backend.PlanWise.model.CodeSnippet;
import com.backend.PlanWise.model.Message;
import com.backend.PlanWise.model.VoiceMessage;
import com.backend.PlanWise.repository.CodeSnippetRepository;
import com.backend.PlanWise.repository.MessageRepository;
import com.backend.PlanWise.repository.VoiceMessageRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
public class AudioChunkService
{

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

        MessageDTO messageDTO = convertToDTO(message);
        messagingTemplate.convertAndSend(
                "/topic/channel/" + audioMessageDTO.getChannelId(),
                messageDTO
        );

        return message;
    }

    @Autowired
    UserDataPool userRepository;

    @Autowired
    MessageReactionRepository reactionRepository;

    @Autowired
    CodeSnippetRepository codeSnippetRepository;

    private MessageDTO convertToDTO(Message message)
    {
        MessageDTO dto = new MessageDTO();
        dto.setId(message.getId());
        dto.setProjectId(message.getProjectId());
        dto.setSenderId(message.getSenderId());
        dto.setContent(message.getContent());
        dto.setTimestamp(message.getTimestamp());
        dto.setChannelId(message.getChannelId());
        dto.setEditedAt(message.getEditedAt());
        dto.setEdited(message.isEdited());

        var userOpt = userRepository.findById(message.getSenderId());
        if(userOpt.isPresent())
        {
            var user = userOpt.get();
            dto.setSenderName(user.getUsername());
            dto.setSenderAvatar(user.getProfileImageUrl());
        }

        List<Object[]> reactionCounts = reactionRepository.countReactionsByMessageId(message.getId());
        Map<String, Integer> reactions = new HashMap<>();
        for(Object[] result : reactionCounts)
        {
            String reactionType = (String) result[0];
            Long count = (Long) result[1];
            reactions.put(reactionType, count.intValue());
        }
        dto.setReactions(reactions);

        List<AttachmentDTO> attachmentDTOs = message.getAttachments().stream()
                .map(attachment -> new AttachmentDTO(
                        attachment.getId(),
                        attachment.getFileName(),
                        attachment.getFileType().name(),
                        attachment.getFileSize(),
                        attachment.getUploadedAt()
                ))
                .collect(Collectors.toList());
        dto.setAttachmentIds(attachmentDTOs);

        if(message.getPoll() != null)
            dto.setPoll(message.getPoll().convertToDTO());

        if(message.getVoiceMessage() != null)
        {
            VoiceMessage voiceMessage = message.getVoiceMessage();
            AudioMessageDTO voiceMessageDTO = new AudioMessageDTO();
            voiceMessageDTO.setId(voiceMessage.getId());
            voiceMessageDTO.setFileType(voiceMessage.getFileType());
            voiceMessageDTO.setAudioDataBase64(Base64.getEncoder().encodeToString(voiceMessage.getAudioData()));
            voiceMessageDTO.setFileSize(voiceMessage.getFileSize());
            voiceMessageDTO.setDurationSeconds(voiceMessage.getDurationSeconds());
            voiceMessageDTO.setWaveformData(voiceMessage.getWaveformData());
            dto.setVoiceMessage(voiceMessageDTO);
        }

        Optional<CodeSnippet> codeSnippetOpt = codeSnippetRepository.findByMessageId(message.getId());
        codeSnippetOpt.ifPresent(snippet ->
        {
            CodeSnippetDTO snippetDTO = new CodeSnippetDTO();
            snippetDTO.setId(snippet.getId());
            snippetDTO.setMessageId(snippet.getMessageId());
            snippetDTO.setLanguage(snippet.getLanguage());
            snippetDTO.setCodeContent(snippet.getCodeContent());
            dto.setCodeSnippet(snippetDTO);
        });

        if(message.getReplyToMessageId() != null)
            dto.setReplyToMessageId(message.getReplyToMessageId());

        return dto;
    }
}