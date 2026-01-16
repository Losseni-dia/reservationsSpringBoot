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

        /**
         * GET /api/shows : Récupère tous les spectacles
         */
        @GetMapping
        public ResponseEntity<List<ShowDTO>> getAll() {
                try {
                        List<Show> shows = showService.getAll();
                        List<ShowDTO> dtos = shows.stream()
                                        .map(this::safeConvertToDto)
                                        .collect(Collectors.toList());
                        return ResponseEntity.ok(dtos);
                } catch (Exception e) {
                        e.printStackTrace();
                        return ResponseEntity.ok(new ArrayList<>());
                }
        }

    /**
     * GET /api/shows/{id} : Récupère un spectacle par son ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<ShowDTO> getById(@PathVariable Long id) {
        Show show = showService.get(id);
        if (show == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(safeConvertToDto(show));
    }

        /**
         * GET /api/shows/search?query=... : Recherche par titre (Issue #1)
         */
        @GetMapping("/search")
        public ResponseEntity<List<ShowDTO>> search(
                        @RequestParam(required = false) String title,
                        @RequestParam(required = false) String location,
                        @RequestParam(required = false) String date) {

                try {
                        List<Show> shows = showService.getAll(); // Récupère tous les spectacles avec leurs lieux

                        List<ShowDTO> results = shows.stream()
                                        .filter(show -> {
                                                boolean matches = true;

                                                // Filtrage par titre
                                                if (title != null && !title.isEmpty()) {
                                                        matches = matches && show.getTitle().toLowerCase()
                                                                        .contains(title.toLowerCase());
                                                }

                                                // Filtrage par lieu (désignation)
                                                if (location != null && !location.isEmpty()
                                                                && show.getLocation() != null) {
                                                        matches = matches && show.getLocation().getDesignation()
                                                                        .toLowerCase().contains(location.toLowerCase());
                                                }

                                                // Filtrage par date (vérifie les représentations liées au spectacle)
                                                if (date != null && !date.isEmpty()
                                                                && show.getRepresentations() != null) {
                                                        matches = matches && show.getRepresentations().stream()
                                                                        .anyMatch(rep -> rep.getWhen().toString()
                                                                                        .contains(date));
                                                }

                                                return matches;
                                        })
                                        .map(this::safeConvertToDto) // Utilise de la méthode de conversion sécurisée
                                        .collect(Collectors.toList());

                        return ResponseEntity.ok(results);
                } catch (Exception e) {
                        e.printStackTrace();
                        return ResponseEntity.ok(new ArrayList<>());
                }
        }

        /**
         * POST /api/shows : Crée un nouveau spectacle (Issue #3)
         */
        @PostMapping
        public ResponseEntity<ShowDTO> create(@RequestBody Show show) {
                try {
                        showService.add(show);
                        return new ResponseEntity<>(safeConvertToDto(show), HttpStatus.CREATED);
                } catch (Exception e) {
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
                }
        }

        /**
         * PUT /api/shows/{id} : Met à jour un spectacle existant
         */
        @PutMapping("/{id}")
        public ResponseEntity<ShowDTO> update(@PathVariable Long id, @RequestBody Show show) {
                Show existingShow = showService.get(id);
                if (existingShow == null) {
                        return ResponseEntity.notFound().build();
                }
                showService.update(id, show);
                return ResponseEntity.ok(safeConvertToDto(show));
        }

        /**
         * DELETE /api/shows/{id} : Supprime un spectacle
         */
        @DeleteMapping("/{id}")
        public ResponseEntity<Void> delete(@PathVariable Long id) {
                Show existingShow = showService.get(id);
                if (existingShow == null) {
                        return ResponseEntity.notFound().build();
                }
                showService.delete(id);
                return ResponseEntity.noContent().build();
        }

        /**
         * Transformation sécurisée de l'entité Show vers ShowDTO
         */
        private ShowDTO safeConvertToDto(Show show) {
                String locationName = "Lieu non défini";

                if (show.getLocation() != null) {
                        try {
                                // Utilisation de la désignation du lieu (Issue #1)
                                locationName = show.getLocation().getDesignation();
                        } catch (Exception e) {
                                locationName = "Lieu (chargement...)";
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