package be.event.smartbooking.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Configuration properties for the translation API (DeepL).
 */
@ConfigurationProperties(prefix = "app.translation")
public record TranslationProperties(
    boolean enabled,
    String apiKey,
    String apiUrl,
    long dailyLimit,
    long monthlyLimit,
    boolean cacheEnabled,
    int cacheMaxSize,
    int cacheTtlHours
) {}
