package be.event.smartbooking.repository;

import be.event.smartbooking.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    // Pour l'affichage public
    List<Review> findByShowIdAndValidatedTrueOrderByCreatedAtDesc(Long showId);

    // Pour la modération Admin
    List<Review> findByValidatedFalseOrderByCreatedAtDesc();

    // Calcul de la moyenne (utile pour mettre à jour le Show si besoin)
    @Query("SELECT AVG(r.stars) FROM Review r WHERE r.show.id = :showId AND r.validated = true")
    Double getAverageRatingForShow(Long showId);

    // La méthode la plus efficace pour vérifier le doublon
    boolean existsByUserIdAndShowId(Long userId, Long showId);

    // Compter les avis en attente
    long countByValidatedFalse();

    // Compter les avis validés
    long countByValidatedTrue();

    // Calculer la moyenne de TOUS les avis validés sur TOUTE la plateforme
    @Query("SELECT AVG(r.stars) FROM Review r WHERE r.validated = true")
    Double getGlobalAverageRating();
}