package be.event.smartbooking.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "representation_reservations", uniqueConstraints = @UniqueConstraint(columnNames = { "representation_id",
        "reservation_id", "price_id" }))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RepresentationReservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "representation_id", referencedColumnName = "id", nullable = false)
    private Representation representation;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "reservation_id", referencedColumnName = "id", nullable = false)
    private Reservation reservation;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "price_id", referencedColumnName = "id", nullable = false)
    private Price price;

    @Builder.Default
    @Column(nullable = false)
    private Integer quantity = 1;
}