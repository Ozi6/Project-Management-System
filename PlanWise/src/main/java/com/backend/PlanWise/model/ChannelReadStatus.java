package com.backend.PlanWise.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "channel_read_status")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChannelReadStatus {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "channel_id", nullable = false)
    private Long channelId;
    
    @Column(name = "user_id", nullable = false)
    private String userId;
    
    @Column(name = "last_read_timestamp", nullable = false)
    private LocalDateTime lastReadTimestamp;
    
    @ManyToOne
    @JoinColumn(name = "channel_id", referencedColumnName = "channel_id", insertable = false, updatable = false)
    private MessageChannel channel;
    
    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "user_id", insertable = false, updatable = false)
    private User user;
}