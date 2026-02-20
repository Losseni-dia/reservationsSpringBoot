package be.event.smartbooking.service;

import be.event.smartbooking.model.ApiKey;
import be.event.smartbooking.model.User;
import be.event.smartbooking.repository.ApiKeyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.util.Base64;
import java.util.Optional;

@Service
public class ApiKeyService {

    @Autowired
    private ApiKeyRepository repository;

    // Génère une clé aléatoire sécurisée
    @Transactional
    public ApiKey generateApiKey(User user, String name) {
        String key = "sk_" + generateRandomString(32);
        
        ApiKey apiKey = ApiKey.builder()
                .keyValue(key)
                .name(name)
                .user(user)
                .active(true)
                .build();
        
        return repository.save(apiKey);
    }

    // Vérifie si une clé est valide
    @Transactional(readOnly = true)
    public Optional<User> validateKey(String key) {
        return repository.findByKeyValue(key)
                .filter(ApiKey::isActive) // Vérifie qu'elle est active
                .map(apiKey -> {
                    User user = apiKey.getUser();
                    // FORCE le chargement des rôles tant que la connexion DB est ouverte (Le Fix est ici !)
                    user.getRoles().size(); 
                    return user;
                });
    }

    private String generateRandomString(int length) {
        SecureRandom random = new SecureRandom();
        byte[] bytes = new byte[length];
        random.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }
}