package be.event.smartbooking.api.controller;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

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

        // SÉCURITÉ : On vérifie si on a un lieu quelque part
        Location finalLocation = null;
        if (request.getLocationId() != null) {
            finalLocation = locRepo.findById(request.getLocationId()).orElse(show.getLocation());
        } else {
            finalLocation = show.getLocation();
        }

        // Si vraiment aucun lieu n'est défini ni dans la requête ni dans le spectacle
        if (finalLocation == null) {
            return ResponseEntity.badRequest().body("Erreur : Aucun lieu n'est défini pour cette séance.");
        }

        // 1. Création de la représentation
        Representation rep = Representation.builder()
                .show(show)
                .when(request.getWhen())
                .location(request.getLocationId() != null
                        ? locRepo.findById(request.getLocationId()).orElse(show.getLocation())
                        : show.getLocation())
                .build();

        // 2. Ajout des prix (La cascade CascadeType.ALL s'occupera de la sauvegarde en
        // base)
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

        repRepo.save(rep);
        return ResponseEntity.ok().build();
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