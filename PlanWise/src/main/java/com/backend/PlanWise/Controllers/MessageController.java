package com.backend.PlanWise.Controllers;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.backend.PlanWise.DataPool.ProjectDataPool;
import com.backend.PlanWise.DataPool.TeamDataPool;
import com.backend.PlanWise.DataPool.UserDataPool;
import com.backend.PlanWise.DataTransferObjects.MessageChannelDTO;
import com.backend.PlanWise.DataTransferObjects.MessageDTO;
import com.backend.PlanWise.model.ChannelReadStatus;
import com.backend.PlanWise.model.Message;
import com.backend.PlanWise.model.MessageChannel;
import com.backend.PlanWise.model.Project;
import com.backend.PlanWise.model.Team;
import com.backend.PlanWise.model.User;
import com.backend.PlanWise.repository.ChannelReadStatusRepository;
import com.backend.PlanWise.repository.MessageChannelRepository;
import com.backend.PlanWise.repository.MessageRepository;

@RestController
@RequestMapping("/api/messages")
public class MessageController {
    
    @Autowired
    private MessageRepository messageRepository;
    
    @Autowired
    private MessageChannelRepository channelRepository;
    
    @Autowired
    private ChannelReadStatusRepository readStatusRepository;
    
    @Autowired
    private UserDataPool userRepository;
    
    @Autowired
    private ProjectDataPool projectRepository;
    
    // Get all channels for a project
    @GetMapping("/channels/project/{projectId}")
    public ResponseEntity<List<MessageChannelDTO>> getProjectChannels(@PathVariable Long projectId) {
        List<MessageChannel> channels = channelRepository.findByProjectId(projectId);
        
        List<MessageChannelDTO> channelDTOs = channels.stream()
            .map(this::convertChannelToDTO)
            .collect(Collectors.toList());
            
        return ResponseEntity.ok(channelDTOs);
    }
    
