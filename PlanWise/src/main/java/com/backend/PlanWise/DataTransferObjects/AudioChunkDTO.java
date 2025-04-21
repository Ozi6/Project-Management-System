package com.backend.PlanWise.DataTransferObjects;

import com.fasterxml.jackson.annotation.JsonProperty;

public class AudioChunkDTO
{
    private String senderId;
    private Long channelId;
    private Integer projectId;
    private String content;
    @JsonProperty("audioDataChunk")
    private String audioDataChunk;
    private String fileType;
    private Long fileSize;
    private Integer durationSeconds;
    private String waveformData;
    private String messageId;
    private Integer chunkIndex;
    private Integer totalChunks;

    public String getSenderId() { return senderId; }
    public void setSenderId(String senderId) { this.senderId = senderId; }
    public Long getChannelId() { return channelId; }
    public void setChannelId(Long channelId) { this.channelId = channelId; }
    public Integer getProjectId() { return projectId; }
    public void setProjectId(Integer projectId) { this.projectId = projectId; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public String getAudioDataChunk() { return audioDataChunk; }
    public void setAudioDataChunk(String audioDataChunk) { this.audioDataChunk = audioDataChunk; }
    public String getFileType() { return fileType; }
    public void setFileType(String fileType) { this.fileType = fileType; }
    public Long getFileSize() { return fileSize; }
    public void setFileSize(Long fileSize) { this.fileSize = fileSize; }
    public Integer getDurationSeconds() { return durationSeconds; }
    public void setDurationSeconds(Integer durationSeconds) { this.durationSeconds = durationSeconds; }
    public String getWaveformData() { return waveformData; }
    public void setWaveformData(String waveformData) { this.waveformData = waveformData; }
    public String getMessageId() { return messageId; }
    public void setMessageId(String messageId) { this.messageId = messageId; }
    public Integer getChunkIndex() { return chunkIndex; }
    public void setChunkIndex(Integer chunkIndex) { this.chunkIndex = chunkIndex; }
    public Integer getTotalChunks() { return totalChunks; }
    public void setTotalChunks(Integer totalChunks) { this.totalChunks = totalChunks; }
}