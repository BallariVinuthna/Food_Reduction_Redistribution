package com.foodredistribution.dto;

import java.util.List;
import java.util.Map;

public class AiChatRequest {

    private String message;
    private List<Map<String, String>> history;

    public AiChatRequest() {}

    public AiChatRequest(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public List<Map<String, String>> getHistory() {
        return history;
    }

    public void setHistory(List<Map<String, String>> history) {
        this.history = history;
    }
}
