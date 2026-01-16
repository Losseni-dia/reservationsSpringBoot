package be.event.smartbooking.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import be.event.smartbooking.model.Location;
import be.event.smartbooking.model.Show;

public interface ShowRepos extends JpaRepository<Show, Long> {
    Show findBySlug(String slug);

    Show findByTitle(String title);

    List<Show> findByLocation(Location location);

    @Query("SELECT s FROM Show s LEFT JOIN FETCH s.location")
    List<Show> findAllWithLocation();


    @Query("SELECT DISTINCT s FROM Show s " +
           "LEFT JOIN FETCH s.location l " +
           "LEFT JOIN s.representations r " +
           "WHERE (:title IS NULL OR LOWER(s.title) LIKE LOWER(CONCAT('%', :title, '%'))) " +
           "AND (:location IS NULL OR LOWER(l.designation) LIKE LOWER(CONCAT('%', :location, '%'))) " +
           "AND (:date IS NULL OR CAST(r.when AS string) LIKE CONCAT(:date, '%'))")
    List<Show> searchShows(@Param("title") String title, 
                           @Param("location") String location, 
                           @Param("date") String date);
}
