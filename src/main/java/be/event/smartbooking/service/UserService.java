package be.event.smartbooking.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import be.event.smartbooking.dto.UserProfileDto;
import be.event.smartbooking.dto.UserRegistrationDto;
import be.event.smartbooking.model.Role;
import be.event.smartbooking.model.User;
import be.event.smartbooking.repository.RoleRepos;
import be.event.smartbooking.repository.UserRepos;
import jakarta.persistence.EntityNotFoundException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    @Autowired
    private UserRepos userRepos;

    @Autowired
    private RoleRepos roleRepos;

    @Autowired
    private PasswordEncoder passwordEncoder;


    public List<User> getAllUsers() {
        List<User> users = new ArrayList<>();
        userRepos.findAll().forEach(users::add);
        return users;
    }

    public User getUserById(long id) {
        return userRepos.findById(id);
    }

    public User findByEmail(String email) {
        return userRepos.findByEmail(email).orElse(null);
    }

    public void registerFromDto(UserRegistrationDto dto) {
        User user = new User();
        user.setFirstname(dto.getFirstname());
        user.setLastname(dto.getLastname());
        user.setLogin(dto.getLogin());
        user.setEmail(dto.getEmail());
        user.setLangue(dto.getLangue());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setIsActive(true); // L'utilisateur est actif dès la création

        Role memberRole = roleRepos.findByRole("MEMBER"); // récupérer l'objet Role depuis la BD
        List<Role> roles = new ArrayList<>();
        roles.add(memberRole);
        user.setRoles(roles);
        userRepos.save(user);
    }


    public void updateUser(long id, User user) {
        userRepos.save(user);
    }

    public User findByLogin(String login) {
        return userRepos.findByLogin(login);
    }

    /**
 * ATTENTION: Suppression définitive d'un utilisateur
 * À utiliser uniquement pour les cas RGPD ou les comptes sans données liées
 * @deprecated Utilisez plutôt deactivateUser() pour un soft delete
 */
@Deprecated
public void deleteUser(Long id) {
        java.util.Objects.requireNonNull(id, "id");
        if (!userRepos.existsById(id)) {
            throw new EntityNotFoundException("Utilisateur introuvable");
    }
    
    logger.warn("SUPPRESSION DÉFINITIVE de l'utilisateur: {} (ID: {})", user.getLogin(), id);
    userRepos.deleteById(id);
}
    

   /**
 * ATTENTION: Suppression définitive d'un utilisateur par login
 * @deprecated Utilisez plutôt deactivateUser() pour un soft delete
 */
@Deprecated
public void deleteByLogin(String login) {
    User user = userRepos.findByLogin(login);
    if (user == null) {
        throw new EntityNotFoundException("Utilisateur introuvable avec le login: " + login);
    }
    
    // Vérifier si l'utilisateur a des réservations ou des avis
    if (!user.getReservations().isEmpty() || !user.getReviews().isEmpty()) {
        throw new IllegalStateException(
            "Impossible de supprimer un utilisateur avec des réservations ou des avis. " +
            "Utilisez la désactivation à la place."
        );
    }
    
    logger.warn("SUPPRESSION DÉFINITIVE de l'utilisateur: {}", login);
    userRepos.delete(user);
}

    public boolean isLoginAndEmailAvailable(String login, String email) {
        return !userRepos.existsByLogin(login) && !userRepos.existsByEmail(email);
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
 * Vérifie si un login et un email sont disponibles parmi les utilisateurs actifs
 */
public boolean isLoginAndEmailAvailableForActiveUsers(String login, String email) {
    return !userRepos.existsByLoginAndIsActiveTrue(login) 
        && !userRepos.existsByEmailAndIsActiveTrue(email);
}

/**
 * Désactive un utilisateur (soft delete) au lieu de le supprimer
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
 * Bascule le statut d'un utilisateur (actif <-> inactif)
 * @param userId L'ID de l'utilisateur
 */
public void toggleUserStatus(Long userId) {
    User user = userRepos.findById(userId)
            .orElseThrow(() -> new EntityNotFoundException("Utilisateur non trouvé avec l'ID: " + userId));
    
    if (user.getIsActive()) {
        deactivateUser(userId);
    } else {
        activateUser(userId);
    }
}

/**
 * Compte le nombre total d'utilisateurs actifs
 */
public long countActiveUsers() {
    return userRepos.countByIsActiveTrue();
}

/**
 * Compte le nombre total d'utilisateurs inactifs
 */
public long countInactiveUsers() {
    return userRepos.countByIsActiveFalse();
}
        public void updateUserFromDto(UserProfileDto dto) {
        User user = userRepos.findById(dto.getId())
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        user.setFirstname(dto.getFirstname());
        user.setLastname(dto.getLastname());
        user.setEmail(dto.getEmail());
        user.setLangue(dto.getLangue());

        // Si un nouveau mot de passe est fourni et validé
        if (dto.getPassword() != null && !dto.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(dto.getPassword()));
        }

        userRepos.save(user);
        logger.info("Profil mis à jour pour l'utilisateur: {} (ID: {})", user.getLogin(), user.getId());
    }



 


}
