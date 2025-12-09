// ReviewService.java
package be.event.smartbooking.service;

import be.event.smartbooking.model.Review;
import be.event.smartbooking.model.Show;
import be.event.smartbooking.model.User;
import be.event.smartbooking.repository.ReviewRepository;
import be.event.smartbooking.repository.ShowRepos;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ShowRepos showRepository;

    @Transactional
    public Review createReview(User user, Long showId, String comment, Integer stars) {
        Show show = showRepository.findById(showId)
                .orElseThrow(() -> new RuntimeException("Spectacle non trouvé"));

        if (reviewRepository.findByUserAndShow(user, show).isPresent()) {
            throw new RuntimeException("Vous avez déjà laissé un avis pour ce spectacle");
        }

        Review review = Review.builder()
                .user(user)
                .show(show)
                .comment(comment)
                .stars(stars)
                .validated(false) // Modération
                .build();

        return reviewRepository.save(review);
    }

    public List<Review> getValidatedReviewsByShow(Long showId) {
        return reviewRepository.findByShowIdAndValidatedTrueOrderByCreatedAtDesc(showId);
    }

    public List<Review> getPendingReviews() {
        return reviewRepository.findByValidatedFalseOrderByCreatedAtDesc();
    }

    @Transactional
    public Review validateReview(Long reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Avis non trouvé"));
        review.setValidated(true);
        return reviewRepository.save(review);
    }

    @Transactional
    public void deleteReview(Long reviewId) {
        reviewRepository.deleteById(reviewId);
    }
}