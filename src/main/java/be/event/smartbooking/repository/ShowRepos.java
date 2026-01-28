package be.event.smartbooking.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import be.event.smartbooking.model.Location;
import be.event.smartbooking.model.Show;
import be.event.smartbooking.model.enumeration.ShowStatus;

public interface ShowRepos extends JpaRepository<Show, Long> {
    Show findBySlug(String slug);

    Show findByTitle(String title);

    List<Show> findByLocation(Location location);

    // Pour récupérer uniquement les spectacles confirmés (Catalogue simple)
    List<Show> findByStatus(ShowStatus status);

    @Query("SELECT s FROM Show s LEFT JOIN FETCH s.location WHERE s.status = 'CONFIRME'")
    List<Show> findAllWithLocationAndConfirmed();

    @Query("SELECT DISTINCT s FROM Show s " +
           "LEFT JOIN FETCH s.location l " +
           "LEFT JOIN s.representations r " +
           "WHERE (:title IS NULL OR LOWER(s.title) LIKE LOWER(CONCAT('%', :title, '%'))) " +
           "AND (:location IS NULL OR LOWER(l.designation) LIKE LOWER(CONCAT('%', :location, '%'))) " +
            "AND (:start IS NULL OR r.when >= :start) " +
            "AND (:end IS NULL OR r.when < :end)")
    List<Show> searchShows(@Param("title") String title,
                           @Param("location") String location,
                           @Param("start") LocalDateTime start,
                           @Param("end") LocalDateTime end);
}
