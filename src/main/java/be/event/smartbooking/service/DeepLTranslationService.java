package be.event.smartbooking.service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import be.event.smartbooking.config.TranslationProperties;

/**
 * DeepL translation service implementation.
 * Uses the DeepL v2 REST API (https://api-free.deepl.com or https://api.deepl.com).
 */
@Service
public class DeepLTranslationService implements TranslationService {

    private static final Logger log = LoggerFactory.getLogger(DeepLTranslationService.class);

    private final TranslationProperties properties;
    private final RestTemplate restTemplate;
    private final TranslationUsageService usageService;

    public DeepLTranslationService(TranslationProperties properties, RestTemplate restTemplate,
            TranslationUsageService usageService) {
        this.properties = properties;
        this.restTemplate = restTemplate;
        this.usageService = usageService;
    }

    @Override
    public boolean isAvailable() {
        return properties.enabled()
            && properties.apiKey() != null
            && !properties.apiKey().isBlank()
            && properties.apiUrl() != null
            && !properties.apiUrl().isBlank();
    }

    @Override
    public Optional<String> translate(String text, String sourceLang, String targetLang) {
        if (text == null || text.isBlank()) {
            return Optional.of("");
        }
        if (!isAvailable()) {
            log.debug("Translation skipped: service not available");
            return Optional.of(text);
        }

        String normalizedSource = normalizeLang(sourceLang);
        String normalizedTarget = normalizeLang(targetLang);
        if (normalizedSource != null && normalizedSource.equals(normalizedTarget)) {
            return Optional.of(text);
        }

        int charCount = text.length();
        if (wouldExceedLimit(charCount)) {
            log.debug("Translation skipped: would exceed daily/monthly limit");
            return Optional.of(text);
        }

        try {
            MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
            body.add("text", text);
            body.add("target_lang", normalizedTarget);
            if (normalizedSource != null) {
                body.add("source_lang", normalizedSource);
            }

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
            headers.set("Authorization", "DeepL-Auth-Key " + properties.apiKey().trim());

            HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(body, headers);
            @SuppressWarnings("unchecked")
            Map<String, Object> response = restTemplate.postForObject(
                properties.apiUrl(),
                request,
                Map.class
            );

            if (response != null && response.containsKey("translations")) {
                @SuppressWarnings("unchecked")
                List<Map<String, Object>> translations = (List<Map<String, Object>>) response.get("translations");
                if (translations != null && !translations.isEmpty() && translations.get(0).containsKey("text")) {
                    usageService.recordUsage(charCount);
                    String translated = (String) translations.get(0).get("text");
                    return Optional.ofNullable(translated);
                }
            }
        } catch (Exception e) {
            log.warn("Translation failed: {}", e.getMessage());
        }

        return Optional.of(text);
    }

    private boolean wouldExceedLimit(int additionalChars) {
        long dailyLimit = properties.dailyLimit();
        long monthlyLimit = properties.monthlyLimit();
        if (dailyLimit <= 0 && monthlyLimit <= 0) {
            return false;
        }
        if (dailyLimit > 0 && usageService.getCharactersToday() + additionalChars > dailyLimit) {
            return true;
        }
        if (monthlyLimit > 0 && usageService.getCharactersThisMonth() + additionalChars > monthlyLimit) {
            return true;
        }
        return false;
    }

    /**
     * Normalizes language codes to DeepL format (e.g. "fr" -> "FR", "en" -> "EN").
     */
    private String normalizeLang(String lang) {
        if (lang == null || lang.isBlank()) {
            return null;
        }
        return lang.trim().toUpperCase();
    }
}
