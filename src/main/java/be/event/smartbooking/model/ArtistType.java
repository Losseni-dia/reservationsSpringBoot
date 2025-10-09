package be.event.smartbooking.model;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Entity
@Table(name="artist_type")
public class ArtistType {
	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	private Long id;

	@ManyToOne
	@JoinColumn(name="artist_id", nullable=false)
	private Artist artist;
	
	@ManyToOne
	@JoinColumn(name="type_id", nullable=false)
	private Type type;
	
	@ManyToMany(targetEntity=Show.class)
	@JoinTable(
		name = "artist_type_show", 
		joinColumns = @JoinColumn(name = "artist_type_id"), 
        inverseJoinColumns = @JoinColumn(name = "show_id"))
    private List<Show> shows = new ArrayList<>();

    public List<Show> getShows() {
		return shows;
	}
	
	public ArtistType addShow(Show show) {
		if(!this.shows.contains(show)) {
			this.shows.add(show);
			show.addArtistType(this);
		}
		
		return this;
	}
	
	public ArtistType removeShow(Show show) {
		if(this.shows.contains(show)) {
			this.shows.remove(show);
			show.getArtistTypes().remove(this);
		}
		
		return this;
	}


    
}
