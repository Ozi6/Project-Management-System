package com.backend.PlanWise.Controllers;

import com.backend.PlanWise.DataPool.MessageReactionRepository;
import com.backend.PlanWise.DataPool.UserDataPool;
import com.backend.PlanWise.DataTransferObjects.*;
import com.backend.PlanWise.model.*;
import com.backend.PlanWise.repository.CodeSnippetRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import com.backend.PlanWise.repository.MessageRepository;
import com.backend.PlanWise.repository.MessageChannelRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Controller
public class WebSocketChatController
{
    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private MessageChannelRepository channelRepository;

    @Autowired
    private MessageReactionRepository reactionRepository;

    @Autowired
    private UserDataPool userRepository;

    @Autowired
    private CodeSnippetRepository codeSnippetRepository;

    @MessageMapping("/chat/{channelId}/send")
    public void sendMessage(
            @DestinationVariable Long channelId,
            @Payload MessageDTO messageDTO)
    {
        Message message = new Message();
        message.setProjectId(messageDTO.getProjectId());
        message.setSenderId(messageDTO.getSenderId());
        message.setContent(messageDTO.getContent());
        message.setTimestamp(LocalDateTime.now());
        message.setChannelId(channelId);

        if(messageDTO.getReplyToMessageId() != null)
        {
            Optional<Message> replyToMessage = messageRepository.findById(messageDTO.getReplyToMessageId());
            if(replyToMessage.isPresent() && replyToMessage.get().getChannelId().equals(channelId))
                message.setReplyToMessageId(messageDTO.getReplyToMessageId());
        }

        if(messageDTO.getAttachmentIds() != null && !messageDTO.getAttachmentIds().isEmpty())
        {
            for(AttachmentDTO attachmentDTO : messageDTO.getAttachmentIds())
            {
                MessageAttachment attachment = new MessageAttachment();
                attachment.setFileName(attachmentDTO.getFileName());
                attachment.setFileType(FileType.valueOf(attachmentDTO.getFileType()));
                attachment.setFileSize(attachmentDTO.getFileSize());
                attachment.setFileData(attachmentDTO.getFileData());
                attachment.setUploadedAt(attachmentDTO.getUploadedAt());
                message.addAttachment(attachment);
            }
        }

        if(messageDTO.getPoll() != null)
        {
            Poll poll = new Poll();
            poll.setQuestion(messageDTO.getPoll().getQuestion());
            poll.setMultipleChoice(messageDTO.getPoll().isMultipleChoice());
            poll.setExpiresAt(messageDTO.getPoll().getExpiresAt());

            List<PollOption> options = new ArrayList<>();
            for(PollOptionDTO optionDTO : messageDTO.getPoll().getOptions())
            {
                PollOption option = new PollOption();
                option.setOptionText(optionDTO.getOptionText());
                option.setPoll(poll);
                options.add(option);
            }
            poll.setOptions(options);

            poll.setMessage(message);
            message.setPoll(poll);
        }

        Message savedMessage = messageRepository.save(message);

        if (messageDTO.getCodeSnippet() != null)
        {
            CodeSnippet codeSnippet = new CodeSnippet();
            codeSnippet.setMessageId(savedMessage.getId());
            codeSnippet.setLanguage(messageDTO.getCodeSnippet().getLanguage());
            codeSnippet.setCodeContent(messageDTO.getCodeSnippet().getCodeContent());
            codeSnippetRepository.save(codeSnippet);
        }

        MessageDTO savedMessageDTO = convertToDTO(savedMessage);
        messagingTemplate.convertAndSend("/topic/channel/" + channelId, savedMessageDTO);

        messagingTemplate.convertAndSend(
                "/topic/project/" + messageDTO.getProjectId() + "/channels",
                new ChannelUpdate(channelId, savedMessage.getContent(), savedMessage.getTimestamp(), savedMessage.getSenderId())
        );
    }

    @MessageMapping("/chat/{channelId}/edit")
    public void editMessage(
            @DestinationVariable Long channelId,
            @Payload MessageDTO messageDTO)
    {

        Optional<Message> messageOpt = messageRepository.findById(messageDTO.getId());
        if (!messageOpt.isPresent())
            return;

        Message message = messageOpt.get();

        if (!message.getChannelId().equals(channelId))
            return;

        if(!message.getSenderId().equals(messageDTO.getSenderId()))
            return;

        message.setContent(messageDTO.getContent());
        message.setEditedAt(LocalDateTime.now());
        message.setEdited(true);

        Message updatedMessage = messageRepository.save(message);
        MessageDTO updatedMessageDTO = convertToDTO(updatedMessage);

        messagingTemplate.convertAndSend("/topic/channel/" + channelId + "/edit", updatedMessageDTO);
    }

    @MessageMapping("/chat/{channelId}/delete")
    public void deleteMessage(
            @DestinationVariable Long channelId,
            @Payload MessageDTO messageDTO)
    {
        Optional<Message> messageOpt = messageRepository.findById(messageDTO.getId());
        if (!messageOpt.isPresent())
            return;
        Message message = messageOpt.get();

        if(!message.getChannelId().equals(channelId))
            return;
        if(!message.getSenderId().equals(messageDTO.getSenderId()))
            return;

        messageRepository.delete(message);
        MessageDTO deleteDTO = new MessageDTO();
        deleteDTO.setId(message.getId());
        deleteDTO.setChannelId(channelId);
        deleteDTO.setSenderId(message.getSenderId());
        messagingTemplate.convertAndSend("/topic/channel/" + channelId + "/delete", deleteDTO);
    }

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

