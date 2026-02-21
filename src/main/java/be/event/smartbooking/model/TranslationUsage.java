package be.event.smartbooking.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "translation_usage")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TranslationUsage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Integer charactersTranslated;

    @Column(name = "user_id")
    private Long userId;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
