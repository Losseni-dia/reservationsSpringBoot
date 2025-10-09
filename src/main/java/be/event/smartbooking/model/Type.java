package be.event.smartbooking.model;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Entity
@Table(name = "types")
public class Type {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String type;

    @JsonBackReference
    @ManyToMany
	@JoinTable(
		  name = "artist_type", 
		  joinColumns = @JoinColumn(name = "type_id"), 
		  inverseJoinColumns = @JoinColumn(name = "artist_id"))
    private List<Artist> artists = new ArrayList<>();


    //Méthodes
    public List<Artist> getArtists() {
        return artists;
    }

    public Type addArtist(Artist artist) {
        if (!this.artists.contains(artist)) {
            this.artists.add(artist);
            artist.addType(this);
        }

        return this;
    }

    public Type removeType(Artist artist) {
        if (this.artists.contains(artist)) {
            this.artists.remove(artist);
            artist.getTypes().remove(this);
        }

        return this;
    }
    
}
