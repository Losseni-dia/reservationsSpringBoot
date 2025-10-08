package be.event.smartbooking.model;
import lombok.Data;
import lombok.NoArgsConstructor;

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

@Entity
@Table(name = "locations")
@Data
@NoArgsConstructor
public class Location {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(unique = true)
    private String slug;

    private String designation;
    private String address;

    @ManyToOne
    @JoinColumn(name = "locality_id", nullable = false)
    private Locality locality;

    private String website;
    private String phone;

    
	@OneToMany(targetEntity=Show.class, mappedBy="location")
	private List<Show> shows = new ArrayList<>();
    
    @PrePersist
    @PreUpdate
    public void generateSlug() {
        if (designation != null && !designation.isBlank()) {
            Slugify slg = Slugify.builder().build();
            this.slug = slg.slugify(designation);
        }
    }

    public List<Show> getShows() {
        return shows;
    }

    public Location addShow(Show show) {
        if (!this.shows.contains(show)) {
            this.shows.add(show);
            show.setLocation(this);
        }

        return this;
    }

    public Location removeShow(Show show) {
        if (this.shows.contains(show)) {
            this.shows.remove(show);
            if (show.getLocation().equals(this)) {
                show.setLocation(null);
            }
        }

        return this;
    }
}
