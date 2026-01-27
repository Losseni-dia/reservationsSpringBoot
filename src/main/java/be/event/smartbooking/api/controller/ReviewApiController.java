package be.event.smartbooking.api.controller;

import be.event.smartbooking.dto.ReviewDTO;
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
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/reviews")
public class ReviewApiController {

    @Autowired
    private ReviewService reviewService;

    @Autowired
    private UserRepos userRepository; // Ton repo User

    @Autowired
    private ShowRepos showRepository;

    @GetMapping("/show/{showId}")
    public List<ReviewDTO> getByShow(@PathVariable Long showId) {
        return reviewService.getValidatedReviewsByShow(showId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()") // Obligatoire d'être connecté
    public ResponseEntity<?> create(@RequestBody ReviewDTO dto, Principal principal) {
        // 1. Récupérer l'utilisateur connecté via son login (Principal)
        User user = userRepository.findByLogin(principal.getName());
        Show show = showRepository.findById(dto.getShowId()).orElseThrow();

        // 2. Créer l'entité
        Review review = Review.builder()
                .user(user)
                .show(show)
                .comment(dto.getComment())
                .stars(dto.getStars())
                .validated(true)
                .build();

        Review saved = reviewService.addReview(review);
        return ResponseEntity.ok(convertToDTO(saved));
    }

    private ReviewDTO convertToDTO(Review r) {
        return ReviewDTO.builder()
                .id(r.getId())
                .authorLogin(r.getUser().getLogin())
                .comment(r.getComment())
                .stars(r.getStars())
                .createdAt(r.getCreatedAt())
                .showId(r.getShow().getId()) // Ajoute ce champ dans ton ReviewDTO
                .build();
    }
}