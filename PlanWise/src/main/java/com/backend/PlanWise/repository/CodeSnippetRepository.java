package com.backend.PlanWise.repository;

import com.backend.PlanWise.model.CodeSnippet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CodeSnippetRepository extends JpaRepository<CodeSnippet, Long>
{
    Optional<CodeSnippet> findByMessageId(Long messageId);
    List<CodeSnippet> findByMessageIdIn(List<Long> messageIds);
}