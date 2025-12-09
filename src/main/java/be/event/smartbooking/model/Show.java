package be.event.smartbooking.model;

import com.github.slugify.Slugify;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "shows")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Show {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(unique = true, nullable = false)
	private String slug;

	@Column(nullable = false)
	private String title;

	@Column(columnDefinition = "TEXT")
	private String description;

	@Column(name = "poster_url")
	private String posterUrl;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "location_id")
	private Location location;

	@Column(nullable = false)
	private boolean bookable = true;

	// Supprimé le champ "price" → les prix sont maintenant gérés via Price +
	// Representation !
	// private double price;

	@CreationTimestamp
	@Column(name = "created_at", updatable = false)
	private LocalDateTime createdAt;

	@UpdateTimestamp
	@Column(name = "updated_at")
	private LocalDateTime updatedAt;

	// =================================================================
	// RELATIONS
	// =================================================================

	@OneToMany(mappedBy = "show", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<Representation> representations = new ArrayList<>();

	@OneToMany(mappedBy = "show", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<Review> reviews = new ArrayList<>();

	@ManyToMany
	@JoinTable(name = "show_artist_types", joinColumns = @JoinColumn(name = "show_id"), inverseJoinColumns = @JoinColumn(name = "artist_type_id"))
	private List<ArtistType> artistTypes = new ArrayList<>();

	// =================================================================
	// SLUG AUTOMATIQUE
	// =================================================================

	@PrePersist
	@PreUpdate
	public void generateSlug() {
		if (title != null && !title.isBlank()) {
			Slugify slugify = Slugify.builder().lowerCase(true).build();
			this.slug = slugify.slugify(title);
		}
	}

	// =================================================================
	// MÉTHODES UTILITAIRES
	// =================================================================

	public void addRepresentation(Representation representation) {
		representations.add(representation);
		representation.setShow(this);
	}

	public void removeRepresentation(Representation representation) {
		representations.remove(representation);
		representation.setShow(null);
	}

	public void addArtistType(ArtistType artistType) {
		artistTypes.add(artistType);
		artistType.getShows().add(this);
	}

	public void removeArtistType(ArtistType artistType) {
		artistTypes.remove(artistType);
		artistType.getShows().remove(this);
	}

	public void addReview(Review review) {
		reviews.add(review);
		review.setShow(this);
	}

	// Note de moyenne
	public Double getAverageRating() {
		return reviews.isEmpty() ? null
				: reviews.stream()
						.mapToInt(Review::getStars)
						.average()
						.orElse(0.0);
	}

	public Long getReviewCount() {
		return (long) reviews.size();
	}
}