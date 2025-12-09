// ReservationRepository.java
package be.event.smartbooking.repository;

import be.event.smartbooking.model.Reservation;
import be.event.smartbooking.model.User;
import be.event.smartbooking.model.enumeration.StatutReservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    List<Reservation> findByUserOrderByCreatedAtDesc(User user);

    List<Reservation> findByUserAndStatut(User user, StatutReservation statut);

    List<Reservation> findByStatut(StatutReservation statut);
}