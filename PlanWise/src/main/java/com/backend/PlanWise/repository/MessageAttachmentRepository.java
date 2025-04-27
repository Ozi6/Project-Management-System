package com.backend.PlanWise.repository;

import com.backend.PlanWise.model.MessageAttachment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MessageAttachmentRepository extends JpaRepository<MessageAttachment, Long>
{
    Optional<MessageAttachment> findByMessageId(Long messageId);
}