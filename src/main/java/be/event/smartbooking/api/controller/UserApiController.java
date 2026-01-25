package be.event.smartbooking.api.controller;

import be.event.smartbooking.dto.UserProfileDto;
import be.event.smartbooking.dto.UserRegistrationDto;
import be.event.smartbooking.model.PasswordResetToken;
import be.event.smartbooking.model.User;
import be.event.smartbooking.service.EmailService;
import be.event.smartbooking.service.PasswordResetTokenService;
import be.event.smartbooking.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserApiController {

    @Autowired
    private UserService userService;

    @Autowired
    private PasswordResetTokenService tokenService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private PasswordEncoder passwordEncoder;

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

    // MOT DE PASSE OUBLIÉ (Public)
    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        User user = userService.findByEmail(email);
        if (user != null) {
            PasswordResetToken token = tokenService.createTokenForUser(user);
            emailService.sendPasswordResetMail(user.getEmail(), token.getToken());
        }
        return ResponseEntity.ok("Si un compte existe avec cet email, un lien a été envoyé.");
    }

    // RÉINITIALISATION MOT DE PASSE (Public)
    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody Map<String, String> request) {
        String token = request.get("token");
        String password = request.get("password");

        User user = tokenService.validatePasswordResetToken(token);

        if (user == null) {
            return ResponseEntity.badRequest().body("Token invalide ou expiré");
        }

        user.setPassword(passwordEncoder.encode(password));
        userService.updateUser(user.getId(), user);

        tokenService.deleteToken(token);

        return ResponseEntity.ok("Mot de passe réinitialisé avec succès.");
    }
    

    // LISTER TOUS LES USERS (Admin seulement)
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')") // Sécurité au niveau méthode
    public ResponseEntity<List<UserProfileDto>> getAllUsers() {
        List<User> users = userService.getAllUsers();

        // On convertit les entités en DTO pour ne pas envoyer les mots de passe !
        List<UserProfileDto> dtos = users.stream().map(user -> {
            UserProfileDto dto = new UserProfileDto();
            dto.setId(user.getId());
            dto.setFirstname(user.getFirstname());
            dto.setLastname(user.getLastname());
            dto.setEmail(user.getEmail());
            dto.setLogin(user.getLogin());
            dto.setLangue(user.getLangue());
            if (user.getRoles() != null && !user.getRoles().isEmpty()) {
                dto.setRole(user.getRoles().get(0).getRole());
            }
            return dto;
        }).toList();

        return ResponseEntity.ok(dtos);
    }

    // SUPPRIMER UN USER (Admin seulement)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")// Sécurité au niveau méthode
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id); // Assure-toi d'avoir cette méthode dans ton service
        return ResponseEntity.noContent().build();
    }
}