package be.event.smartbooking.api.controller;

import be.event.smartbooking.dto.ShowDTO;
import be.event.smartbooking.model.Show;
import be.event.smartbooking.service.ShowService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/shows")
public class ShowApiController {

        @Autowired
        private ShowService showService;

        @GetMapping
        public ResponseEntity<List<ShowDTO>> getAll() {
                try {
                        // On récupère la liste via le service
                        List<Show> shows = showService.getAll();
                        List<ShowDTO> dtos = shows.stream()
                                        .map(this::safeConvertToDto)
                                        .collect(Collectors.toList());
                        return ResponseEntity.ok(dtos);
                } catch (Exception e) {
                        // En cas d'erreur, on logue précisément le problème
                        System.err.println("Erreur lors de la récupération des shows: " + e.getMessage());
                        e.printStackTrace();
                        // On renvoie une erreur 500 plutôt qu'une liste vide,
                        // comme ça tu verras l'erreur dans l'onglet "Network" du navigateur
                        return ResponseEntity.internalServerError().build();
                }
        }

        /**
         * GET /api/shows/{id} : Récupère un spectacle par son ID
         */
        @GetMapping("/{id}")
        @Transactional(readOnly = true)
        public ResponseEntity<ShowDTO> getById(@PathVariable Long id) {
                Show show = showService.get(id);
                if (show == null) {
                        return ResponseEntity.notFound().build();
                }
                return ResponseEntity.ok(safeConvertToDto(show));
        }
        
        /**
         * GET /api/shows/slug/{slug} : Récupère un spectacle par son slug
         * Utilisé pour les URLs du frontend (ex: /show/mon-spectacle)
         */
        @GetMapping("/slug/{slug}")
        @Transactional(readOnly = true)
        public ResponseEntity<ShowDTO> getBySlug(@PathVariable String slug) {
                try {
                        Show show = showService.findBySlug(slug); // Utilise votre service existant

                        if (show == null) {
                                return ResponseEntity.notFound().build();
                        }

                        return ResponseEntity.ok(safeConvertToDto(show)); // Utilise votre conversion sécurisée
                } catch (Exception e) {
                        e.printStackTrace();
                        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
                }
        }

        /**
         * GET /api/shows/search?query=... : Recherche par titre (Issue #1)
         */
        @GetMapping("/search")
        @Transactional(readOnly = true)
        public ResponseEntity<List<ShowDTO>> search(
                        @RequestParam(required = false) String title,
                        @RequestParam(required = false) String location,
                        @RequestParam(required = false) LocalDateTime start,
                        @RequestParam(required = false) LocalDateTime end) {

                try {
                        // Appel au service avec les 3 paramètres
                        List<Show> shows = showService.search(title, location, start, end);

                        List<ShowDTO> dtos = shows.stream()
                                        .map(this::safeConvertToDto)
                                        .collect(Collectors.toList());

                        return ResponseEntity.ok(dtos);
                } catch (Exception e) {
                        // Si une erreur survient ici, on la voit dans la console Java
                        e.printStackTrace();
                        // Mais on renvoie une liste vide à React pour éviter la 500
                        return ResponseEntity.ok(new ArrayList<>());
                }
        }

        private ShowDTO safeConvertToDto(Show show) {
                String locationName = "Lieu non défini";

                // PROTECTION CRITIQUE : C'est ici que l'erreur 500 se produisait
                if (show.getLocation() != null) {
                        try {
                                // On tente de lire le nom du lieu
                                locationName = show.getLocation().getDesignation();
                        } catch (Exception e) {
                                // Si Hibernate fait une erreur de Lazy Loading (Proxy), on capture
                                locationName = "Lieu (en cours...)";
                        }
                }

                return ShowDTO.builder()
                                .id(show.getId())
                                .slug(show.getSlug())
                                .title(show.getTitle())
                                .description(show.getDescription())
                                .posterUrl(show.getPosterUrl())
                                .bookable(show.isBookable())
                                .locationDesignation(locationName)
                                .build();
        }
}