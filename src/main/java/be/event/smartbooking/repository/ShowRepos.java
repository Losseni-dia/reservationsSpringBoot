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


/**
     * Pour le CATALOGUE PUBLIC :
     * Récupère les spectacles selon un statut précis (généralement CONFIRME)
     * avec chargement du lieu pour éviter les erreurs 500.
     */
    @Query("SELECT s FROM Show s LEFT JOIN FETCH s.location WHERE s.status = :status")
    List<Show> findAllWithLocationAndStatus(@Param("status") ShowStatus status);

    /**
     * Pour l'ADMINISTRATION :
     * Récupère TOUS les spectacles avec leurs lieux, sans aucun filtre de statut.
     * C'est cette méthode qu'il faudra utiliser pour ton tableau React Admin.
     */
    @Query("SELECT s FROM Show s LEFT JOIN FETCH s.location")
    List<Show> findAllWithLocationForAdmin();

/**
     * RECHERCHE FILTRÉE :
     * Permet de chercher des spectacles en forçant un statut (CONFIRME pour le public).
     */
    @Query("SELECT DISTINCT s FROM Show s " +
           "LEFT JOIN FETCH s.location l " +
           "LEFT JOIN s.representations r " +
           "WHERE (:title IS NULL OR LOWER(s.title) LIKE LOWER(CONCAT('%', :title, '%'))) " +
           "AND (:location IS NULL OR LOWER(l.designation) LIKE LOWER(CONCAT('%', :location, '%'))) " +
           "AND (:start IS NULL OR r.when >= :start) " +
           "AND (:end IS NULL OR r.when < :end) " +
           "AND s.status = :status")
    List<Show> searchShows(@Param("title") String title,
                           @Param("location") String location,
                           @Param("start") LocalDateTime start,
                           @Param("end") LocalDateTime end,
                           @Param("status") ShowStatus status);
}
