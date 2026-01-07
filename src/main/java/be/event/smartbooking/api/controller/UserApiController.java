package be.event.smartbooking.api.controller;

import be.event.smartbooking.dto.UserProfileDto;
import be.event.smartbooking.dto.UserRegistrationDto;
import be.event.smartbooking.model.User;
import be.event.smartbooking.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
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
    public ResponseEntity<UserProfileDto> getProfile(Principal principal) {
        // Principal.getName() retourne l'email (ou login) de l'utilisateur connecté
        User user = userService.findByEmail(principal.getName());
        if (user == null)
            return ResponseEntity.notFound().build();

        UserProfileDto dto = new UserProfileDto();
        dto.setId(user.getId());
        dto.setFirstname(user.getFirstname());
        dto.setLastname(user.getLastname());
        dto.setEmail(user.getEmail());
        dto.setLangue(user.getLangue());
        dto.setLogin(user.getLogin());
        // On récupère le premier rôle pour l'affichage
        dto.setRole(user.getRoles().isEmpty() ? "MEMBER" : user.getRoles().get(0).getRole());

        return ResponseEntity.ok(dto);
    }

    // METTRE À JOUR MON PROFIL (Connecté)
    @PutMapping("/profile")
    public ResponseEntity<String> updateProfile(@Valid @RequestBody UserProfileDto profileDto, Principal principal) {
        User user = userService.findByEmail(principal.getName());
        profileDto.setId(user.getId()); // Sécurité : on force l'ID de l'utilisateur connecté

        userService.updateUserFromDto(profileDto);
        return ResponseEntity.ok("Profil mis à jour avec succès");
    }
}