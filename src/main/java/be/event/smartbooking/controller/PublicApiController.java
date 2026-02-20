package be.event.smartbooking.controller;

import be.event.smartbooking.model.Show;
import be.event.smartbooking.repository.ShowRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/public")
@Tag(name = "Catalogue Public", description = "Points d'entrée B2B pour les spectacles et artistes")
public class PublicApiController {

    @Autowired
    private ShowRepository showRepository; // Assure-toi d'avoir ce repository

    @Operation(summary = "Récupérer tous les spectacles à l'affiche")
    @GetMapping("/shows")
    public ResponseEntity<List<Show>> getAllPublicShows() {
        // Ici tu pourrais filtrer pour ne renvoyer que les spectacles actifs
        List<Show> shows = showRepository.findAll(); 
        return ResponseEntity.ok(shows);
    }

    // Tu pourras ajouter ici :
    // @GetMapping("/artists")
    // @GetMapping("/venues")
    // etc...
}