package be.event.smartbooking.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "representations")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Representation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "show_id", nullable = false)
    private Show show;

    @Column(nullable = false)
    private LocalDateTime when; // date et heure de la représentation

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "location_id")
    private Location location;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    // =================================================================
    // RELATIONS CORRECTES
    // =================================================================

    // 1. Prix disponibles pour cette représentation
    @OneToMany(mappedBy = "representation", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Price> prices = new ArrayList<>();

    // 2. Réservations détaillées (via la table d'association)
    @OneToMany(mappedBy = "representation", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<RepresentationReservation> reservations = new ArrayList<>();

    // =================================================================
    // MÉTHODES UTILITAIRES
    // =================================================================

    public void addPrice(Price price) {
        prices.add(price);
        price.setRepresentation(this);
    }

    public void removePrice(Price price) {
        prices.remove(price);
        price.setRepresentation(null);
    }

    public void addReservationItem(RepresentationReservation item) {
        reservations.add(item);
        item.setRepresentation(this);
    }

    public void removeReservationItem(RepresentationReservation item) {
        reservations.remove(item);
        item.setRepresentation(null);
    }

    // Méthode pratique : récupérer tous les utilisateurs ayant réservé (même
    // plusieurs fois)
    public List<User> getReservedUsers() {
        return reservations.stream()
                .map(item -> item.getReservation().getUser())
                .distinct()
                .toList();
    }

    // Nombre total de places réservées
    public int getTotalReservedSeats() {
        return reservations.stream()
                .mapToInt(RepresentationReservation::getQuantity)
                .sum();
    }

   
}