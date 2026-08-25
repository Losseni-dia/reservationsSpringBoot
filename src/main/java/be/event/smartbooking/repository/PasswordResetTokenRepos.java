package be.event.smartbooking.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import be.event.smartbooking.model.PasswordResetToken;

public interface PasswordResetTokenRepos extends JpaRepository<PasswordResetToken, Long> {
    Optional<PasswordResetToken> findByToken(String token);

    void deleteByToken(String token);
}