        if (message.getVoiceMessage() != null)
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

    private Object createChannelUpdate(Long channelIdd, Message lastMessage)
    {
        return new Object()
        {
            public Long channelId = channelIdd;
            public String lastMessageContent = lastMessage.getContent();
            public LocalDateTime lastMessageTimestamp = lastMessage.getTimestamp();
            public String lastMessageSender = lastMessage.getSenderId();
        };
    }

    @MessageMapping("/chat/{channelId}/reaction/add")
    public void addReaction(
            @DestinationVariable Long channelId,
            @Payload ReactionDTO reactionDTO)
    {
        if(!channelRepository.existsById(channelId))
            return;
        Optional<Message> messageOpt = messageRepository.findById(reactionDTO.getMessageId());
        if(!messageOpt.isPresent())
            return;
        if(!userRepository.existsById(reactionDTO.getUserId()))
            return;
        Optional<MessageReaction> existingReaction = reactionRepository.findByMessageIdAndUserIdAndReactionType(
                reactionDTO.getMessageId(), reactionDTO.getUserId(), reactionDTO.getReactionType());
        if(existingReaction.isPresent())
            return;
        MessageReaction reaction = new MessageReaction();
        reaction.setMessageId(reactionDTO.getMessageId());
        reaction.setUserId(reactionDTO.getUserId());
        reaction.setReactionType(reactionDTO.getReactionType());
        reaction.setCreatedAt(LocalDateTime.now());
        reactionRepository.save(reaction);
        Message updatedMessage = messageOpt.get();
        MessageDTO updatedMessageDTO = convertToDTO(updatedMessage);
        messagingTemplate.convertAndSend("/topic/channel/" + channelId + "/reaction", updatedMessageDTO);
    }

    @MessageMapping("/chat/{channelId}/reaction/remove")
    @Transactional
    public void removeReaction(
            @DestinationVariable Long channelId,
            @Payload ReactionDTO reactionDTO)
    {
        if(!channelRepository.existsById(channelId))
            return;
        Optional<Message> messageOpt = messageRepository.findById(reactionDTO.getMessageId());
        if(!messageOpt.isPresent())
            return;
        if(!userRepository.existsById(reactionDTO.getUserId()))
            return;
        Optional<MessageReaction> existingReaction = reactionRepository.findByMessageIdAndUserIdAndReactionType(
                reactionDTO.getMessageId(), reactionDTO.getUserId(), reactionDTO.getReactionType());
        if(!existingReaction.isPresent())
            return;
        reactionRepository.deleteByMessageIdAndUserIdAndReactionType(
                reactionDTO.getMessageId(), reactionDTO.getUserId(), reactionDTO.getReactionType());
        Message updatedMessage = messageOpt.get();
        MessageDTO updatedMessageDTO = convertToDTO(updatedMessage);
        messagingTemplate.convertAndSend("/topic/channel/" + channelId + "/reaction", updatedMessageDTO);
    }

    private static class ChannelUpdate
    {
        public Long channelId;
        public String lastMessageContent;
        public LocalDateTime lastMessageTimestamp;
        public String lastMessageSender;

        public ChannelUpdate(Long channelId, String content, LocalDateTime timestamp, String senderId)
        {
            this.channelId = channelId;
            this.lastMessageContent = content;
            this.lastMessageTimestamp = timestamp;
            this.lastMessageSender = senderId;
        }
    }

    @GetMapping("/api/messages/channel/{channelId}/userreactions/{userId}")
    public ResponseEntity<List<MessageReaction>> getUserReactionsInChannel(
            @PathVariable Long channelId,
            @PathVariable String userId)
    {
        List<MessageReaction> reactions = reactionRepository.findByUserIdAndChannelId(userId, channelId);
        return ResponseEntity.ok(reactions);
    }

    @MessageMapping("/chat/{channelId}/codesnippet")
    public void updateCodeSnippet(@DestinationVariable Long channelId, @Payload CodeSnippetDTO codeSnippetDTO)
    {
        Optional<Message> messageOpt = messageRepository.findById(codeSnippetDTO.getMessageId());
        if(!messageOpt.isPresent() || !messageOpt.get().getChannelId().equals(channelId))
            return;

        Optional<CodeSnippet> existingSnippet = codeSnippetRepository.findByMessageId(codeSnippetDTO.getMessageId());
        CodeSnippet codeSnippet;

        if(existingSnippet.isPresent())
            codeSnippet = existingSnippet.get();
        else
        {
            codeSnippet = new CodeSnippet();
            codeSnippet.setMessageId(codeSnippetDTO.getMessageId());
        }
        codeSnippet.setLanguage(codeSnippetDTO.getLanguage());
        codeSnippet.setCodeContent(codeSnippetDTO.getCodeContent());

        codeSnippetRepository.save(codeSnippet);

        Message updatedMessage = messageOpt.get();
        MessageDTO updatedMessageDTO = convertToDTO(updatedMessage);
        messagingTemplate.convertAndSend("/topic/channel/" + channelId + "/codesnippet", updatedMessageDTO);
    }
}