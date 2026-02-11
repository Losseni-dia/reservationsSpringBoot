package be.event.smartbooking.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.repository.CrudRepository;

import be.event.smartbooking.model.User;

public interface UserRepos extends CrudRepository<User, Long> {
    User findById(long id);

    User findByLogin(String login);

    Optional <User> findByEmail(String email);

    List<User> findByLastname(String lastname);

    boolean existsByEmail(String email);

    boolean existsByLogin(String login);

   // ====================================================================
// MÉTHODES POUR LA GESTION DES UTILISATEURS ACTIFS/INACTIFS
// ====================================================================

/**
 * Récupère tous les utilisateurs actifs
 */
List<User> findByIsActiveTrue();

/**
 * Récupère tous les utilisateurs inactifs (désactivés)
 */
List<User> findByIsActiveFalse();

/**
 * Trouve un utilisateur actif par login
 */
Optional<User> findByLoginAndIsActiveTrue(String login);

/**
 * Trouve un utilisateur actif par email
 */
Optional<User> findByEmailAndIsActiveTrue(String email);

/**
 * Trouve un utilisateur actif par ID
 */
Optional<User> findByIdAndIsActiveTrue(Long id);

/**
 * Compte le nombre d'utilisateurs actifs
 */
long countByIsActiveTrue();

/**
 * Compte le nombre d'utilisateurs inactifs
 */
long countByIsActiveFalse();

/**
 * Vérifie si un utilisateur existe et est actif par login
 */
boolean existsByLoginAndIsActiveTrue(String login);

/**
 * Vérifie si un utilisateur existe et est actif par email
 */
boolean existsByEmailAndIsActiveTrue(String email);
    
}
