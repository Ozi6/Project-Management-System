package com.backend.PlanWise.Controllers;

import com.backend.PlanWise.DataPool.MessageReactionRepository;
import com.backend.PlanWise.DataPool.UserDataPool;
import com.backend.PlanWise.DataTransferObjects.ReactionDTO;
import com.backend.PlanWise.model.MessageReaction;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import com.backend.PlanWise.DataTransferObjects.MessageDTO;
import com.backend.PlanWise.model.Message;
import com.backend.PlanWise.repository.MessageRepository;
import com.backend.PlanWise.repository.MessageChannelRepository;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

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

    @MessageMapping("/chat/{channelId}/send")
    public void sendMessage(
            @DestinationVariable Long channelId,
            @Payload MessageDTO messageDTO) {

        Message message = new Message();
        message.setProjectId(messageDTO.getProjectId());
        message.setSenderId(messageDTO.getSenderId());
        message.setContent(messageDTO.getContent());
        message.setTimestamp(LocalDateTime.now());
        message.setChannelId(channelId);

        Message savedMessage = messageRepository.save(message);

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
}