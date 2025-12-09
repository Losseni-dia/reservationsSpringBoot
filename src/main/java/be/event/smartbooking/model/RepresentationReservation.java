package be.event.smartbooking.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "representation_reservations", uniqueConstraints = @UniqueConstraint(columnNames = { "representation_id",
        "reservation_id", "price_id" }))
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RepresentationReservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "representation_id", nullable = false)
    private Representation representation;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "reservation_id", nullable = false)
    private Reservation reservation;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "price_id", nullable = false)
    private Price price;

    @Column(nullable = false)
    private Integer quantity = 1; // nombre de places pour ce prix
}