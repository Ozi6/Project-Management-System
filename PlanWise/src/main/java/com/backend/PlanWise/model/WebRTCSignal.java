package com.backend.PlanWise.model;

public class WebRTCSignal
{
    public String getFrom()
    {
        return from;
    }

    public void setFrom(String from)
    {
        this.from = from;
    }

    public String getTo()
    {
        return to;
    }

    public void setTo(String to)
    {
        this.to = to;
    }

    public Object getSignal()
    {
        return signal;
    }

    public void setSignal(Object signal)
    {
        this.signal = signal;
    }

    public String getType()
    {
        return type;
    }

    public void setType(String type)
    {
        this.type = type;
    }

    private String from;
    private String to;
    private Object signal;
    private String type;
}