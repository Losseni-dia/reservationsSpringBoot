// ReviewRepository.java
package be.event.smartbooking.repository;

import be.event.smartbooking.model.Review;
import be.event.smartbooking.model.Show;
import be.event.smartbooking.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    Optional<Review> findByUserAndShow(User user, Show show);

    List<Review> findByShowIdAndValidatedTrueOrderByCreatedAtDesc(Long showId);

    List<Review> findByValidatedFalseOrderByCreatedAtDesc(); // Pour modération

    long countByShowIdAndValidatedTrue(Long showId);

    @Query("SELECT AVG(r.stars) FROM Review r WHERE r.show.id = :showId AND r.validated = true")
    Double getAverageRatingForShow(Long showId);


    // Vérifier si un utilisateur a déjà voté pour ce spectacle
    boolean existsByUserIdAndShowId(Long userId, Long showId);
}