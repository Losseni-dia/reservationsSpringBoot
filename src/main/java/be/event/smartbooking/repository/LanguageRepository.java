package be.event.smartbooking.repository;

import be.event.smartbooking.model.Language;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LanguageRepository extends JpaRepository<Language, Long> {

    /**
     * Permet de trouver une langue par son nom (ex: "Français")
     */
    Optional<Language> findByLanguageIgnoreCase(String language);
}