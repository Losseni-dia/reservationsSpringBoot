package be.event.smartbooking.dto;

import java.util.ArrayList;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Vue agrégée d'une réservation pour l'administration (liste tableau de bord).
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReservationAdminDto {

    private Long id;
    private String reservationDate;
    private String createdAt;
    private String userLogin;
    private String userEmail;
    /** Titre du spectacle (première ligne ; plusieurs séances possibles). */
    private String showTitle;
    /** Date/heure ISO de la représentation (première ligne). */
    private String representationWhen;
    /** Quantités par type de tarif (ordre d'apparition des lignes). */
    @Builder.Default
    private List<TicketDetailDto> ticketDetails = new ArrayList<>();
    /** Somme des (prix unitaire × quantité) sur toutes les lignes. */
    private Double totalAmount;
}
