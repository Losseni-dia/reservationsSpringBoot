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
        // 0. Sécurité : Vérifier que les objets ne sont pas null avant d'appeler
        // .getId()
        if (review.getUser() == null || review.getShow() == null) {
            log.error("Tentative d'ajout d'avis avec des données manquantes.");
            throw new BusinessException("Données de l'avis incomplètes.", HttpStatus.BAD_REQUEST);
        }

        // 1. "Fast-fail" : Vérification rapide pour éviter les doublons
        if (reviewRepository.existsByUserIdAndShowId(review.getUser().getId(), review.getShow().getId())) {
            throw new BusinessException("Vous avez déjà posté un avis sur ce spectacle.", HttpStatus.CONFLICT);
        }

        // 2. Initialisation des valeurs par défaut
        review.setValidated(false); // En attente de modération admin

        // On s'assure d'avoir une date si elle n'a pas été fixée dans le contrôleur
        if (review.getCreatedAt() == null) {
            review.setCreatedAt(java.time.LocalDateTime.now());
        }

        try {
            log.info("🚀 Création d'un avis pour le spectacle ID: {} par l'utilisateur: {}",
                    review.getShow().getId(), review.getUser().getLogin());

            return reviewRepository.save(review);

        } catch (DataIntegrityViolationException e) {
            // 3. Gestion de la concurrence (Race Condition)
            // Si deux clics rapides surviennent, la contrainte unique de la DB nous sauve
            // ici
            log.warn("Doublon détecté par la base de données pour l'utilisateur ID: {}", review.getUser().getId());
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

    /**
     * Récupère uniquement les avis en attente pour les spectacles d'un producteur
     * précis.
     */
    public List<Review> getPendingReviewsForProducer(String producerLogin) {
        log.info("Récupération des avis en attente pour le producteur : {}", producerLogin);
        return reviewRepository.findByValidatedFalseAndShowProducerLoginOrderByCreatedAtDesc(producerLogin);
    }
}