package be.event.smartbooking.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.github.slugify.Slugify;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Entity
@Table(name="shows")
public class Show {
	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	private Long id;

	@Column(unique=true)
	private String slug;

	private String title;
	private String description;

	@Column(name="poster_url")
	private String posterUrl;
	
	/**
	 * Lieu de création du spectacle
	 */
	@ManyToOne
	@JoinColumn(name="location_id", nullable=true)
	private Location location;
	
	private boolean bookable;
	private double price;
	
	/**
	 * Date de création du spectacle
	 */
	@Column(name="created_at")
	private LocalDateTime createdAt;
	
	/**
	 * Date de modification du spectacle
	 */
	@Column(name="updated_at")
	private LocalDateTime updatedAt;
	
	
	@OneToMany(targetEntity=Representation.class, mappedBy="show")
	private List<Representation> representations = new ArrayList<>();

    
    @PrePersist
    @PreUpdate
	public void generateSlug() {
		if (title != null && !title.isBlank()) {
			Slugify slg = Slugify.builder().build();
			this.slug = slg.slugify(title);
		}
	}
	
	public List<Representation> getRepresentations() {
		return representations;
	}

	public Show addRepresentation(Representation representation) {
		if (!this.representations.contains(representation)) {
			this.representations.add(representation);
			representation.setShow(this);
		}

		return this;
	}

	public Show removeRepresentation(Representation representation) {
		if (this.representations.contains(representation)) {
			this.representations.remove(representation);
			if (representation.getLocation().equals(this)) {
				representation.setLocation(null);
			}
		}

		return this;
	}

	@Override
	public String toString() {
		return "Show [id=" + id + ", slug=" + slug + ", title=" + title
				+ ", description=" + description + ", posterUrl=" + posterUrl + ", location="
				+ location + ", bookable=" + bookable + ", price=" + price
				+ ", createdAt=" + createdAt + ", updatedAt=" + updatedAt
				+ ", representations=" + representations.size() + "]";
	}

    
}
