package be.event.smartbooking.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import be.event.smartbooking.dto.UserProfileDto;
import be.event.smartbooking.dto.UserRegistrationDto;
import be.event.smartbooking.errorHandler.BusinessException; // Ton exception maison
import be.event.smartbooking.model.User;
import be.event.smartbooking.repository.RoleRepos;
import be.event.smartbooking.repository.UserRepos;
import jakarta.persistence.EntityNotFoundException;

@Service
@Transactional // Sécurité pour les opérations d'écriture
public class UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    @Autowired
    private UserRepos userRepos;

    @Autowired
    private RoleRepos roleRepos;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // --- LECTURE ---

    public List<User> getAllUsers() {
        return StreamSupport.stream(userRepos.findAll().spliterator(), false)
                .collect(Collectors.toList());
    }

    public User getUserById(long id) {
        return userRepos.findById(id)
                .orElseThrow(
                        () -> new BusinessException("Utilisateur introuvable (ID: " + id + ")", HttpStatus.NOT_FOUND));
    }

    public User findByEmail(String email) {
        return userRepos.findByEmail(email)
                .orElseThrow(
                        () -> new BusinessException("Aucun utilisateur avec l'email: " + email, HttpStatus.NOT_FOUND));
    }

    public User findByLogin(String login) {
        User user = userRepos.findByLogin(login);
        if (user == null) {
            throw new BusinessException("Aucun utilisateur avec le login: " + login, HttpStatus.NOT_FOUND);
        }
        return user;
    }

    // --- INSCRIPTION & MODIFICATION ---

