package be.event.smartbooking.api.controller;

import be.event.smartbooking.dto.ArtistDTO;
import be.event.smartbooking.dto.ArtistLanguageRequest;
import be.event.smartbooking.model.Artist;
import be.event.smartbooking.model.ArtistLanguage;
import be.event.smartbooking.model.Language;
import be.event.smartbooking.service.ArtistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

import be.event.smartbooking.model.Type;
import be.event.smartbooking.model.enumeration.LanguageLevel;
import be.event.smartbooking.repository.ArtistLanguageRepository;
import be.event.smartbooking.repository.LanguageRepository;

@RestController
@RequestMapping("/api/artists")
public class ArtistApiController {

    @Autowired
    private ArtistLanguageRepository artistLanguageRepository;

    @Autowired
    private LanguageRepository languageRepository;


    @Autowired
    private ArtistService artistService; // Utilisation du Service au lieu du Repo

    @GetMapping
    public List<ArtistDTO> getAll() {
        return artistService.getAllArtists().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getOne(@PathVariable Long id) {
        Artist artist = artistService.getArtistById(id);
        if (artist == null) {
            return ResponseEntity.notFound().build();
        }

        // 1. Récupérer les langues associées à cet artiste dans la base de données
        List<ArtistLanguage> artistLanguages = artistLanguageRepository.findByArtistId(id);

        // 2. Transformer ces lignes en un format DTO plat lisible directement par ton
        // React
        List<Map<String, Object>> languagesListDto = artistLanguages.stream().map(al -> {
            Map<String, Object> langMap = new java.util.HashMap<>();
            langMap.put("id", al.getLanguage().getId());
            langMap.put("name", al.getLanguage().getLanguage()); // Mappe le nom de la langue (ex: "Français")
            langMap.put("level", al.getLevel().getLabel()); // Mappe le libellé propre (ex: "Courant")
            return langMap;
        }).toList();

        // 3. Construire la réponse finale combinée (L'artiste + ses types + ses
        // langues)
        Map<String, Object> jsonResponse = new java.util.HashMap<>();
        jsonResponse.put("id", artist.getId());
        jsonResponse.put("firstname", artist.getFirstname());
        jsonResponse.put("lastname", artist.getLastname());
        // On extrait uniquement les chaînes de caractères des disciplines
        jsonResponse.put("types", artist.getTypes().stream().map(t -> t.getType()).toList());
        jsonResponse.put("languages", languagesListDto); // 🚀 Envoyé au front !

        return ResponseEntity.ok(jsonResponse);
    }

    @PostMapping("/admin")
    public ArtistDTO save(@RequestBody Artist artist) {
        artistService.addArtist(artist);
        return convertToDto(artist);
    }

    @DeleteMapping("/admin/{id}")
    public void delete(@PathVariable Long id) {
        artistService.deleteArtist(id);
    }

    private ArtistDTO convertToDto(Artist artist) {
        List<String> typeLabels = Collections.emptyList();
        if (artist.getTypes() != null && !artist.getTypes().isEmpty()) {
            typeLabels = artist.getTypes().stream()
                    .map(Type::getType)
                    .filter(Objects::nonNull)
                    .collect(Collectors.toList());
        }
        return ArtistDTO.builder()
                .id(artist.getId())
                .firstname(artist.getFirstname())
                .lastname(artist.getLastname())
                .types(typeLabels)
                .build();
    }

    // Écriture : Seul l'ADMIN peut associer une langue à un artiste
@PreAuthorize("hasRole('ADMIN')")
@PostMapping("/{id}/languages")
public ResponseEntity<?> addLanguageToArtist(@PathVariable Long id, @RequestBody ArtistLanguageRequest request) {
    Artist artist = artistService.getArtistById(id);
    if (artist == null) return ResponseEntity.notFound().build();

    // Sécurité supplémentaire imposée par le cahier des charges : uniquement si l'artiste est un comédien
    boolean isComedien = artist.getTypes().stream()
            .anyMatch(t -> t.getType().equalsIgnoreCase("comédien"));
            
    if (!isComedien) {
        return ResponseEntity.badRequest().body("Erreur : Cet artiste n'est pas un comédien.");
    }

    Language lang = languageRepository.findById(request.getLanguageId()).orElse(null);
    
    ArtistLanguage artistLanguage = ArtistLanguage.builder()
            .artist(artist)
            .language(lang)
            .level(LanguageLevel.valueOf(request.getLevel().toUpperCase()))
            .build();

    artistLanguageRepository.save(artistLanguage);
    return ResponseEntity.ok().build();
}

// Route personnalisée paramétrée : Trouver les artistes parlant couramment une langue
@GetMapping("/search/fluent/{languageName}")
public List<ArtistDTO> getFluentArtistsByLanguage(@PathVariable String languageName) {
    return artistService.findFluentArtistsByLanguage(languageName).stream()
            .map(this::convertToDto)
            .toList();
}
}