    // Create a new channel
    @PostMapping("/channels")
    public ResponseEntity<MessageChannelDTO> createChannel(@RequestBody MessageChannelDTO channelDTO) {
        // Verify project exists
        Optional<Project> projectOpt = projectRepository.findById(channelDTO.getProjectId());
        if (!projectOpt.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        
        MessageChannel channel = new MessageChannel();
        channel.setChannelName(channelDTO.getChannelName());
        channel.setChannelType(channelDTO.getChannelType());
        channel.setProjectId(channelDTO.getProjectId());
        channel.setTeamId(channelDTO.getTeamId());
        channel.setCreatedAt(LocalDateTime.now());
        
        MessageChannel savedChannel = channelRepository.save(channel);
        
        return ResponseEntity.status(HttpStatus.CREATED).body(convertChannelToDTO(savedChannel));
    }
    
    /**
     * Creates a channel and initializes read status for the creator
     */
    @PostMapping("/channels/init")
    public ResponseEntity<MessageChannelDTO> createChannelWithInitialReadStatus(
            @RequestBody MessageChannelDTO channelDTO,
            @RequestParam("creatorId") String creatorId) {
        
        // First create the channel
        ResponseEntity<MessageChannelDTO> channelResponse = createChannel(channelDTO);
        
        if (channelResponse.getStatusCode() == HttpStatus.CREATED) {
            // Now set up initial read status for the creator
            MessageChannelDTO savedChannel = channelResponse.getBody();
            updateReadStatus(savedChannel.getChannelId(), creatorId, LocalDateTime.now());
        }
        
        return channelResponse;
    }
    
    // Get all messages for a channel
    @GetMapping("/channel/{channelId}")
    public ResponseEntity<List<MessageDTO>> getChannelMessages(@PathVariable Long channelId) {
        // Get all messages for the channel
        List<Message> messages = messageRepository.findByChannelIdOrderByTimestampAsc(channelId);
        
        List<MessageDTO> messageDTOs = messages.stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
            
        return ResponseEntity.ok(messageDTOs);
    }
    
    // Send a new message to a channel
    @PostMapping("/channel/{channelId}")
    public ResponseEntity<MessageDTO> sendChannelMessage(
            @PathVariable Long channelId,
            @RequestBody MessageDTO messageDTO) {
        
        // Verify channel exists
        Optional<MessageChannel> channelOpt = channelRepository.findById(channelId);
        if (!channelOpt.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        
        // Verify sender exists
        Optional<User> senderOpt = userRepository.findById(String.valueOf(messageDTO.getSenderId()));
        if (!senderOpt.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        
        // Create and save the message
        Message message = new Message();
        message.setProjectId(channelOpt.get().getProjectId().intValue());
        message.setSenderId(String.valueOf(messageDTO.getSenderId()));
        message.setContent(messageDTO.getContent());
        message.setTimestamp(LocalDateTime.now());
        message.setChannelId(channelId);
        
        Message savedMessage = messageRepository.save(message);
        
        // Update read status for sender
        updateReadStatus(channelId, messageDTO.getSenderId(), LocalDateTime.now());
        
        return ResponseEntity.status(HttpStatus.CREATED).body(convertToDTO(savedMessage));
    }
    
    // Update read status for a user in a channel
    @PostMapping("/channel/{channelId}/read")
    public ResponseEntity<Void> markChannelAsRead(
            @PathVariable Long channelId,
            @RequestBody String userId) {
        
        try {
            // Clean the userId (it might contain quotes from JSON)
            String cleanUserId = userId;
            if (userId.startsWith("\"") && userId.endsWith("\"")) {
                cleanUserId = userId.substring(1, userId.length() - 1);
            }
            cleanUserId = cleanUserId.trim();
            
            // Verify user exists first
            Optional<User> userOpt = userRepository.findById(cleanUserId);
            if (!userOpt.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .header("X-Error-Reason", "User not found")
                    .build();
            }
            
            // Verify channel exists
            Optional<MessageChannel> channelOpt = channelRepository.findById(channelId);
            if (!channelOpt.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .header("X-Error-Reason", "Channel not found")
                    .build();
            }
            
            // Now update read status
            updateReadStatus(channelId, cleanUserId, LocalDateTime.now());
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .header("X-Error-Reason", e.getMessage())
                .build();
        }
    }
    
    // Get unread count for a user in a channel
    @GetMapping("/channel/{channelId}/unread/{userId}")
    public ResponseEntity<Integer> getUnreadCount(
            @PathVariable Long channelId,
            @PathVariable String userId) {
        
        Optional<ChannelReadStatus> statusOpt = readStatusRepository.findByChannelIdAndUserId(channelId, userId);
        
        if (!statusOpt.isPresent()) {
            // If no read status, count all messages
            List<Message> messages = messageRepository.findByChannelIdOrderByTimestampAsc(channelId);
            return ResponseEntity.ok(messages.size());
        } else {
            // Count messages newer than last read timestamp
            LocalDateTime lastRead = statusOpt.get().getLastReadTimestamp();
            List<Message> messages = messageRepository.findByChannelIdAndTimestampAfterOrderByTimestampAsc(
                    channelId, lastRead);
            return ResponseEntity.ok(messages.size());
        }
    }
    
    // Keep the original project messages endpoint for backward compatibility
    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<MessageDTO>> getProjectMessages(@PathVariable Long projectId) {
        List<Message> messages = messageRepository.findByProjectIdOrderByTimestampAsc(projectId);
        
        List<MessageDTO> messageDTOs = messages.stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
            
        return ResponseEntity.ok(messageDTOs);
    }
    
    // Update the existing send message endpoint to include channel ID
    @PostMapping
    public ResponseEntity<MessageDTO> sendMessage(@RequestBody MessageDTO messageDTO) {
        // If channelId is provided, use the channel-specific endpoint
        if (messageDTO.getChannelId() != null) {
            return sendChannelMessage(messageDTO.getChannelId(), messageDTO);
        }
        
        // Original implementation for backward compatibility
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
        
        // Try to find a default channel, or use null
        List<MessageChannel> projectChannels = channelRepository.findByProjectIdAndChannelType(
                messageDTO.getProjectId().longValue(), "PROJECT");
        if (!projectChannels.isEmpty()) {
            message.setChannelId(projectChannels.get(0).getChannelId());
        }
        
        Message savedMessage = messageRepository.save(message);
        
        return ResponseEntity.status(HttpStatus.CREATED).body(convertToDTO(savedMessage));
    }
    
    // Helper method to update read status
    @Transactional
    public void updateReadStatus(Long channelId, String userId, LocalDateTime timestamp) {
        try {
            // Verify both user and channel actually exist
            boolean userExists = userRepository.existsById(userId);
            boolean channelExists = channelRepository.existsById(channelId);
            
            if (!userExists || !channelExists) {
                System.err.println("Cannot update read status - user or channel doesn't exist. " +
                                  "User exists: " + userExists + ", Channel exists: " + channelExists);
                return; // Skip instead of throwing exception
            }
        
            Optional<ChannelReadStatus> statusOpt = readStatusRepository.findByChannelIdAndUserId(channelId, userId);
            
            if (statusOpt.isPresent()) {
                ChannelReadStatus status = statusOpt.get();
                status.setLastReadTimestamp(timestamp);
                readStatusRepository.save(status);
            } else {
                ChannelReadStatus status = new ChannelReadStatus();
                status.setChannelId(channelId);
                status.setUserId(userId);
                status.setLastReadTimestamp(timestamp);
                readStatusRepository.save(status);
            }
        } catch (Exception e) {
            System.err.println("Error updating read status: " + e.getMessage());
            e.printStackTrace();
        }
    }
    
    /**
     * Initialize read status for all project members for a specific channel
     */
    @Transactional
    public void initializeReadStatusForChannel(Long channelId, Long projectId) {
        try {
            // Find the project
            Optional<Project> projectOpt = projectRepository.findById(projectId);
            if (!projectOpt.isPresent()) {
                System.err.println("Project not found when initializing read status");
                return;
            }
            
            Project project = projectOpt.get();
            LocalDateTime now = LocalDateTime.now();
            
            // Initialize for all project members
            for (User member : project.getMembers()) {
                if (member != null) {
                    try {
                        // Only create read status if it doesn't exist
                        Optional<ChannelReadStatus> statusOpt = readStatusRepository.findByChannelIdAndUserId(
                                channelId, member.getUserId());
                        
                        if (!statusOpt.isPresent()) {
                            ChannelReadStatus status = new ChannelReadStatus();
                            status.setChannelId(channelId);
                            status.setUserId(member.getUserId());
                            status.setLastReadTimestamp(now);
                            readStatusRepository.save(status);
                        }
                    } catch (Exception e) {
                        System.err.println("Could not initialize read status for member " + 
                            member.getUserId() + ": " + e.getMessage());
                    }
                }
            }
        } catch (Exception e) {
            System.err.println("Error initializing read status: " + e.getMessage());
        }
    }
    
    @Autowired
    private TeamDataPool teamDataPool; // Assuming you have a similar data pool for teams
    /**
     * Initialize read status for team channel when a new member is added
     */
    @Transactional
    public void initializeTeamChannelReadStatus(Long channelId, Long teamId) {
        // Find the team
        Optional<Team> teamOpt = teamDataPool.findById(teamId);
        if (!teamOpt.isPresent()) {
            System.err.println("Team not found when initializing read status");
            return;
        }
        
        Team team = teamOpt.get();
        LocalDateTime now = LocalDateTime.now();
        
        // Initialize for all team members
        for (User member : team.getMembers()) {
            if (member != null) {
                updateReadStatus(channelId, member.getUserId(), now);
            }
        }
    }
    
    /**
     * Get all channels for a specific team
     */
    @GetMapping("/channels/team/{teamId}")
    public ResponseEntity<List<MessageChannelDTO>> getTeamChannels(@PathVariable Long teamId) {
        List<MessageChannel> channels = channelRepository.findByTeamId(teamId);
        
        List<MessageChannelDTO> channelDTOs = channels.stream()
            .map(this::convertChannelToDTO)
            .collect(Collectors.toList());
            
        return ResponseEntity.ok(channelDTOs);
    }

    /**
     * Create a new team channel
     */
    @PostMapping("/channels/team")
    public ResponseEntity<MessageChannelDTO> createTeamChannel(@RequestBody MessageChannelDTO channelDTO) {
        // Verify team exists
        if (channelDTO.getTeamId() == null) {
            return ResponseEntity.badRequest().build();
        }
        
        // Verify project exists
        Optional<Project> projectOpt = projectRepository.findById(channelDTO.getProjectId());
        if (!projectOpt.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        
        // Create channel
        MessageChannel channel = new MessageChannel();
        channel.setChannelName(channelDTO.getChannelName());
        channel.setChannelType("TEAM"); // Force team type
        channel.setProjectId(channelDTO.getProjectId());
        channel.setTeamId(channelDTO.getTeamId());
        channel.setCreatedAt(LocalDateTime.now());
        
        MessageChannel savedChannel = channelRepository.save(channel);
        
        // Initialize read status for all team members
        initializeTeamChannelReadStatus(savedChannel.getChannelId(), savedChannel.getTeamId());
        
        return ResponseEntity.status(HttpStatus.CREATED).body(convertChannelToDTO(savedChannel));
    }

    /**
     * Get if user can access channel (is member of team for team channels)
     */
    @GetMapping("/channel/{channelId}/access/{userId}")
    public ResponseEntity<Boolean> canAccessChannel(
            @PathVariable Long channelId,
            @PathVariable String userId) {
        
        Optional<MessageChannel> channelOpt = channelRepository.findById(channelId);
        if (!channelOpt.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        
        MessageChannel channel = channelOpt.get();
        
        // If it's a project channel, check if user is project member
        if ("PROJECT".equals(channel.getChannelType())) {
            Optional<Project> projectOpt = projectRepository.findById(channel.getProjectId());
            if (!projectOpt.isPresent()) {
                return ResponseEntity.ok(false);
            }
            
            Project project = projectOpt.get();
            boolean isMember = project.getMembers().stream()
                    .anyMatch(member -> member.getUserId().equals(userId));
                    
            return ResponseEntity.ok(isMember);
        } 
        // If it's a team channel, check if user is team member
        else if ("TEAM".equals(channel.getChannelType()) && channel.getTeamId() != null) {
            Optional<Team> teamOpt = teamDataPool.findById(channel.getTeamId());
            if (!teamOpt.isPresent()) {
                return ResponseEntity.ok(false);
            }
            
            Team team = teamOpt.get();
            boolean isTeamMember = team.getMembers().stream()
                    .anyMatch(member -> member.getUserId().equals(userId));
                    
            return ResponseEntity.ok(isTeamMember);
        }
        
        return ResponseEntity.ok(false);
    }
    
    // Convert MessageChannel entity to DTO
    private MessageChannelDTO convertChannelToDTO(MessageChannel channel) {
        MessageChannelDTO dto = new MessageChannelDTO();
        dto.setChannelId(channel.getChannelId());
        dto.setChannelName(channel.getChannelName());
        dto.setChannelType(channel.getChannelType());
        dto.setProjectId(channel.getProjectId());
        dto.setTeamId(channel.getTeamId());
        dto.setCreatedAt(channel.getCreatedAt());
        
        // Get the latest message for preview
        List<Message> messages = messageRepository.findByChannelIdOrderByTimestampDesc(
                channel.getChannelId(), PageRequest.of(0, 1));
        if (!messages.isEmpty()) {
            Message latestMessage = messages.get(0);
            dto.setLastMessageContent(latestMessage.getContent());
            
            // Get sender name
            Optional<User> userOpt = userRepository.findById(latestMessage.getSenderId());
            if (userOpt.isPresent()) {
                dto.setLastMessageSender(userOpt.get().getUsername());
            }
        }
        
        return dto;
    }
    
    // Convert Message entity to MessageDTO
    private MessageDTO convertToDTO(Message message) {
        MessageDTO dto = new MessageDTO();
        dto.setId(message.getId());
        dto.setProjectId(message.getProjectId());
        dto.setSenderId(message.getSenderId());
        dto.setContent(message.getContent());
        dto.setTimestamp(message.getTimestamp());
        dto.setChannelId(message.getChannelId());
        
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