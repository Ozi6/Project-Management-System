package com.backend.PlanWise.DataPool;

import com.backend.PlanWise.model.MessageReaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MessageReactionRepository extends JpaRepository<MessageReaction, Long>
{
    Optional<MessageReaction> findByMessageIdAndUserIdAndReactionType(Long messageId, String userId, String reactionType);
    @Query("SELECT r.reactionType, COUNT(r) FROM MessageReaction r WHERE r.messageId = :messageId GROUP BY r.reactionType")
    List<Object[]> countReactionsByMessageId(Long messageId);
    void deleteByMessageIdAndUserIdAndReactionType(Long messageId, String userId, String reactionType);
    @Query("SELECT r.messageId, r.reactionType, COUNT(r) FROM MessageReaction r WHERE r.messageId IN :messageIds GROUP BY r.messageId, r.reactionType")
    List<Object[]> countReactionsByMessageIds(List<Long> messageIds);
}
