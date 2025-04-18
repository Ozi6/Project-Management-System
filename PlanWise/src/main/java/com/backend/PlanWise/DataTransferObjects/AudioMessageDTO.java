package com.backend.PlanWise.DataTransferObjects;

import com.fasterxml.jackson.annotation.JsonProperty;

public class AudioMessageDTO
{
    private String senderId;
    private Long channelId;
    private Integer projectId;
    private String content;
    @JsonProperty("audioData")
    private String audioDataBase64;
    private String fileType;
    private Long fileSize;
    private Integer durationSeconds;
    private String waveformData;

    public String getSenderId() { return senderId; }
    public void setSenderId(String senderId) { this.senderId = senderId; }
    public Long getChannelId() { return channelId; }
    public void setChannelId(Long channelId) { this.channelId = channelId; }
    public Integer getProjectId() { return projectId; }
    public void setProjectId(Integer projectId) { this.projectId = projectId; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public String getAudioDataBase64() { return audioDataBase64; }
    public void setAudioDataBase64(String audioDataBase64) { this.audioDataBase64 = audioDataBase64; }
    public String getFileType() { return fileType; }
    public void setFileType(String fileType) { this.fileType = fileType; }
    public Long getFileSize() { return fileSize; }
    public void setFileSize(Long fileSize) { this.fileSize = fileSize; }
    public Integer getDurationSeconds() { return durationSeconds; }
    public void setDurationSeconds(Integer durationSeconds) { this.durationSeconds = durationSeconds; }
    public String getWaveformData() { return waveformData; }
    public void setWaveformData(String waveformData) { this.waveformData = waveformData; }
}