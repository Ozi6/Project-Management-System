package com.backend.PlanWise.model;

import com.backend.PlanWise.DataTransferObjects.AudioChunkDTO;

public class AudioChunk
{
    private final int index;
    private final String data;
    private final AudioChunkDTO dto;

    public AudioChunk(int index, String data, AudioChunkDTO dto)
    {
        this.index = index;
        this.data = data;
        this.dto = dto;
    }

    public int getIndex() { return index; }
    public String getData() { return data; }
    public AudioChunkDTO getDto() { return dto; }
}