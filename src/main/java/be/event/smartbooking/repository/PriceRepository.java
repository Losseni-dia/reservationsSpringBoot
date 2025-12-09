// PriceRepository.java
package be.event.smartbooking.repository;

import be.event.smartbooking.model.Price;
import be.event.smartbooking.model.Representation;
import be.event.smartbooking.model.enumeration.TypePrice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PriceRepository extends JpaRepository<Price, Long> {

    List<Price> findByRepresentationId(Long representationId);

    Optional<Price> findByRepresentationAndTypeAndStartDateLessThanEqualAndEndDateGreaterThanEqual(
            Representation representation, TypePrice type, LocalDateTime date1, LocalDateTime date2);

    // Prix actif à une date donnée
    List<Price> findByRepresentationAndStartDateLessThanEqualAndEndDateGreaterThanEqual(
            Representation representation, LocalDateTime date1, LocalDateTime date2);
}