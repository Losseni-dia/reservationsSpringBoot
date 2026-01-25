package be.event.smartbooking.api.controller;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import be.event.smartbooking.dto.RepresentationRequest;
import be.event.smartbooking.model.Price;
import be.event.smartbooking.model.Representation;
import be.event.smartbooking.model.Show;
import be.event.smartbooking.repository.LocationRepos;
import be.event.smartbooking.repository.RepresentationRepos;
import be.event.smartbooking.service.ShowService;

@RestController
@RequestMapping("/api/shows/{showId}/representations")
public class RepresentationApiController {

    @Autowired
    private ShowService showService;
    @Autowired
    private RepresentationRepos repRepo;
    @Autowired
    private LocationRepos locRepo;

    @PostMapping
    public ResponseEntity<?> addRepresentation(@PathVariable Long showId, @RequestBody RepresentationRequest request) {
        Show show = showService.get(showId);
        if (show == null)
            return ResponseEntity.notFound().build();

        Representation rep = Representation.builder()
                .show(show)
                .when(request.getWhen())
                .location(request.getLocationId() != null ? locRepo.findById(request.getLocationId()).orElse(null)
                        : show.getLocation())
                .build();

        // Ajout des prix
        if (request.getPrices() != null) {
            request.getPrices().forEach(p -> {
                rep.addPrice(Price.builder()
                        .type(p.getType())
                        .amount(p.getAmount())
                        .startDate(LocalDateTime.now()) // Prix actif dès maintenant
                        .build());
            });
        }

        repRepo.save(rep);
        return ResponseEntity.ok().build();
    }
}