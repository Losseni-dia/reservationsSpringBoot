// RepresentationReservationRepository.java
package be.event.smartbooking.repository;

import be.event.smartbooking.model.RepresentationReservation;
import be.event.smartbooking.model.Reservation;

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
}