package be.event.smartbooking.api.controller;

import be.event.smartbooking.dto.ResetPasswordDto;
import be.event.smartbooking.dto.TicketDetail;
import be.event.smartbooking.dto.UserProfileDto;
import be.event.smartbooking.dto.UserRegistrationDto;
import be.event.smartbooking.model.PasswordResetToken;
import be.event.smartbooking.model.Ticket;
import be.event.smartbooking.model.User;
import be.event.smartbooking.repository.TicketRepository;
import be.event.smartbooking.repository.UserRepos;
import be.event.smartbooking.service.EmailService;
import be.event.smartbooking.service.PasswordResetTokenService;
import be.event.smartbooking.service.UserService;
import jakarta.validation.Valid;
import jakarta.persistence.EntityNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.security.Principal;
import java.util.List;
import java.util.Locale;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserApiController {

    private static final Logger log = LoggerFactory.getLogger(UserApiController.class);

    @Autowired
    private UserService userService;

    @Autowired
    private PasswordResetTokenService tokenService;

    @Autowired
    private UserRepos userRepos;

    @Autowired
    private TicketRepository ticketRepository;



    @Autowired
    private EmailService emailService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping("/my-tickets")
    public ResponseEntity<List<TicketDetail>> getMyTickets(Principal principal) {
        User user = userRepos.findByLogin(principal.getName());
        List<Ticket> tickets = ticketRepository.findByUserIdOrderByCreatedAtDesc(user.getId());

        List<TicketDetail> dtos = tickets.stream().map(t -> TicketDetail.builder()
                .id(t.getId())
                .qrCodeReference(t.getUniqueReference())
                .showTitle(t.getRepresentation().getShow().getTitle())
                .date(t.getRepresentation().getWhen())
                .locationName(t.getRepresentation().getLocation().getDesignation())
                .category(t.getPrice().getType().name())
                .price(t.getPrice().getAmount())
                .build()).toList();

        return ResponseEntity.ok(dtos);
    }

    // INSCRIPTION (Public)
    @PostMapping(value = "/register", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> register(
            @Valid @ModelAttribute UserRegistrationDto registrationDto,
            @RequestParam(value = "profilePictureFile", required = false) MultipartFile file) {

        if (!userService.isLoginAndEmailAvailable(registrationDto.getLogin(), registrationDto.getEmail())) {
            return ResponseEntity.badRequest().body("Login ou Email déjà utilisé");
        }

        // 1. Gestion de l'image avant l'enregistrement
        if (file != null && !file.isEmpty()) {
            try {
                String fileName = userService.saveProfilePicture(file);
                // On stocke le nom du fichier dans le DTO pour que le service l'enregistre
                registrationDto.setProfilePicture(fileName);
            } catch (Exception e) {
                return ResponseEntity.badRequest().body("Erreur lors de la sauvegarde de l'image : " + e.getMessage());
            }
        }

        // 2. Enregistrement de l'utilisateur
        userService.registerFromDto(registrationDto);

        User user = userService.findByLogin(registrationDto.getLogin());
        Locale locale = toLocale(registrationDto.getLangue());

        if (user.isActive()) {
            emailService.sendRegistrationConfirmationMail(user, locale);
            return ResponseEntity.ok("Utilisateur enregistré avec succès");
        } else {
            return ResponseEntity.ok(
                    "Votre compte Producteur a été créé. Il doit être validé par un administrateur avant de pouvoir vous connecter.");
        }
    }
    // RÉCUPÉRER MON PROFIL (Connecté)
    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(Principal principal) {
        if (principal == null) {
            // 200 + corps vide : évite un 401 systématique au chargement (AuthContext) pour les visiteurs
            return ResponseEntity.ok(new UserProfileDto());
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
        dto.setIsActive(user.isActive());
        if (user.getProfilePicture() != null && !user.getProfilePicture().isEmpty()) {
    // On construit l'URL complète pour que le navigateur puisse trouver l'image
dto.setProfilePictureUrl("http://localhost:8080/uploads/" + user.getProfilePicture());
        }

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
    @PutMapping(value = "/profile", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> updateProfile(@RequestParam(value = "profilePictureFile", required = false) MultipartFile file,
                                            @ModelAttribute     UserProfileDto profileDto, Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Session expirée");
        }

        try {
        User user = userService.findByEmailOrLogin(principal.getName());
        profileDto.setId(user.getId());

        // 3. Gestion de l'image (si l'utilisateur en a envoyé une nouvelle)
        if (file != null && !file.isEmpty()) {
            // On sauvegarde l'image sur le PC et on récupère son nouveau nom
            String fileName = userService.saveProfilePicture(file);
            // On met ce nom dans le DTO
            profileDto.setProfilePicture(fileName);
        }

        // 4. On met à jour l'utilisateur (texte + nom de l'image s'il y en a une)
        userService.updateUserFromDto(profileDto);
        
        return ResponseEntity.ok("Profil mis à jour avec succès");

    } catch (Exception e) {
        // Au cas où la sauvegarde de l'image plante (ex: dossier introuvable)
        return ResponseEntity.badRequest().body("Erreur lors de la mise à jour : " + e.getMessage());
    }
    }

    // MOT DE PASSE OUBLIÉ (Public)
    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        User user = userService.findByEmail(email);
        if (user != null) {
            PasswordResetToken token = tokenService.createTokenForUser(user);
            Locale locale = toLocale(user.getLangue());
            emailService.sendPasswordResetMail(user.getEmail(), token.getToken(), locale);
        }
        return ResponseEntity.ok("Si un compte existe avec cet email, un lien a été envoyé.");
    }

    // RÉINITIALISATION MOT DE PASSE (Public)
    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@Valid @RequestBody ResetPasswordDto request) {
        String token = request.getToken();
    String password = request.getNewPassword(); 

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
            dto.setIsActive(user.isActive());
            if (user.getRoles() != null && !user.getRoles().isEmpty()) {
                dto.setRole(user.getRoles().get(0).getRole());
            }
            return dto;
        }).toList();

        return ResponseEntity.ok(dtos);
    }

    /**
     * SUPPRIMER UN UTILISATEUR (Admin seulement)
     * Réactivé pour permettre le rejet des inscriptions (suppression définitive)
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        try {
            userService.deleteUser(id);
            return ResponseEntity.ok("Utilisateur supprimé avec succès");
        } catch (org.springframework.dao.DataIntegrityViolationException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Impossible de supprimer : l'utilisateur a des données liées (réservations, etc.).");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur lors de la suppression : " + e.getMessage());
        }
    }
    // ====================================================================
    // ENDPOINTS ADMIN - GESTION DES UTILISATEURS ACTIFS/INACTIFS
    // ====================================================================

    /**
     * LISTER UNIQUEMENT LES UTILISATEURS ACTIFS (Admin seulement)
     */
    @GetMapping("/active")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserProfileDto>> getAllActiveUsers() {
        List<User> users = userService.getAllActiveUsers();

        List<UserProfileDto> dtos = users.stream().map(user -> {
            UserProfileDto dto = new UserProfileDto();
            dto.setId(user.getId());
            dto.setFirstname(user.getFirstname());
            dto.setLastname(user.getLastname());
            dto.setEmail(user.getEmail());
            dto.setLogin(user.getLogin());
            dto.setLangue(user.getLangue());
            dto.setIsActive(user.isActive());
            if (user.getRoles() != null && !user.getRoles().isEmpty()) {
                dto.setRole(user.getRoles().get(0).getRole());
            }
            return dto;
        }).toList();

        return ResponseEntity.ok(dtos);
    }

    /**
     * LISTER UNIQUEMENT LES UTILISATEURS INACTIFS (Admin seulement)
     */
    @GetMapping("/inactive")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserProfileDto>> getAllInactiveUsers() {
        List<User> users = userService.getAllInactiveUsers();

        List<UserProfileDto> dtos = users.stream().map(user -> {
            UserProfileDto dto = new UserProfileDto();
            dto.setId(user.getId());
            dto.setFirstname(user.getFirstname());
            dto.setLastname(user.getLastname());
            dto.setEmail(user.getEmail());
            dto.setLogin(user.getLogin());
            dto.setLangue(user.getLangue());
            dto.setIsActive(user.isActive());
            if (user.getRoles() != null && !user.getRoles().isEmpty()) {
                dto.setRole(user.getRoles().get(0).getRole());
            }
            return dto;
        }).toList();

        return ResponseEntity.ok(dtos);
    }

    /**
     * LISTER LES UTILISATEURS EN ATTENTE D'APPROBATION (Admin seulement)
     */
    @GetMapping("/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserProfileDto>> getPendingUsers() {
        List<User> users = userService.getPendingApprovalUsers();

        List<UserProfileDto> dtos = users.stream().map(user -> {
            UserProfileDto dto = new UserProfileDto();
            dto.setId(user.getId());
            dto.setFirstname(user.getFirstname());
            dto.setLastname(user.getLastname());
            dto.setEmail(user.getEmail());
            dto.setLogin(user.getLogin());
            dto.setLangue(user.getLangue());
            dto.setIsActive(user.isActive());
            if (user.getRoles() != null && !user.getRoles().isEmpty()) {
                dto.setRole(user.getRoles().get(0).getRole());
            }
            return dto;
        }).toList();

        return ResponseEntity.ok(dtos);
    }

    /**
     * DÉSACTIVER UN UTILISATEUR (Admin seulement)
     */
    @PutMapping("/{id}/deactivate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deactivateUser(@PathVariable Long id) {
        try {
            userService.deactivateUser(id);
            return ResponseEntity.ok("Utilisateur désactivé avec succès");
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur lors de la désactivation : " + e.getMessage());
        }
    }

    /**
     * RÉACTIVER UN UTILISATEUR (Admin seulement)
     */
    @PutMapping("/{id}/activate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> activateUser(@PathVariable Long id) {
        try {
            userService.activateUser(id);

            // Récupérer l'utilisateur pour lui envoyer la notification
            User user = userService.getUserById(id);
            emailService.sendAccountActivatedMail(user, toLocale(user.getLangue()));

            return ResponseEntity.ok("Utilisateur activé avec succès et notifié par email.");
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur lors de la réactivation : " + e.getMessage());
        }
    }

    /**
     * APPROUVER UN UTILISATEUR (Admin seulement)
     * Spécifique pour valider les comptes Producteurs en attente
     */
    @PutMapping("/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> approveUser(@PathVariable Long id) {
        try {
            userService.approveUser(id);

            // Notification de validation (try-catch pour éviter l'erreur 500 si l'email
            // échoue)
            try {
                User user = userService.getUserById(id);
                emailService.sendAccountActivatedMail(user, toLocale(user.getLangue()));
            } catch (Exception e) {
                log.error("Échec de l'envoi de l'email d'activation pour l'utilisateur ID {}: {}", id, e.getMessage());
            }

            return ResponseEntity.ok("Utilisateur approuvé et activé avec succès.");
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur lors de l'approbation : " + e.getMessage());
        }
    }

    /**
     * BASCULER LE STATUT D'UN UTILISATEUR (Admin seulement)
     */
    @PutMapping("/{id}/toggle-status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> toggleUserStatus(@PathVariable Long id) {
        try {
            userService.toggleUserStatus(id);
            return ResponseEntity.ok("Statut de l'utilisateur modifié avec succès");
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur lors de la modification du statut : " + e.getMessage());
        }
    }

    /**
     * OBTENIR LES STATISTIQUES DES UTILISATEURS (Admin seulement)
     */
    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Long>> getUserStatistics() {
        Map<String, Long> stats = Map.of(
                "totalUsers", (long) userService.getAllUsers().size(),
                "activeUsers", userService.countActiveUsers(),
                "inactiveUsers", userService.countInactiveUsers());
        return ResponseEntity.ok(stats);
    }

    /**
     * SUPPRIMER DÉFINITIVEMENT UN UTILISATEUR (Admin seulement)
     * ⚠️ ATTENTION : Suppression définitive et irréversible
     */
    @DeleteMapping("/{id}/permanent")
    @PreAuthorize("hasRole('ADMIN')")
    @Deprecated
    public ResponseEntity<String> permanentlyDeleteUser(@PathVariable Long id) {
        try {
            userService.deleteUser(id);
            return ResponseEntity.ok("Utilisateur supprimé définitivement");
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Impossible de supprimer : " + e.getMessage());
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur lors de la suppression : " + e.getMessage());
        }
    }

    private Locale toLocale(String langue) {
        return (langue != null && !langue.isBlank()) ? Locale.forLanguageTag(langue) : Locale.FRENCH;
    }
}