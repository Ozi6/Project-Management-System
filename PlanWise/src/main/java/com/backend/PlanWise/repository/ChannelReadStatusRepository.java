package com.backend.PlanWise.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.backend.PlanWise.model.ChannelReadStatus;

@Repository
public interface ChannelReadStatusRepository extends JpaRepository<ChannelReadStatus, Long> {
    List<ChannelReadStatus> findByUserId(String userId);
    Optional<ChannelReadStatus> findByChannelIdAndUserId(Long channelId, String userId);
}