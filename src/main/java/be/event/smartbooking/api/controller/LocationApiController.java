package be.event.smartbooking.api.controller;

import be.event.smartbooking.dto.LocationDTO;
import be.event.smartbooking.model.Location;
import be.event.smartbooking.service.LocationService;
import be.event.smartbooking.service.TranslationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/locations")
public class LocationApiController {

    @Autowired
    private LocationService locationService;

    @Autowired
    private TranslationService translationService;

    @GetMapping
    public List<LocationDTO> getAll() {
        // 1. On récupère la liste des entités
        List<Location> locations = locationService.getAll();

        // 2. On utilise les Streams pour transformer chaque entité en DTO
        return locations.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private LocationDTO convertToDTO(Location loc) {
        String sourceLang = "fr";
        String targetLang = LocaleContextHolder.getLocale().getLanguage();
        String designation = translateIfNeeded(loc.getDesignation(), sourceLang, targetLang);
        String localityName = loc.getLocality() != null ? loc.getLocality().getLocality() : "Ville inconnue";
        localityName = translateIfNeeded(localityName, sourceLang, targetLang);

        return LocationDTO.builder()
                .id(loc.getId())
                .designation(designation)
                .address(loc.getAddress())
                .website(loc.getWebsite())
                .localityName(localityName)
                .build();
    }

    private String translateIfNeeded(String text, String sourceLang, String targetLang) {
        if (text == null || text.isBlank()) {
            return text;
        }
        if (sourceLang.equalsIgnoreCase(targetLang)) {
            return text;
        }
        return translationService.translate(text, sourceLang, targetLang).orElse(text);
    }
}