package be.event.smartbooking.service;

import be.event.smartbooking.dto.ReviewStatsDTO;
import be.event.smartbooking.errorHandler.BusinessException;
import be.event.smartbooking.model.Review;
import be.event.smartbooking.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReviewService {

    private final ReviewRepository reviewRepository;

    // --- LOGIQUE PUBLIQUE ---

    /**
     * Ajoute un avis.
     * 
     * @throws BusinessException 409 si l'utilisateur a déjà voté pour ce spectacle.
     */
   @Transactional
public Review addReview(Review review) {
    // 1. "Fast-fail" : Vérification rapide pour éviter de solliciter la DB inutilement
    if (reviewRepository.existsByUserIdAndShowId(review.getUser().getId(), review.getShow().getId())) {
        throw new BusinessException("Vous avez déjà posté un avis sur ce spectacle.", HttpStatus.CONFLICT);
    }

    // 2. Par défaut : en attente de modération
    review.setValidated(false);

    try {
        log.info("Tentative de création d'avis pour le spectacle ID: {}", review.getShow().getId());
        return reviewRepository.save(review);
    } catch (DataIntegrityViolationException e) {
        // 3. Gestion de la concurrence : Si une autre requête a inséré l'avis 
        // juste entre notre check (étape 1) et notre sauvegarde (étape 2).
        log.warn("Doublon détecté par la base de données (Race Condition) pour l'utilisateur {}", review.getUser().getId());
        throw new BusinessException("Vous avez déjà posté un avis sur ce spectacle.", HttpStatus.CONFLICT);
    }
}

    public List<Review> getValidatedReviewsByShow(Long showId) {
        return reviewRepository.findByShowIdAndValidatedTrueOrderByCreatedAtDesc(showId);
    }

    // --- LOGIQUE ADMIN ---

    public List<Review> getPendingReviews() {
        return reviewRepository.findByValidatedFalseOrderByCreatedAtDesc();
    }

    /**
     * Valide un avis pour qu'il apparaisse publiquement.
     */
    @Transactional
    public void validateReview(Long reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(
                        () -> new BusinessException("Avis introuvable (ID: " + reviewId + ")", HttpStatus.NOT_FOUND));

        review.setValidated(true);
        log.info("Avis ID {} validé par l'admin.", reviewId);
    }

    /**
     * Supprime un avis (rejet de modération ou suppression simple).
     */
    @Transactional
    public void deleteReview(Long reviewId) {
        if (!reviewRepository.existsById(reviewId)) {
            throw new BusinessException("Suppression impossible : l'avis n'existe pas.", HttpStatus.NOT_FOUND);
        }
        reviewRepository.deleteById(reviewId);
        log.warn("Avis ID {} supprimé.", reviewId);
    }

    /**
     * Récupère les stats pour le Dashboard Admin.
     */
    public ReviewStatsDTO getGlobalStats() {
        Double average = reviewRepository.getGlobalAverageRating();
        return ReviewStatsDTO.builder()
                .totalReviews(reviewRepository.count())
                .pendingReviews(reviewRepository.countByValidatedFalse())
                .validatedReviews(reviewRepository.countByValidatedTrue())
                .globalAverage(average != null ? average : 0.0) // Évite le null si pas d'avis
                .build();
    }
}