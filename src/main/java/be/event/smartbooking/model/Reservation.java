package be.event.smartbooking.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import be.event.smartbooking.model.enumeration.StatutReservation;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "reservations")
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column( name="reservation_date", nullable = false)
    private LocalDateTime reservationDate = LocalDateTime.now();

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatutReservation statut = StatutReservation.PENDING;

    // Relation : Une réservation appartient à un seul utilisateur
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Optionnel : timestamp de création
    @Column(updatable = false)
    @CreationTimestamp
    private LocalDateTime createdAt;

    // AJOUTE CECI :
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "representation_id", nullable = false)
    private Representation representation;
}