package com.backend.PlanWise.model;

public enum FileType
{
    IMAGE("image"),
    DOCUMENT("application"),
    AUDIO("audio"),
    VIDEO("video"),
    CODE("text"),
    OTHER("application");

    private final String mimeTypePrefix;

    FileType(String mimeTypePrefix)
    {
        this.mimeTypePrefix = mimeTypePrefix;
    }

    public String getMimeTypePrefix()
    {
        return mimeTypePrefix;
    }

    public static FileType fromMimeType(String mimeType)
    {
        if(mimeType == null)
            return OTHER;
        String[] parts = mimeType.split("/");
        if(parts.length < 1)
            return OTHER;

        switch(parts[0])
        {
            case "image": return IMAGE;
            case "audio": return AUDIO;
            case "video": return VIDEO;
            case "text": return CODE;
            case "application": return DOCUMENT;
            default: return OTHER;
        }
    }
}
