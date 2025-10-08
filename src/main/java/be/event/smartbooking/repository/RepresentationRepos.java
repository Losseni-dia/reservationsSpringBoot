package be.event.smartbooking.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.repository.CrudRepository;

import be.event.smartbooking.model.Location;
import be.event.smartbooking.model.Representation;
import be.event.smartbooking.model.Show;

public interface RepresentationRepos extends CrudRepository<Representation, Long> {
    List<Representation> findByShow(Show show);

    List<Representation> findByLocation(Location location);

    List<Representation> findByWhen(LocalDateTime when);
}
