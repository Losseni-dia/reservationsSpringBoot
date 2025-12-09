// ReservationService.java (extrait clé)
package be.event.smartbooking.service;

import be.event.smartbooking.dto.ReservationItemRequest;
import be.event.smartbooking.model.*;
import be.event.smartbooking.model.enumeration.StatutReservation;
import be.event.smartbooking.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final RepresentationReservationRepository itemRepository;
    private final PriceRepository priceRepository;
    private final RepresentationRepos representationRepository;

    @Transactional
    public Reservation createReservation(User user, List<ReservationItemRequest> items) {
        Reservation reservation = Reservation.builder()
                .user(user)
                .reservationDate(LocalDateTime.now())
                .statut(StatutReservation.PENDING)
                .build();

        reservation = reservationRepository.save(reservation);

        for (ReservationItemRequest itemReq : items) {
            Representation repr = representationRepository.findById(itemReq.representationId())
                    .orElseThrow(() -> new RuntimeException("Représentation non trouvée"));

            Price price = priceRepository.findById(itemReq.priceId())
                    .orElseThrow(() -> new RuntimeException("Prix non trouvé"));

            RepresentationReservation item = RepresentationReservation.builder()
                    .reservation(reservation)
                    .representation(repr)
                    .price(price)
                    .quantity(itemReq.quantity())
                    .build();

            itemRepository.save(item);
        }

        return reservation;
    }

    @Transactional
    public Reservation confirmReservation(Long reservationId) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new RuntimeException("Réservation non trouvée"));

        reservation.setStatut(StatutReservation.CONFIRMED);
        return reservationRepository.save(reservation);
    }

    public List<Reservation> getUserReservations(User user) {
        return reservationRepository.findByUserOrderByCreatedAtDesc(user);
    }



    /**
     * Récupère une réservation par ID uniquement si elle appartient bien à
     * l'utilisateur
     */
    public Reservation getByIdAndUser(Long reservationId, Long userId) {
        Optional<Reservation> optional = reservationRepository.findById(reservationId);

        if (optional.isPresent()) {
            Reservation reservation = optional.get();
            if (reservation.getUser().getId().equals(userId)) {
                return reservation;
            }
        }
        return null; // soit pas trouvée, soit pas à cet utilisateur
    }

    /**
     * Annule une réservation (seulement si elle est PENDING ou CONFIRMED)
     */
    @Transactional
    public boolean cancelReservation(Long reservationId, User currentUser) {
        Reservation reservation = getByIdAndUser(reservationId, currentUser.getId());

        if (reservation == null) {
            return false;
        }

        if (reservation.getStatut() == StatutReservation.CANCELLED) {
            return false; // déjà annulée
        }

        if (reservation.getStatut() == StatutReservation.PENDING ||
                reservation.getStatut() == StatutReservation.CONFIRMED) {

            reservation.setStatut(StatutReservation.CANCELLED);
            reservationRepository.save(reservation);
            return true;
        }

        return false; // statut non annulable (ex: déjà passée)
    }
}