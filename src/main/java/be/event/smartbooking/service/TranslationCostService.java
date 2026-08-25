package be.event.smartbooking.service;

import be.event.smartbooking.model.TranslationUsage;
import be.event.smartbooking.repository.TranslationUsageRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Service
public class TranslationCostService {

    private final TranslationUsageRepository repository;

    public TranslationCostService(TranslationUsageRepository repository) {
        this.repository = repository;
    }

    @Transactional
    public void logUsage(int characterCount, Long userId) {
        if (characterCount <= 0) {
            return;
        }
        repository.save(TranslationUsage.builder()
                .charactersTranslated(characterCount)
                .userId(userId)
                .build());
    }

    @Transactional
    public void logUsage(int characterCount) {
        Long userId = getCurrentUserId();
        logUsage(characterCount, userId);
    }

    public long getCharactersToday() {
        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        return repository.sumCharactersSince(startOfDay);
    }

    public long getCharactersThisMonth() {
        LocalDateTime startOfMonth = LocalDate.now().withDayOfMonth(1).atTime(LocalTime.MIN);
        return repository.sumCharactersSince(startOfMonth);
    }

    private Long getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            return null;
        }
        return null;
    }
}
