package be.event.smartbooking.api.controller;

import be.event.smartbooking.dto.ReviewDTO;
import be.event.smartbooking.dto.ReviewStatsDTO;
import be.event.smartbooking.model.Review;
import be.event.smartbooking.model.User;
import be.event.smartbooking.model.Show;
import be.event.smartbooking.service.ReviewService;
import be.event.smartbooking.repository.UserRepos;
import be.event.smartbooking.repository.ShowRepos;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewApiController {

    @Autowired
    private ReviewService reviewService;
    @Autowired
    private UserRepos userRepository;
    @Autowired
    private ShowRepos showRepository;

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

        Review review = Review.builder()
                .user(user)
                .show(show)
                .comment(dto.getComment())
                .stars(dto.getStars())
                .build();

        try {
            Review saved = reviewService.addReview(review);
            return ResponseEntity.ok(convertToDTO(saved));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public List<ReviewDTO> getPending() {
        return reviewService.getPendingReviews().stream()
                .map(this::convertToDTO)
                .toList();
    }

    // Valider un avis
    @PutMapping("/{id}/validate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> validate(@PathVariable Long id) {
        reviewService.validateReview(id);
        return ResponseEntity.ok().build();
    }

    // Supprimer un avis (déjà géré si tu as mis le DeleteMapping générique, sinon
    // ajoute-le)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        reviewService.deleteReview(id);
        return ResponseEntity.noContent().build();
    }

    private ReviewDTO convertToDTO(Review r) {
        return ReviewDTO.builder()
                .id(r.getId())
                .authorLogin(r.getUser().getLogin())
                .comment(r.getComment())
                .stars(r.getStars())
                .createdAt(r.getCreatedAt())
                .showId(r.getShow().getId())
                .build();
    }

    @GetMapping("/admin/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ReviewStatsDTO> getGlobalStats() {
        return ResponseEntity.ok(reviewService.getGlobalStats());
    }
}