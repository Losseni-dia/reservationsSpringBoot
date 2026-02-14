package be.event.smartbooking.service;

import be.event.smartbooking.dto.ReservationItemRequest;
import be.event.smartbooking.errorHandler.BusinessException;
import be.event.smartbooking.model.*;
import be.event.smartbooking.model.enumeration.StatutReservation;
import be.event.smartbooking.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final RepresentationReservationRepository itemRepository;
    private final PriceRepository priceRepository;
    private final RepresentationRepos representationRepository;

    /**
     * Crée une réservation avec ses articles.
     */
    @Transactional
    public Reservation createReservation(User user, List<ReservationItemRequest> items) {
        if (items == null || items.isEmpty()) {
            throw new BusinessException("La liste de réservation ne peut pas être vide.", HttpStatus.BAD_REQUEST);
        }

        Reservation reservation = Reservation.builder()
                .user(user)
                .reservationDate(LocalDateTime.now())
                .statut(StatutReservation.PENDING)
                .build();

        reservation = reservationRepository.save(reservation);

        for (ReservationItemRequest itemReq : items) {
            Representation repr = representationRepository.findById(itemReq.representationId())
                    .orElseThrow(() -> new BusinessException(
                            "Représentation introuvable (ID: " + itemReq.representationId() + ")",
                            HttpStatus.NOT_FOUND));

            Price price = priceRepository.findById(itemReq.priceId())
                    .orElseThrow(() -> new BusinessException("Prix introuvable (ID: " + itemReq.priceId() + ")",
                            HttpStatus.NOT_FOUND));

            // Logique de stock (Exemple à adapter selon ton modèle) :
            // if (repr.getPlacesRestantes() < itemReq.quantity()) throw new
            // BusinessException("Plus de places disponibles", HttpStatus.CONFLICT);

            RepresentationReservation item = RepresentationReservation.builder()
                    .reservation(reservation)
                    .representation(repr)
                    .price(price)
                    .quantity(itemReq.quantity())
                    .build();

            itemRepository.save(item);
        }

        log.info("Réservation #{} créée pour l'utilisateur {}", reservation.getId(), user.getLogin());
        return reservation;
    }

    /**
     * Récupère une réservation et vérifie les droits d'accès.
     */
    public Reservation getByIdAndUser(Long reservationId, Long userId) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new BusinessException("Réservation introuvable", HttpStatus.NOT_FOUND));

        if (!reservation.getUser().getId().equals(userId)) {
            log.warn("Tentative d'accès illégal : User {} a tenté d'accéder à la Réservation #{}", userId,
                    reservationId);
            throw new BusinessException("Vous n'êtes pas autorisé à consulter cette réservation.",
                    HttpStatus.FORBIDDEN);
        }

        return reservation;
    }

    @Transactional
    public Reservation confirmReservation(Long reservationId) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new BusinessException("Réservation introuvable", HttpStatus.NOT_FOUND));

        reservation.setStatut(StatutReservation.CONFIRMED);
        log.info("Réservation #{} confirmée (Payée).", reservationId);
        return reservationRepository.save(reservation);
    }

    // --- DANS ReservationService.java ---

    /**
     * VERSION SYSTÈME : Annulation automatique (Stripe, Admin, etc.)
     */
    @Transactional
    public void cancelReservation(Long reservationId) {
        Reservation res = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new BusinessException("Réservation introuvable", HttpStatus.NOT_FOUND));

        if (res.getStatut() == StatutReservation.CANCELLED) {
            return; // Déjà annulée, on ne fait rien pour éviter les erreurs inutiles
        }

        res.setStatut(StatutReservation.CANCELLED);
        reservationRepository.save(res);
        log.info("Réservation #{} annulée par le SYSTÈME (Stripe/Admin).", reservationId);
    }



    public List<Reservation> getUserReservations(User user) {
        return reservationRepository.findByUserOrderByCreatedAtDesc(user);
    }
}