package be.event.smartbooking.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import be.event.smartbooking.model.Video;

public interface VideoRepository extends JpaRepository<Video, Long> {
    List<Video> findByShowId(Long showId);

    // Route personnalisée : vidéos des spectacles d'un artiste par nom de famille
    @Query("SELECT v FROM Video v " +
            "JOIN v.show s " +
            "JOIN s.artistTypes at " +
            "JOIN at.artist a " +
            "WHERE LOWER(a.lastname) = LOWER(:lastname)")
    List<Video> findVideosByArtistLastname(@Param("lastname") String lastname);
}
