package com.backend.PlanWise.Controllers;

import com.backend.PlanWise.DataPool.UserDataPool;
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
import java.security.Principal;
import java.time.LocalDateTime;
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

        messagingTemplate.convertAndSend("/topic/channel/" + channelId, messageDTO);

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