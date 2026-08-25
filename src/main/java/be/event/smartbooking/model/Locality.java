package be.event.smartbooking.model;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@NoArgsConstructor
@Entity
@Table(name = "localities") 
public class Locality {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "postal_code")
    private Long postalCode;
    
    private String locality;

    @OneToMany(targetEntity = Location.class, mappedBy = "locality")
    @ToString.Exclude        // <-- INDISPENSABLE pour Lombok
    @EqualsAndHashCode.Exclude // <-- INDISPENSABLE pour éviter les boucles de calcul
    @JsonIgnore
    private List<Location> locations = new ArrayList<>();

    public Locality addLocation(Location location) {
        if (!this.locations.contains(location)) {
            this.locations.add(location);
            location.setLocality(this);
        }

        return this;
    }

    public Locality removeLocation(Location location) {
        if (this.locations.contains(location)) {
            this.locations.remove(location);
            if (location.getLocality().equals(this)) {
                location.setLocality(null);
            }
        }

        return this;
    }
    
}
