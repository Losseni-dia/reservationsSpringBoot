package be.event.smartbooking.controller;

import be.event.smartbooking.model.ApiKey;
import be.event.smartbooking.model.User;
import be.event.smartbooking.repository.UserRepos;
import be.event.smartbooking.service.ApiKeyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users/keys")
public class ApiKeyController {

    @Autowired
    private ApiKeyService apiKeyService;

    @Autowired
    private UserRepos userRepository;

    // Générer une clé pour l'utilisateur connecté
    @PostMapping
    public ResponseEntity<?> createKey(@RequestBody Map<String, String> body, Principal principal) {
        User user = userRepository.findByLogin(principal.getName());
        if (user == null) return ResponseEntity.status(401).build();

        String name = body.getOrDefault("name", "Ma clé API");
        ApiKey key = apiKeyService.generateApiKey(user, name);
        return ResponseEntity.ok(key);
    }

    // Lister les clés de l'utilisateur
    @GetMapping
    public List<ApiKey> getMyKeys(Principal principal) {
        User user = userRepository.findByLogin(principal.getName());
        return user.getApiKeys();
    }

    // Supprimer une clé API
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteKey(@PathVariable Long id, Principal principal) {
        User user = userRepository.findByLogin(principal.getName());
        if (user == null) return ResponseEntity.status(401).build();

        try {
            apiKeyService.deleteApiKey(id, user);
            return ResponseEntity.ok().build(); // 200 OK
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}