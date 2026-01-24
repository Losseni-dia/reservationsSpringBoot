package be.event.smartbooking.repository;

import be.event.smartbooking.model.ArtistType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ArtistTypeRepos extends JpaRepository<ArtistType, Long> {
    // Hérite de findAllById(Iterable<Long> ids) automatiquement
}