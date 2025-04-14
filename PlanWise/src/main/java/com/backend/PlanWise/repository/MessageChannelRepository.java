package com.backend.PlanWise.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.backend.PlanWise.model.MessageChannel;

@Repository
public interface MessageChannelRepository extends JpaRepository<MessageChannel, Long> {
    List<MessageChannel> findByProjectId(Long projectId);
    List<MessageChannel> findByProjectIdAndChannelType(Long projectId, String channelType);
    MessageChannel findByChannelIdAndProjectId(Long channelId, Long projectId);
}