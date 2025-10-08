package be.event.smartbooking.repository;

import java.util.Optional;

import org.springframework.data.repository.CrudRepository;

import be.event.smartbooking.model.Type;

public interface TypeRepos extends CrudRepository<Type, Long> {
    Type findByType(String type);
    Optional<Type> findById(Long id);
    
}
