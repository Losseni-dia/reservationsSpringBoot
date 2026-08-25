package be.event.smartbooking.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.fasterxml.jackson.annotation.JsonBackReference;

import java.time.LocalDateTime;

@Entity
@Table(name = "reviews", uniqueConstraints = {
        @UniqueConstraint(columnNames = { "user_id", "show_id" }) // Un user = 1 avis par spectacle
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    @ToString.Exclude // <-- AJOUTE CECI
    @EqualsAndHashCode.Exclude
    private User user;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "show_id", nullable = false)
    @JsonBackReference // <-- BRISE LA BOUCLE JSON
    @ToString.Exclude // <-- BRISE LA BOUCLE LOMBOK (toString)
    @EqualsAndHashCode.Exclude
    private Show show;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String comment;

    @Column(nullable = false)
    private Integer stars; // 1 à 5

    @Builder.Default
    @Column(nullable = false)
    private Boolean validated = false; // Modération admin

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Contrainte de validation
    @PrePersist
    @PreUpdate
    private void validateStars() {
        if (stars == null || stars < 1 || stars > 5) {
            throw new IllegalArgumentException("Les étoiles doivent être entre 1 et 5");
        }
    }
}