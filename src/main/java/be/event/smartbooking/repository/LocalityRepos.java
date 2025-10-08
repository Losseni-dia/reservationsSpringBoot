package be.event.smartbooking.repository;

import org.springframework.data.repository.CrudRepository;

import be.event.smartbooking.model.Locality;

public interface LocalityRepos extends CrudRepository<Locality, Long> {
    Locality findByPostalCode(Long postalCode);
    Locality findByLocality(String locality);
    
}
