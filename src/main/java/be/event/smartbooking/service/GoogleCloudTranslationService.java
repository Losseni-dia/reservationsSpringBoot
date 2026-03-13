package be.event.smartbooking.service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

/**
 * Reusable utility for live translation using the Google Cloud Translation REST API (v2).
 * Uses an API key loaded from the environment (e.g. GOOGLE_TRANSLATION_API_KEY in .env).
 */
@Service
public class GoogleCloudTranslationService {

    private static final Logger log = LoggerFactory.getLogger(GoogleCloudTranslationService.class);

    private final String apiKey;
    private final String apiUrl;
    private final RestTemplate restTemplate;

    public GoogleCloudTranslationService(
            @Value("${google.cloud.translation.api-key:}") String apiKey,
            @Value("${google.cloud.translation.api-url:https://translation.googleapis.com/language/translate/v2}") String apiUrl,
            RestTemplate restTemplate) {
        this.apiKey = apiKey != null ? apiKey.trim() : "";
        this.apiUrl = apiUrl != null ? apiUrl.trim() : "https://translation.googleapis.com/language/translate/v2";
        this.restTemplate = restTemplate;
    }

    /**
     * Translates the given text into the target language.
     *
     * @param text             the text to translate (must not be null)
     * @param targetLanguageCode target language code (e.g. "en", "fr", "es")
     * @return the translated text, or empty if the API key is missing or the request fails
     */
    public Optional<String> translate(String text, String targetLanguageCode) {
        if (text == null) {
            return Optional.empty();
        }
        if (text.isBlank()) {
            return Optional.of("");
        }
        if (apiKey.isBlank()) {
            log.debug("Google Translation skipped: API key not set (set GOOGLE_TRANSLATION_API_KEY)");
            return Optional.empty();
        }
        String target = targetLanguageCode != null ? targetLanguageCode.trim() : "";
        if (target.isEmpty()) {
            log.debug("Google Translation skipped: target language code is required");
            return Optional.empty();
        }

        String url = apiUrl + "?key=" + apiKey;
        Map<String, Object> body = Map.of(
                "q", List.of(text),
                "target", target,
                "format", "text"
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

        try {
            @SuppressWarnings("unchecked")
            Map<String, Object> response = restTemplate.postForObject(url, request, Map.class);
            if (response != null && response.containsKey("data")) {
                @SuppressWarnings("unchecked")
                Map<String, Object> data = (Map<String, Object>) response.get("data");
                if (data != null && data.containsKey("translations")) {
                    @SuppressWarnings("unchecked")
                    List<Map<String, Object>> translations = (List<Map<String, Object>>) data.get("translations");
                    if (translations != null && !translations.isEmpty() && translations.get(0).containsKey("translatedText")) {
                        String translated = (String) translations.get(0).get("translatedText");
                        return Optional.ofNullable(translated);
                    }
                }
            }
        } catch (Exception e) {
            log.warn("Google Translation request failed: {}", e.getMessage());
        }

        return Optional.empty();
    }

    /**
     * Returns whether the service is available (API key configured).
     */
    public boolean isAvailable() {
        return apiKey != null && !apiKey.isBlank();
    }
}
