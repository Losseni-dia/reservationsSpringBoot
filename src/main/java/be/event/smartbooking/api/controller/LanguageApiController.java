package be.event.smartbooking.api.controller;

import be.event.smartbooking.model.Language;
import be.event.smartbooking.repository.LanguageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/languages")
public class LanguageApiController {

    @Autowired
    private LanguageRepository languageRepository;

    /**
     * Retourne la liste de toutes les langues pour la dropdown frontend
     */
    @GetMapping
    public List<Language> getAllLanguages() {
        return languageRepository.findAll();
    }
}