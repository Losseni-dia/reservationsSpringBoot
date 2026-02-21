package be.event.smartbooking.service;

import be.event.smartbooking.model.TranslationUsage;
import be.event.smartbooking.repository.TranslationUsageRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Service
public class TranslationUsageService {

    private final TranslationUsageRepository repository;

    public TranslationUsageService(TranslationUsageRepository repository) {
        this.repository = repository;
    }

    @Transactional
    public void recordUsage(int charactersTranslated) {
        if (charactersTranslated <= 0) {
            return;
        }
        repository.save(TranslationUsage.builder()
                .charactersTranslated(charactersTranslated)
                .build());
    }

    public long getCharactersToday() {
        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        return repository.sumCharactersSince(startOfDay);
    }

    public long getCharactersThisMonth() {
        LocalDateTime startOfMonth = LocalDate.now().withDayOfMonth(1).atTime(LocalTime.MIN);
        return repository.sumCharactersSince(startOfMonth);
    }
}
