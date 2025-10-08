package be.event.smartbooking.repository;

import java.util.Optional;

import org.springframework.data.repository.CrudRepository;

import be.event.smartbooking.model.Location;

public interface LocationRepos extends CrudRepository<Location, Long> {
    Location findByDesignation(String designation);

    Optional<Location> findById(Long id);
}
