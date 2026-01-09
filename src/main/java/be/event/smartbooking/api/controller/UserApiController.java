package be.event.smartbooking.api.controller;

import be.event.smartbooking.dto.UserProfileDto;
import be.event.smartbooking.dto.UserRegistrationDto;
import be.event.smartbooking.model.User;
import be.event.smartbooking.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/users")
public class UserApiController {

    @Autowired
    private UserService userService;

    // INSCRIPTION (Public)
    @PostMapping("/register")
    public ResponseEntity<String> register(@Valid @RequestBody UserRegistrationDto registrationDto) {
        if (!userService.isLoginAndEmailAvailable(registrationDto.getLogin(), registrationDto.getEmail())) {
            return ResponseEntity.badRequest().body("Login ou Email déjà utilisé");
        }
        userService.registerFromDto(registrationDto);
        return ResponseEntity.ok("Utilisateur enregistré avec succès");
    }

    // RÉCUPÉRER MON PROFIL (Connecté)
    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Utilisateur non connecté");
        }

        // On cherche l'utilisateur (on utilise findByLogin car c'est le standard
        // getName() de Spring Security)
        User user = userService.findByLogin(principal.getName());

        // Plan B si login non trouvé
        if (user == null)
            user = userService.findByEmail(principal.getName());

        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Profil introuvable");
        }

        // Mapping DTO manuel ultra-sécurisé
        UserProfileDto dto = new UserProfileDto();
        dto.setId(user.getId());
        dto.setFirstname(user.getFirstname());
        dto.setLastname(user.getLastname());
        dto.setEmail(user.getEmail());
        dto.setLangue(user.getLangue());
        dto.setLogin(user.getLogin());

        // Sécurité sur les rôles (évite le crash Lazy Loading)
        try {
            if (user.getRoles() != null && !user.getRoles().isEmpty()) {
                dto.setRole(user.getRoles().get(0).getRole());
            } else {
                dto.setRole("MEMBER");
            }
        } catch (Exception e) {
            dto.setRole("MEMBER");
        }

        return ResponseEntity.ok(dto);
    }

    // METTRE À JOUR MON PROFIL (Connecté)
    @PutMapping("/profile")
    public ResponseEntity<String> updateProfile(@Valid @RequestBody UserProfileDto profileDto, Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Session expirée");
        }

        User user = userService.findByEmail(principal.getName());
        if (user == null)
            user = userService.findByLogin(principal.getName());

        profileDto.setId(user.getId());
        userService.updateUserFromDto(profileDto);
        return ResponseEntity.ok("Profil mis à jour avec succès");
    }
}