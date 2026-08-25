package be.event.smartbooking.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@Entity
@Table(name = "troupes")
public class Troupe {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 60)
    private String name;

    @Column(name = "logo_url", length = 255)
    private String logoUrl;

    @JsonManagedReference
    @OneToMany(mappedBy = "troupe")
    private List<Artist> artists = new ArrayList<>();

    public Troupe(String name, String logoUrl) {
        this.name = name;
        this.logoUrl = logoUrl;
    }
}
