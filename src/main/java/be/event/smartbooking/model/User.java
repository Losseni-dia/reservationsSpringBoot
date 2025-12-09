package be.event.smartbooking.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 50)
    private String login;

    @Column(nullable = false)
    private String password; // À hasher avec BCrypt en pratique !

    private String firstname;
    private String lastname;

    @Column(unique = true, nullable = false)
    private String email;

    private String langue; // ex: "fr", "en", "nl"

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    // =================================================================
    // ROLES
    // =================================================================
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "user_roles", joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "role_id"))
    private List<Role> roles = new ArrayList<>();

    // =================================================================
    // RÉSERVATIONS (relation principale)
    // =================================================================
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Reservation> reservations = new ArrayList<>();


    // =================================================================
    // AVIS (reviews)
    // =================================================================
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Review> reviews = new ArrayList<>();


    // =================================================================
    // MÉTHODES UTILITAIRES
    // =================================================================

    // --- Rôles ---
    public void addRole(Role role) {
        if (!roles.contains(role)) {
            roles.add(role);
            role.getUsers().add(this);
        }
    }

    public void removeRole(Role role) {
        if (roles.remove(role)) {
            role.getUsers().remove(this);
        }
    }

    // --- Réservations ---
    public void addReservation(Reservation reservation) {
        reservations.add(reservation);
        reservation.setUser(this);
    }

    public void removeReservation(Reservation reservation) {
        reservations.remove(reservation);
        reservation.setUser(null);
    }


    public void addReview(Review review) {
        reviews.add(review);
        review.setUser(this);
    }

    public void removeReview(Review review) {
        reviews.remove(review);
        review.setUser(null);
    }

    // --- Méthodes pratiques très utiles ---
   

    /**
     * Vérifie si l'utilisateur a le rôle donné
     */
    public boolean hasRole(String roleName) {
        return roles.stream()
                .anyMatch(role -> role.getRole().equalsIgnoreCase(roleName));
    }

    @Override
    public String toString() {
        return login + " (" + firstname + " " + lastname + ")";
    }
}