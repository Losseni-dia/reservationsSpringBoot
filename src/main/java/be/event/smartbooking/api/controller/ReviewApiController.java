package be.event.smartbooking.api.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import be.event.smartbooking.dto.ReviewDTO;
import be.event.smartbooking.dto.ReviewStatsDTO;
import be.event.smartbooking.model.Review;
import be.event.smartbooking.model.Show;
import be.event.smartbooking.model.User;
import be.event.smartbooking.repository.ShowRepos;
import be.event.smartbooking.repository.UserRepos;
import be.event.smartbooking.service.ReviewService;
import be.event.smartbooking.service.TranslationService;

@RestController
@RequestMapping("/api/reviews")
public class ReviewApiController {

    @Autowired
    private ReviewService reviewService;
    @Autowired
    private UserRepos userRepository;
    @Autowired
    private ShowRepos showRepository;

    @Autowired
    private TranslationService translationService;

    @GetMapping("/show/{showId}")
    public List<ReviewDTO> getByShow(@PathVariable Long showId) {
        return reviewService.getValidatedReviewsByShow(showId).stream()
                .map(this::convertToDTO)
                .toList();
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> create(@RequestBody ReviewDTO dto, Principal principal) {
        User user = userRepository.findByLogin(principal.getName());
        if (user == null) {
            return ResponseEntity.status(401).body("Utilisateur non trouvé");
        }

        Show show = showRepository.findById(dto.getShowId())
                .orElseThrow(() -> new RuntimeException("Spectacle non trouvé"));

        // On reconstruit l'objet Review correctement
        Review review = Review.builder()
                .user(user)
                .show(show) // <--- ON RÉACTIVE CETTE LIGNE
                .comment(dto.getComment())
                .stars(dto.getStars())
                .validated(false) // Par sécurité, on force le false ici aussi
                .createdAt(java.time.LocalDateTime.now()) // On ajoute la date
                .build();

        try {
            Review saved = reviewService.addReview(review);
            return ResponseEntity.ok(convertToDTO(saved));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/pending")
    @PreAuthorize("hasAnyRole('ADMIN', 'PRODUCER')")
    public List<ReviewDTO> getPending(Principal principal, Authentication auth) {
        // FORCE LE CHARGEMENT DE TOUT POUR TESTER LE DESIGN
        List<Review> reviews = reviewService.getPendingReviews();

        System.out.println("📦 TEST FORCE - Avis trouvés : " + reviews.size());

        return reviews.stream()
                .map(this::convertToDTO)
                .toList();
    }

    // Valider un avis
    @PutMapping("/{id}/validate")
    // Remplace hasRole par hasAnyRole car tu as plusieurs arguments
    @PreAuthorize("hasAnyRole('ADMIN', 'PRODUCER', 'admin', 'producer')")
    public ResponseEntity<Void> validate(@PathVariable Long id) {
        reviewService.validateReview(id);
        return ResponseEntity.ok().build();
    }

    // Supprimer un avis (déjà géré si tu as mis le DeleteMapping générique, sinon
    // ajoute-le)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN', 'PRODUCER')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        reviewService.deleteReview(id);
        return ResponseEntity.noContent().build();
    }

    private ReviewDTO convertToDTO(Review r) {
        String targetLang = LocaleContextHolder.getLocale().getLanguage();
        String comment = translateIfNeeded(r.getComment(), "fr", targetLang);

        return ReviewDTO.builder()
                .id(r.getId())
                .authorLogin(r.getUser() != null ? r.getUser().getLogin() : "Anonyme")
                .comment(comment)
                .stars(r.getStars())
                .createdAt(r.getCreatedAt())
                .showId(r.getShow() != null ? r.getShow().getId() : null)
                // ⬇️ AJOUTE CETTE LIGNE (vérifie que showTitle existe dans ton ReviewDTO)
                .showTitle(r.getShow() != null ? r.getShow().getTitle() : "Spectacle inconnu")
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

    @GetMapping("/admin/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ReviewStatsDTO> getGlobalStats() {
        return ResponseEntity.ok(reviewService.getGlobalStats());
    }
}