package com.backend.PlanWise.Controllers;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.backend.PlanWise.DataPool.ProjectDataPool;
import com.backend.PlanWise.DataPool.UserDataPool;
import com.backend.PlanWise.DataTransferObjects.MessageDTO;
import com.backend.PlanWise.model.Message;
import com.backend.PlanWise.model.Project;
import com.backend.PlanWise.model.User;
import com.backend.PlanWise.repository.MessageRepository;

@RestController
@RequestMapping("/api/messages")
public class MessageController {
    
    @Autowired
    private MessageRepository messageRepository;
    
    @Autowired
    private UserDataPool userRepository;
    
    @Autowired
    private ProjectDataPool projectRepository;
    
    // Get all messages for a project
    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<MessageDTO>> getProjectMessages(@PathVariable Long projectId) {
        List<Message> messages = messageRepository.findByProjectIdOrderByTimestampAsc(projectId);
        
        List<MessageDTO> messageDTOs = messages.stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
            
        return ResponseEntity.ok(messageDTOs);
    }
    
    // Send a new message
    @PostMapping
    public ResponseEntity<MessageDTO> sendMessage(@RequestBody MessageDTO messageDTO) {
        // Verify project exists
        Optional<Project> projectOpt = projectRepository.findById(messageDTO.getProjectId().longValue());
        if (!projectOpt.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        
        // Verify sender exists
        Optional<User> senderOpt = userRepository.findById(String.valueOf(messageDTO.getSenderId()));
        if (!senderOpt.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        
        // Create and save the message
        Message message = new Message();
        message.setProjectId(messageDTO.getProjectId().intValue());
        message.setSenderId(String.valueOf(messageDTO.getSenderId()));
        message.setContent(messageDTO.getContent());
        message.setTimestamp(LocalDateTime.now());
        
        Message savedMessage = messageRepository.save(message);
        
        return ResponseEntity.status(HttpStatus.CREATED).body(convertToDTO(savedMessage));
    }
    
    // Convert Message entity to MessageDTO
    private MessageDTO convertToDTO(Message message) {
        MessageDTO dto = new MessageDTO();
        dto.setId(message.getId());
        dto.setProjectId(message.getProjectId());
        dto.setSenderId(message.getSenderId());
        dto.setContent(message.getContent());
        dto.setTimestamp(message.getTimestamp());
        
        // Add sender details if available
        if (message.getSender() != null) {
            dto.setSenderName(message.getSender().getUsername());
            dto.setSenderAvatar(message.getSender().getProfileImageUrl());
        } else {
            // Try to fetch sender
            Optional<User> userOpt = userRepository.findById(String.valueOf(message.getSenderId()));
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                dto.setSenderName(user.getUsername());
                dto.setSenderAvatar(user.getProfileImageUrl());
            }
        }
        
        return dto;
    }
}