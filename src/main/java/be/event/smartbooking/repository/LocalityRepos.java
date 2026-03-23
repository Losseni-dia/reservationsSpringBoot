package be.event.smartbooking.repository;

import java.util.Optional;

import org.springframework.data.repository.CrudRepository;

import be.event.smartbooking.model.Locality;

public interface LocalityRepos extends CrudRepository<Locality, Long> {
    Locality findByPostalCode(Long postalCode);
   
    Optional<Locality> findByLocality(String locality);
    
}
