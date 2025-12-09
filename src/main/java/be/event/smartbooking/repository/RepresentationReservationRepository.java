// RepresentationReservationRepository.java
package be.event.smartbooking.repository;

import be.event.smartbooking.model.RepresentationReservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RepresentationReservationRepository
        extends JpaRepository<RepresentationReservation, Long> {
}