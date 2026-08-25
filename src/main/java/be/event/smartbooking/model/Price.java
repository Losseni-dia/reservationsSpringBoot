package be.event.smartbooking.model;

import jakarta.persistence.*;
import lombok.*;
import be.event.smartbooking.model.enumeration.TypePrice;

import java.time.LocalDateTime;

@Entity
@Table(name = "prices")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Price {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TypePrice type;

    @Column(nullable = false)
    private Double amount; // plus clair que "price"

    @Column(name = "start_date", nullable = false)
    private LocalDateTime startDate;

    @Column(name = "end_date")
    private LocalDateTime endDate; // peut être null si permanent

    // Une représentation peut avoir plusieurs prix (ex: par période)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "representation_id", nullable = false)
    private Representation representation;
}