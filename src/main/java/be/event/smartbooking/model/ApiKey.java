package be.event.smartbooking.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "api_keys")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApiKey {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // La clé elle-même (ex: sk_live_xxxxxxxx)
    @Column(nullable = false, unique = true, length = 64)
    private String keyValue;

    // Nom pour identifier la clé (ex: "Mon site Wordpress")
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;
    
    // Si tu veux gérer l'expiration plus tard (optionnel pour l'instant)
    private LocalDateTime expiresAt;
    
    @Builder.Default
    private boolean active = true;
}