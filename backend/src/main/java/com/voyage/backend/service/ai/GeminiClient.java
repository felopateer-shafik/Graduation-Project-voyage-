package com.voyage.backend.service.ai;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Component
public class GeminiClient {

    private static final Logger log = LoggerFactory.getLogger(GeminiClient.class);
    private static final String BASE_URL = "https://openrouter.ai/api/v1/chat/completions";

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${gemini.api.key:}")
    private String apiKey;

    @Value("${gemini.model:openai/gpt-3.5-turbo}")
    private String model;

    /**
     * Send a prompt to OpenRouter and return the generated text.
     * Still named GeminiClient for application compatibility.
     */
    public String generate(String systemPrompt, String userPrompt) {
        if (apiKey == null || apiKey.isBlank()) {
            log.warn("API_KEY not set — returning fallback response");
            return "AI service is not configured. Please set the API key environment variable.";
        }

        Map<String, Object> body = Map.of(
            "model", model,
            "messages", List.of(
                Map.of("role", "system", "content", systemPrompt),
                Map.of("role", "user", "content", userPrompt)
            )
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);
        headers.set("X-OpenRouter-Experimental-Metadata", "enabled");
        
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(BASE_URL, entity, Map.class);
            return extractText(response.getBody());
        } catch (Exception e) {
            log.error("AI API call failed: {}", e.getMessage());
            return "I'm having trouble connecting to the AI service right now. Please try again later.";
        }
    }

    @SuppressWarnings("unchecked")
    private String extractText(Map<?, ?> body) {
        try {
            List<Map<?, ?>> choices = (List<Map<?, ?>>) body.get("choices");
            Map<?, ?> message = (Map<?, ?>) choices.get(0).get("message");
            return (String) message.get("content");
        } catch (Exception e) {
            log.error("Failed to extract AI response text: {}", e.getMessage());
            return "I couldn't generate a response. Please try again.";
        }
    }
}
