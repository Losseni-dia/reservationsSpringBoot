package be.event.smartbooking.api.controller;

import be.event.smartbooking.dto.LiveTranslateRequest;
import be.event.smartbooking.dto.TranslationRequest;
import be.event.smartbooking.dto.TranslationResponse;
import be.event.smartbooking.errorHandler.ErrorResponse;
import be.event.smartbooking.service.GoogleCloudTranslationService;
import be.event.smartbooking.service.TranslationService;
import java.time.LocalDateTime;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api")
public class TranslationController {

    private static final Logger log = LoggerFactory.getLogger(TranslationController.class);

    @Autowired
    private TranslationService translationService;

    @Autowired
    private GoogleCloudTranslationService googleCloudTranslationService;

    @PostMapping("/translate")
    public ResponseEntity<TranslationResponse> translate(@Valid @RequestBody TranslationRequest request) {
        String sourceLang = request.getSourceLang() != null && !request.getSourceLang().isBlank()
                ? request.getSourceLang()
                : "fr";
        String result = translationService.translate(
                request.getText(),
                sourceLang,
                request.getTargetLang()
        ).orElse(request.getText());

        return ResponseEntity.ok(TranslationResponse.builder()
                .translatedText(result)
                .build());
    }

    /**
     * Live translation via Google Cloud Translation API.
     * Returns 200 with translated text on success, 503 if translation is unavailable.
     */
    @PostMapping("/translation/translate")
    public ResponseEntity<?> translateLive(@Valid @RequestBody LiveTranslateRequest request,
                                          HttpServletRequest httpRequest) {
        var result = googleCloudTranslationService.translate(
                request.getText(),
                request.getTargetLanguage()
        );
        if (result.isPresent()) {
            return ResponseEntity.ok(TranslationResponse.builder()
                    .translatedText(result.get())
                    .build());
        }
        log.error(
                "Réponse HTTP 503 — traduction live indisponible (POST {}). Causes fréquentes : "
                        + "GOOGLE_TRANSLATION_API_KEY / google.cloud.translation.api-key non définie, langue cible invalide, "
                        + "échec ou quota dépassé sur l'API Google Cloud Translation. Voir les logs GoogleCloudTranslationService ci-dessus.",
                httpRequest.getRequestURI());
        ErrorResponse error = ErrorResponse.builder()
                .timestamp(LocalDateTime.now())
                .status(HttpStatus.SERVICE_UNAVAILABLE.value())
                .error("Service Unavailable")
                .message("Translation service is unavailable. Please check that the API key is configured and try again.")
                .path(httpRequest.getRequestURI())
                .build();
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(error);
    }
}
