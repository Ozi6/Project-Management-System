package com.backend.PlanWise.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.backend.PlanWise.model.Message;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long>
{
    List<Message> findByProjectIdOrderByTimestampAsc(Long projectId);
    List<Message> findByProjectIdAndTimestampAfterOrderByTimestampAsc(Long projectId, LocalDateTime timestamp);

    @Query("SELECT m FROM Message m LEFT JOIN FETCH m.voiceMessage WHERE m.channelId = :channelId ORDER BY m.timestamp ASC")
    List<Message> findByChannelIdOrderByTimestampAsc(@Param("channelId") Long channelId);
    List<Message> findByChannelIdOrderByTimestampDesc(Long channelId, Pageable pageable);
    List<Message> findByChannelIdAndTimestampAfterOrderByTimestampAsc(Long channelId, LocalDateTime timestamp);

    @Query("SELECT m, " +
            "(SELECT GROUP_CONCAT(DISTINCT CONCAT(r.reactionType, ':', COUNT(r))) " +
            "FROM MessageReaction r WHERE r.messageId = m.id) as reactions " +
            "FROM Message m WHERE m.channelId = :channelId ORDER BY m.timestamp ASC")
    List<Object[]> findByChannelIdWithReactions(Long channelId);

    Message findBySenderIdAndChannelIdAndProjectIdAndContentAndTimestamp(
            String senderId,
            Long channelId,
            Integer projectId,
            String content,
            LocalDateTime timestamp
    );
}