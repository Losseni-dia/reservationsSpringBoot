package be.event.smartbooking.service;

import be.event.smartbooking.dto.ReviewStatsDTO;
import be.event.smartbooking.model.Review;
import be.event.smartbooking.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReviewService {

    private final ReviewRepository reviewRepository;

    // --- LOGIQUE PUBLIQUE ---

    @Transactional
    public Review addReview(Review review) {
        // 1. Vérification de doublon (Utilise l'ID pour la performance)
        if (reviewRepository.existsByUserIdAndShowId(review.getUser().getId(), review.getShow().getId())) {
            throw new RuntimeException("Vous avez déjà posté un avis sur ce spectacle.");
        }

        // 2. Par défaut : en attente de modération (false)
        // Si tu veux que ce soit automatique, mets true ici.
        review.setValidated(false);

        return reviewRepository.save(review);
    }

    public List<Review> getValidatedReviewsByShow(Long showId) {
        return reviewRepository.findByShowIdAndValidatedTrueOrderByCreatedAtDesc(showId);
    }

    // --- LOGIQUE ADMIN ---

    public List<Review> getPendingReviews() {
        return reviewRepository.findByValidatedFalseOrderByCreatedAtDesc();
    }

    @Transactional
    public void validateReview(Long reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Avis non trouvé"));
        review.setValidated(true);
    }

    @Transactional
    public void deleteReview(Long reviewId) {
        reviewRepository.deleteById(reviewId);
    }


    public ReviewStatsDTO getGlobalStats() {
        return ReviewStatsDTO.builder()
                .totalReviews(reviewRepository.count())
                .pendingReviews(reviewRepository.countByValidatedFalse())
                .validatedReviews(reviewRepository.countByValidatedTrue())
                .globalAverage(reviewRepository.getGlobalAverageRating())
                .build();
    }
}