public void registerFromDto(UserRegistrationDto dto) {
    // 1. Vérifications d'unicité (Login et Email)
    if (userRepos.existsByLogin(dto.getLogin())) {
        throw new BusinessException("Ce login est déjà utilisé", HttpStatus.CONFLICT);
    }
    if (userRepos.existsByEmail(dto.getEmail())) {
        throw new BusinessException("Cet email est déjà utilisé", HttpStatus.CONFLICT);
    }

    String roleToAssign = (dto.getRole() == null || dto.getRole().isBlank()) ? "member" : dto.getRole();
    if ("producer".equalsIgnoreCase(roleToAssign)) {
        if (dto.getProducerRequestDescription() == null || dto.getProducerRequestDescription().isBlank()) {
            throw new BusinessException("La description de la demande est obligatoire pour un compte producteur",
                    HttpStatus.BAD_REQUEST);
        }
    }

    User user = new User();
    user.setFirstname(dto.getFirstname());
    user.setLastname(dto.getLastname());
    user.setLogin(dto.getLogin());
    user.setEmail(dto.getEmail());
    user.setLangue(dto.getLangue());
    user.setPassword(passwordEncoder.encode(dto.getPassword()));
    user.setProfilePicture(dto.getProfilePicture());
    if ("producer".equalsIgnoreCase(roleToAssign)) {
        user.setProducerRequestDescription(dto.getProducerRequestDescription().trim());
    } else {
        user.setProducerRequestDescription(null);
    }

    // 3. Gestion de l'approbation selon le rôle final
    if ("producer".equalsIgnoreCase(roleToAssign)) {
        user.setApproved(false);
        user.setActive(false);
    } else {
        // C'est un Membre (par défaut ou explicite)
        user.setApproved(true);
        user.setActive(true);
    }

    // 4. Attribution du rôle en base de données
    be.event.smartbooking.model.Role userRole = roleRepos.findByRole(roleToAssign);
    if (userRole == null) {
        throw new BusinessException("Le rôle spécifié n'existe pas : " + roleToAssign, HttpStatus.BAD_REQUEST);
    }
    user.addRole(userRole);

    try {
        userRepos.save(user);
        logger.info("Nouvel utilisateur enregistré avec le rôle {}: {}", roleToAssign, user.getLogin());
    } catch (DataIntegrityViolationException e) {
        throw new BusinessException("Erreur lors de l'enregistrement.", HttpStatus.CONFLICT);
    }
}

    public void updateUser(long id, User user) {

        userRepos.save(user);

    }

    /**
     * ATTENTION: Suppression définitive d'un utilisateur
     * À utiliser uniquement pour les cas RGPD ou les comptes sans données liées
     * 
     * @deprecated Utilisez plutôt deactivateUser() pour un soft delete
     */
    @Deprecated
    public void deleteUser(Long id) {
        java.util.Objects.requireNonNull(id, "id");
        if (!userRepos.existsById(id)) {
            throw new EntityNotFoundException("Utilisateur introuvable");
        }

        logger.warn("SUPPRESSION DÉFINITIVE de l'utilisateur: {} (ID: {})", id);
        userRepos.deleteById(id);
    }


    /**
     * Récupère tous les utilisateurs actifs uniquement
     */
    public List<User> getAllActiveUsers() {
        return userRepos.findByIsActiveTrue();
    }

    /**
     * Récupère tous les utilisateurs inactifs uniquement
     */
    public List<User> getAllInactiveUsers() {
        return userRepos.findByIsActiveFalse();
    }

    /**
     * Récupère les utilisateurs en attente d'approbation (Producteurs inscrits mais pas validés)
     */
    public List<User> getPendingApprovalUsers() {
        return userRepos.findAllByIsApproved(false);
    }

    /**
     * Récupère un utilisateur actif par son ID
     */
    public Optional<User> getActiveUserById(Long id) {
        return userRepos.findByIdAndIsActiveTrue(id);
    }

    /**
     * Récupère un utilisateur actif par son email
     */
    public Optional<User> findActiveUserByEmail(String email) {
        return userRepos.findByEmailAndIsActiveTrue(email);
    }

    /**
     * Récupère un utilisateur actif par son login
     */
    public Optional<User> findActiveUserByLogin(String login) {
        return userRepos.findByLoginAndIsActiveTrue(login);
    }

    /**
     * Vérifie si un login et un email sont disponibles parmi les utilisateurs
     * actifs
     */
    public boolean isLoginAndEmailAvailableForActiveUsers(String login, String email) {
        return !userRepos.existsByLoginAndIsActiveTrue(login)
                && !userRepos.existsByEmailAndIsActiveTrue(email);
    }

    /**
     * Désactive un utilisateur (soft delete) au lieu de le supprimer
     * 
     * @param userId L'ID de l'utilisateur à désactiver
     * @throws EntityNotFoundException Si l'utilisateur n'existe pas
     */
    public void deactivateUser(Long userId) {
        User user = userRepos.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("Utilisateur non trouvé avec l'ID: " + userId));

        logger.info("Désactivation de l'utilisateur: {} (ID: {})", user.getLogin(), userId);

        user.deactivate();
        userRepos.save(user);
    }

    /**
     * Réactive un utilisateur désactivé
     * 
     * @param userId L'ID de l'utilisateur à réactiver
     * @throws EntityNotFoundException Si l'utilisateur n'existe pas
     */
    public void activateUser(Long userId) {
        User user = userRepos.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("Utilisateur non trouvé avec l'ID: " + userId));

        logger.info("Réactivation de l'utilisateur: {} (ID: {})", user.getLogin(), userId);

        user.activate();
        userRepos.save(user);
    }

    /**
     * Approuve un nouvel utilisateur (ex: Producteur) et l'active
     */
    public void approveUser(Long userId) {
        User user = userRepos.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("Utilisateur non trouvé avec l'ID: " + userId));

        logger.info("Approbation de l'utilisateur: {} (ID: {})", user.getLogin(), userId);

        user.setApproved(true);
        user.setActive(true);
        userRepos.save(user);
    }

    public void updateUserFromDto(UserProfileDto dto) {
        User user = userRepos.findById(dto.getId())
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        user.setFirstname(dto.getFirstname());
        user.setLastname(dto.getLastname());
        user.setEmail(dto.getEmail());
        user.setLangue(dto.getLangue());
        if (dto.getProfilePicture() != null && !dto.getProfilePicture().isBlank()) {
            user.setProfilePicture(dto.getProfilePicture()); 
        }
        if (dto.getPassword() != null && !dto.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(dto.getPassword()));
        }

        userRepos.save(user);
        logger.info("Profil mis à jour pour : {} (ID: {})", user.getLogin(), user.getId());
    }

    public User findByEmailOrLogin(String identifier) {
    return userRepos.findByEmailOrLogin(identifier, identifier)
            .orElseThrow(() -> new RuntimeException("Utilisateur introuvable avec l'identifiant : " + identifier));
}
public String saveProfilePicture(MultipartFile file) throws IOException {
        Path uploadPath = Paths.get("uploads").toAbsolutePath().normalize();

        // Crée le dossier s'il n'existe pas
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Génère un nom unique (ex: 550e8400-e29b-41d4-a716-446655440000.jpg)
        String originalFilename = file.getOriginalFilename();
        String fileExtension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }
        
        String uniqueFileName = UUID.randomUUID().toString() + fileExtension;

        // Sauvegarde le fichier sur le disque
        Path filePath = uploadPath.resolve(uniqueFileName);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        return uniqueFileName; // On renvoie juste le nom pour le sauvegarder en BDD
    }

    // --- GESTION DU STATUT (SOFT DELETE) ---

    public void toggleUserStatus(Long userId) {
        User user = getUserById(userId);

        if (user.isActive()) {
            user.deactivate();
            logger.info("Désactivation de l'utilisateur: {}", user.getLogin());
        } else {
            user.activate();
            logger.info("Réactivation de l'utilisateur: {}", user.getLogin());
        }
        userRepos.save(user);
    }

    // --- SUPPRESSION RGPD ---

    public void deleteByLogin(String login) {
        User user = findByLogin(login);

        // Bloquer la suppression si données liées (Intégrité référentielle)
        if (!user.getReservations().isEmpty() || !user.getReviews().isEmpty()) {
            throw new BusinessException(
                    "Impossible de supprimer un utilisateur ayant un historique (réservations/avis). Désactivez-le à la place.",
                    HttpStatus.CONFLICT);
        }

        logger.warn("SUPPRESSION DÉFINITIVE de l'utilisateur: {}", login);
        userRepos.delete(user);
    }

    public boolean isLoginAndEmailAvailable(String login, String email) {

        return !userRepos.existsByLogin(login) && !userRepos.existsByEmail(email);

    }

    // --- STATISTIQUES ---

    public long countActiveUsers() {
        return userRepos.countByIsActiveTrue();
    }

    public long countInactiveUsers() {
        return userRepos.countByIsActiveFalse();
    }
}