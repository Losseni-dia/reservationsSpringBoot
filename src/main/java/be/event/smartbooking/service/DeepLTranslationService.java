package be.event.smartbooking.service;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

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
    private final TranslationCostService translationCostService;

    public DeepLTranslationService(TranslationProperties properties, RestTemplate restTemplate,
            TranslationCostService translationCostService) {
        this.properties = properties;
        this.restTemplate = restTemplate;
        this.translationCostService = translationCostService;
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

        String cacheKey = buildCacheKey(text, normalizedSource, normalizedTarget);
        if (properties.cacheEnabled()) {
            String cached = getFromCache(cacheKey);
            if (cached != null) {
                return Optional.of(cached);
            }
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
                    translationCostService.logUsage(charCount);
                    String translated = (String) translations.get(0).get("text");
                    if (translated != null && properties.cacheEnabled()) {
                        putInCache(cacheKey, translated);
                    }
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
        if (dailyLimit > 0 && translationCostService.getCharactersToday() + additionalChars > dailyLimit) {
            return true;
        }
        if (monthlyLimit > 0 && translationCostService.getCharactersThisMonth() + additionalChars > monthlyLimit) {
            return true;
        }
        return false;
    }

    private static final class CachedEntry {
        final String translated;
        final long expiresAt;

        CachedEntry(String translated, long expiresAt) {
            this.translated = translated;
            this.expiresAt = expiresAt;
        }
    }

    private final Map<String, CachedEntry> translationCache = new ConcurrentHashMap<>();

    private String buildCacheKey(String text, String sourceLang, String targetLang) {
        return (sourceLang != null ? sourceLang : "") + "|" + targetLang + "|" + text;
    }

    private String getFromCache(String key) {
        CachedEntry entry = translationCache.get(key);
        if (entry == null) return null;
        if (System.currentTimeMillis() > entry.expiresAt) {
            translationCache.remove(key);
            return null;
        }
        return entry.translated;
    }

    private void putInCache(String key, String translated) {
        evictIfNeeded();
        long ttlMs = properties.cacheTtlHours() * 3600L * 1000;
        translationCache.put(key, new CachedEntry(translated, System.currentTimeMillis() + ttlMs));
    }

    private void evictIfNeeded() {
        int maxSize = Math.max(100, properties.cacheMaxSize());
        if (translationCache.size() >= maxSize) {
            long now = System.currentTimeMillis();
            translationCache.entrySet().removeIf(e -> e.getValue().expiresAt <= now);
            if (translationCache.size() >= maxSize) {
                translationCache.clear();
            }
        }
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
