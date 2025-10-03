package be.event.smartbooking.repository;

import java.util.List;

import org.springframework.data.repository.CrudRepository;

import be.event.smartbooking.model.Artist;

public interface ArtistRepos extends CrudRepository<Artist, Long> {
    List<Artist> findByLastName(String lastName);
    Artist findById(long id);
}


