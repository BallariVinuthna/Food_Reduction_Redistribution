package com.foodredistribution.dto;

import java.time.LocalDateTime;
import java.util.List;

public class AiChatResponse {

    private String reply;
    private String source;
    private List<String> suggestedFollowUps;
    private LocalDateTime timestamp = LocalDateTime.now();

    public AiChatResponse() {}

    public AiChatResponse(String reply, String source, List<String> suggestedFollowUps) {
        this.reply = reply;
        this.source = source;
        this.suggestedFollowUps = suggestedFollowUps;
    }

    public String getReply() {
        return reply;
    }

    public void setReply(String reply) {
        this.reply = reply;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public List<String> getSuggestedFollowUps() {
        return suggestedFollowUps;
    }

    public void setSuggestedFollowUps(List<String> suggestedFollowUps) {
        this.suggestedFollowUps = suggestedFollowUps;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}
