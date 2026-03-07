package be.event.smartbooking.api.controller;

import be.event.smartbooking.dto.TranslationRequest;
import be.event.smartbooking.dto.TranslationResponse;
import be.event.smartbooking.service.TranslationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class TranslationController {

    @Autowired
    private TranslationService translationService;

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
}
