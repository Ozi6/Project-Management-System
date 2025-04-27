package com.backend.PlanWise.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "voice_messages")
public class VoiceMessage
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "message_id", nullable = false)
    private Message message;

    @Column(name = "audio_data", nullable = false)
    private byte[] audioData;

    @Column(name = "file_type", nullable = false)
    private String fileType;

    @Column(name = "file_size", nullable = false)
    private Long fileSize;

    @Column(name = "duration_seconds", nullable = false)
    private Integer durationSeconds;

    @Column(name = "waveform_data")
    private String waveformData;

    @Column(name = "uploaded_at", nullable = false)
    private LocalDateTime uploadedAt = LocalDateTime.now();

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Message getMessage() { return message; }
    public void setMessage(Message message) { this.message = message; }
    public byte[] getAudioData() { return audioData; }
    public void setAudioData(byte[] audioData) { this.audioData = audioData; }
    public String getFileType() { return fileType; }
    public void setFileType(String fileType) { this.fileType = fileType; }
    public Long getFileSize() { return fileSize; }
    public void setFileSize(Long fileSize) { this.fileSize = fileSize; }
    public Integer getDurationSeconds() { return durationSeconds; }
    public void setDurationSeconds(Integer durationSeconds) { this.durationSeconds = durationSeconds; }
    public String getWaveformData() { return waveformData; }
    public void setWaveformData(String waveformData) { this.waveformData = waveformData; }
    public LocalDateTime getUploadedAt() { return uploadedAt; }
    public void setUploadedAt(LocalDateTime uploadedAt) { this.uploadedAt = uploadedAt; }
}