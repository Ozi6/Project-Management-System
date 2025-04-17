package com.backend.PlanWise.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.backend.PlanWise.model.MessageChannel;

@Repository
public interface MessageChannelRepository extends JpaRepository<MessageChannel, Long>
{
    List<MessageChannel> findByProjectId(Long projectId);
    List<MessageChannel> findByProjectIdAndChannelType(Long projectId, String channelType);
    MessageChannel findByChannelIdAndProjectId(Long channelId, Long projectId);
    List<MessageChannel> findByProjectIdAndTeamId(Long projectId, Long teamId);
    List<MessageChannel> findByTeamId(Long teamId);
    @Query("SELECT mc.projectId FROM MessageChannel mc WHERE mc.channelId = :channelId")
    Long findProjectIdByChannelId(@Param("channelId") Long channelId);
}