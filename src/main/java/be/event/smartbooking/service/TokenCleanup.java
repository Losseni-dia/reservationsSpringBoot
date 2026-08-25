package be.event.smartbooking.service;

import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import be.event.smartbooking.repository.PasswordResetTokenRepos;
import jakarta.transaction.Transactional;

@Component
@RequiredArgsConstructor
public class TokenCleanup {
    private final PasswordResetTokenRepos tokenRepo;

    @Scheduled(cron = "0 0 * * * *") // toutes les heures
    @Transactional
    public void removeExpiredTokens() {
        tokenRepo.findAll().stream()
                .filter(token -> token.getExpiryDate().isBefore(java.time.LocalDateTime.now()))
                .forEach(token -> tokenRepo.delete(token));
    }
}
