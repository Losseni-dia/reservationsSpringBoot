package be.event.smartbooking.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import be.event.smartbooking.model.Artist;

public interface ArtistRepos extends CrudRepository<Artist, Long> {
    List<Artist> findByLastname(String lastname);

    @Query("SELECT DISTINCT a FROM Artist a LEFT JOIN FETCH a.types ORDER BY a.id")
    List<Artist> findAllWithTypes();

    @Query("SELECT DISTINCT a FROM Artist a LEFT JOIN FETCH a.types WHERE a.id = :id")
    Optional<Artist> findByIdWithTypes(@Param("id") Long id);
}
