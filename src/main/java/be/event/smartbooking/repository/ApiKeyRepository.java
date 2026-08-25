package be.event.smartbooking.repository;

import be.event.smartbooking.model.ApiKey;
import org.springframework.data.repository.CrudRepository;
import java.util.Optional;

public interface ApiKeyRepository extends CrudRepository<ApiKey, Long> {
    Optional<ApiKey> findByKeyValue(String keyValue);
}