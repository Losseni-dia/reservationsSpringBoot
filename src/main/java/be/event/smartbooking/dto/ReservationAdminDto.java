package be.event.smartbooking.dto;

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
    /** Somme des quantités sur toutes les lignes (billets). */
    private Integer totalTickets;
    /** Libellés des tarifs distincts (ex. "Standard, VIP"). */
    private String ticketTypes;
    /** Somme des (prix unitaire × quantité) sur toutes les lignes. */
    private Double totalAmount;
}
