package be.event.smartbooking.controller;

import be.event.smartbooking.model.Representation;
import be.event.smartbooking.model.Review;
import be.event.smartbooking.model.Show;
import be.event.smartbooking.model.enumeration.ShowStatus;
import be.event.smartbooking.repository.RepresentationRepos;
import be.event.smartbooking.repository.ReviewRepository;
import be.event.smartbooking.repository.ShowRepos;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/public")
@Tag(name = "Catalogue Public B2B", description = "Points d'entrée réservés aux partenaires pour consulter les spectacles, les dates et les avis.")
public class PublicApiController {

    @Autowired
    private ShowRepos showRepos;

    @Autowired
    private RepresentationRepos representationRepos;

    @Autowired
    private ReviewRepository reviewRepository;

    // 1. Récupérer TOUS les spectacles confirmés
    @Operation(summary = "Lister les spectacles à l'affiche", description = "Retourne la liste de tous les spectacles ayant le statut CONFIRME avec leur lieu de représentation.")
    @GetMapping("/shows")
    public ResponseEntity<List<Show>> getAllPublicShows() {
        // On utilise ta méthode personnalisée pour ne renvoyer que les spectacles confirmés !
        List<Show> shows = showRepos.findAllWithLocationAndStatus(ShowStatus.CONFIRME);
        return ResponseEntity.ok(shows);
    }

    // 2. Récupérer UN spectacle précis via son Slug
    @Operation(summary = "Détail d'un spectacle", description = "Retourne les informations complètes d'un spectacle grâce à son identifiant unique (slug).")
    @GetMapping("/shows/{slug}")
    public ResponseEntity<Show> getShowBySlug(
            @Parameter(description = "Le slug du spectacle (ex: ayiti)") @PathVariable String slug) {
        
        Show show = showRepos.findBySlug(slug);
        if (show == null || show.getStatus() != ShowStatus.CONFIRME) {
            return ResponseEntity.notFound().build(); // Erreur 404 si le spectacle n'existe pas ou n'est pas public
        }
        return ResponseEntity.ok(show);
    }

    // 3. Récupérer les REPRÉSENTATIONS (dates) d'un spectacle
    @Operation(summary = "Dates de tournée d'un spectacle", description = "Retourne le calendrier de toutes les représentations prévues pour un spectacle donné.")
    @GetMapping("/shows/{slug}/representations")
    public ResponseEntity<List<Representation>> getRepresentationsForShow(
            @Parameter(description = "Le slug du spectacle") @PathVariable String slug) {
        
        Show show = showRepos.findBySlug(slug);
        if (show == null) {
            return ResponseEntity.notFound().build();
        }
        
        // On utilise ton repository pour récupérer les dates liées à ce spectacle
        List<Representation> representations = representationRepos.findByShow(show);
        return ResponseEntity.ok(representations);
    }

    // 4. Récupérer les AVIS validés d'un spectacle
    @Operation(summary = "Avis du public sur un spectacle", description = "Retourne la liste des avis ayant été validés par la modération pour un spectacle précis.")
    @GetMapping("/shows/{slug}/reviews")
    public ResponseEntity<List<Review>> getReviewsForShow(
            @Parameter(description = "Le slug du spectacle") @PathVariable String slug) {
        
        Show show = showRepos.findBySlug(slug);
        if (show == null) {
            return ResponseEntity.notFound().build();
        }
        
        // On utilise ta méthode pour ne récupérer QUE les avis "validated = true"
        List<Review> reviews = reviewRepository.findByShowIdAndValidatedTrueOrderByCreatedAtDesc(show.getId());
        return ResponseEntity.ok(reviews);
    }
}