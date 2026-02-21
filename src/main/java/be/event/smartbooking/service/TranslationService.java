package be.event.smartbooking.service;

import java.util.Optional;

/**
 * Service for translating text using an external API (e.g. DeepL).
 */
public interface TranslationService {

    /**
     * Translates the given text from source language to target language.
     *
     * @param text        the text to translate (non-null, may be empty)
     * @param sourceLang  source language code (e.g. "fr", "en")
     * @param targetLang  target language code (e.g. "en", "nl")
     * @return the translated text, or empty if translation is disabled or fails
     */
    Optional<String> translate(String text, String sourceLang, String targetLang);

    /**
     * Indicates whether the translation service is available (enabled and configured).
     */
    boolean isAvailable();
}
