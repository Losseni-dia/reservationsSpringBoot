package be.event.smartbooking.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import be.event.smartbooking.model.Location;
import be.event.smartbooking.model.Show;

public interface ShowRepos extends JpaRepository<Show, Long> {
    Show findBySlug(String slug);

    Show findByTitle(String title);

    List<Show> findByLocation(Location location);
}
