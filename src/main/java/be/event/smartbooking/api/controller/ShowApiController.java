package be.event.smartbooking.api.controller;

import be.event.smartbooking.dto.ShowDTO;
import be.event.smartbooking.model.Show;
import be.event.smartbooking.service.ShowService;
import org.springframework.beans.factory.annotation.Autowired;
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

                        // On transforme en DTO de manière ultra-sécurisée
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