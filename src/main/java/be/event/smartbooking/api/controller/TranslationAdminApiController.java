package be.event.smartbooking.api.controller;

import be.event.smartbooking.config.TranslationProperties;
import be.event.smartbooking.dto.TranslationUsageDTO;
import be.event.smartbooking.service.TranslationService;
import be.event.smartbooking.service.TranslationUsageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/translation")
@PreAuthorize("hasRole('ADMIN')")
public class TranslationAdminApiController {

    @Autowired
    private TranslationUsageService usageService;

    @Autowired
    private TranslationService translationService;

    @Autowired
    private TranslationProperties translationProperties;

    @GetMapping("/usage")
    public ResponseEntity<TranslationUsageDTO> getUsage() {
        TranslationUsageDTO dto = TranslationUsageDTO.builder()
                .charactersToday(usageService.getCharactersToday())
                .charactersThisMonth(usageService.getCharactersThisMonth())
                .dailyLimit(translationProperties.dailyLimit())
                .monthlyLimit(translationProperties.monthlyLimit())
                .translationAvailable(translationService.isAvailable())
                .build();
        return ResponseEntity.ok(dto);
    }
}
