package be.event.smartbooking.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@Entity
@Table(name = "tags")
public class Tag {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 30)
    private String tag;

    @JsonBackReference
    @ManyToMany(mappedBy = "tags")
    private List<Show> shows = new ArrayList<>();

    public Tag(String tag) {
        this.tag = tag;
    }
}
