package be.event.smartbooking.api.controller;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import be.event.smartbooking.dto.PriceDTO;
import be.event.smartbooking.dto.RepresentationDTO;
import be.event.smartbooking.dto.RepresentationRequest;
import be.event.smartbooking.model.Location;
import be.event.smartbooking.model.Price;
import be.event.smartbooking.model.Representation;
import be.event.smartbooking.model.Show;
import be.event.smartbooking.repository.LocationRepos;
import be.event.smartbooking.repository.RepresentationRepos;
import be.event.smartbooking.service.ShowService;

@RestController
@RequestMapping("/api")
public class RepresentationApiController {

    @Autowired
    private ShowService showService;
    @Autowired
    private RepresentationRepos repRepo;
    @Autowired
    private LocationRepos locRepo;

    /**
     * AJOUTER une représentation à un spectacle
     */
    @PostMapping("/shows/{showId}/representations")
    @Transactional
    public ResponseEntity<?> addRepresentation(@PathVariable Long showId, @RequestBody RepresentationRequest request) {
        Show show = showService.get(showId);
        if (show == null)
            return ResponseEntity.notFound().build();

        // 1. Déterminer le lieu
        Location finalLocation = (request.getLocationId() != null)
                ? locRepo.findById(request.getLocationId()).orElse(show.getLocation())
                : show.getLocation();

        if (finalLocation == null) {
            return ResponseEntity.badRequest().body("Erreur : Aucun lieu n'est défini.");
        }

        // 2. Création de la représentation
        Representation rep = Representation.builder()
                .show(show)
                .when(request.getWhen())
                .location(finalLocation)
                .build();

        // 3. Ajout des prix
        if (request.getPrices() != null) {
            request.getPrices().forEach(p -> {
                if (p.getAmount() != null) {
                    rep.addPrice(Price.builder()
                            .type(p.getType())
                            .amount(p.getAmount())
                            .startDate(LocalDateTime.now())
                            .build());
                }
            });
        }

        Representation savedRep = repRepo.save(rep);

        // 🚀 CRUCIAL : On transforme l'entité sauvegardée en DTO pour le Frontend
        RepresentationDTO dto = RepresentationDTO.builder()
                .id(savedRep.getId())
                .when(savedRep.getWhen())
                .showTitle(show.getTitle())
                .locationName(finalLocation.getDesignation()) // On remplit le nom du lieu
                .prices(savedRep.getPrices().stream()
                        .map(p -> PriceDTO.builder()
                                .id(p.getId())
                                .type(p.getType().toString())
                                .amount(p.getAmount())
                                // On laisse les dates à null par défaut
                                .build())
                        .toList())
                .build();

        return ResponseEntity.status(HttpStatus.CREATED).body(dto);
    }

    /**
     * SUPPRIMER une représentation
     */
    @DeleteMapping("/representations/{id}")
    @Transactional
    public ResponseEntity<?> deleteRepresentation(@PathVariable Long id) {
        if (!repRepo.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        try {
            repRepo.deleteById(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            // Sécurité si des réservations sont déjà liées
            return ResponseEntity.status(409)
                    .body("Impossible de supprimer : des réservations existent pour cette séance.");
        }
    }
}