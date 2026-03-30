package be.event.smartbooking.repository;

import be.event.smartbooking.model.RepresentationReservation;
import be.event.smartbooking.model.Reservation;
import be.event.smartbooking.model.enumeration.StatutReservation;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface RepresentationReservationRepository
        extends JpaRepository<RepresentationReservation, Long> {
                
        List<RepresentationReservation> findByReservation(Reservation reservation);

        @Query("SELECT rr FROM RepresentationReservation rr " +
       "JOIN FETCH rr.representation repr " +
       "JOIN FETCH repr.show " +
       "JOIN FETCH rr.price " +
       "WHERE rr.reservation = :res")
List<RepresentationReservation> findByReservationWithDetails(@Param("res") Reservation res);

        /**
         * Somme des montants (tarif unitaire × quantité) pour les réservations au statut donné (ex. CONFIRMED = payé).
         */
        @Query("SELECT COALESCE(SUM(p.amount * rr.quantity), 0.0) FROM RepresentationReservation rr "
                        + "JOIN rr.reservation r JOIN rr.price p WHERE r.statut = :statut")
        Double sumTotalRevenueByReservationStatus(@Param("statut") StatutReservation statut);
}