package com.backend.PlanWise.repository;

import com.backend.PlanWise.model.VoiceMessage;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VoiceMessageRepository extends JpaRepository<VoiceMessage, Long>
{

}