package be.event.smartbooking.repository;

import be.event.smartbooking.model.Artist;
import be.event.smartbooking.model.ArtistLanguage;
import be.event.smartbooking.model.enumeration.LanguageLevel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ArtistLanguageRepository extends JpaRepository<ArtistLanguage, Long> {

    /**
     * Requête JPQL pour récupérer directement les artistes qui parlent une langue
     * spécifique à un niveau précis (ex: COURANT).
     */
    @Query("SELECT al.artist FROM ArtistLanguage al " +
            "WHERE LOWER(al.language.language) = LOWER(:languageName) " +
            "AND al.level = :level")
    List<Artist> findArtistsByLanguageAndLevel(
            @Param("languageName") String languageName,
                    @Param("level") LanguageLevel level);
            
    List<ArtistLanguage> findByArtistId(Long artistId);
}