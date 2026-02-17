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
import java.util.Locale;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final RepresentationReservationRepository itemRepository;
    private final PriceRepository priceRepository;
    private final RepresentationRepos representationRepository;
    private final EmailService emailService;

    /**
     * Crée une réservation avec ses articles.
     */
    @Transactional
    public Reservation createReservation(User user, List<ReservationItemRequest> items) {
        if (items == null || items.isEmpty()) {
            throw new BusinessException("error.reservation.empty", HttpStatus.BAD_REQUEST);
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
                            "error.representation.notfound",
                            HttpStatus.NOT_FOUND,
                            itemReq.representationId()));

            Price price = priceRepository.findById(itemReq.priceId())
                    .orElseThrow(() -> new BusinessException(
                            "error.price.notfound",
                            HttpStatus.NOT_FOUND,
                            itemReq.priceId()));

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
                .orElseThrow(() -> new BusinessException("error.reservation.notfound", HttpStatus.NOT_FOUND));

        if (!reservation.getUser().getId().equals(userId)) {
            log.warn("Tentative d'accès illégal : User {} a tenté d'accéder à la Réservation #{}", userId,
                    reservationId);
            throw new BusinessException("error.reservation.forbidden", HttpStatus.FORBIDDEN);
        }

        return reservation;
    }

    @Transactional
    public Reservation confirmReservation(Long reservationId) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new BusinessException("error.reservation.notfound", HttpStatus.NOT_FOUND));

        if (reservation.getStatut() != StatutReservation.PENDING) {
            throw new BusinessException(
                    "error.reservation.confirm.pending",
                    HttpStatus.BAD_REQUEST,
                    reservation.getStatut());
        }

        reservation.setStatut(StatutReservation.CONFIRMED);
        Reservation confirmed = reservationRepository.save(reservation);
        List<RepresentationReservation> items = itemRepository.findByReservationWithDetails(confirmed);
        Locale locale = (confirmed.getUser().getLangue() != null && !confirmed.getUser().getLangue().isBlank())
                ? Locale.forLanguageTag(confirmed.getUser().getLangue()) : Locale.FRENCH;
        emailService.sendReservationSummaryMail(confirmed.getUser(), confirmed, items, locale);
        log.info("Réservation #{} confirmée (Payée).", reservationId);
        return confirmed;
    }

    // --- DANS ReservationService.java ---

    /**
     * VERSION SYSTÈME : Annulation automatique (Stripe, Admin, etc.)
     */
    @Transactional
    public void cancelReservation(Long reservationId) {
        Reservation res = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new BusinessException("error.reservation.notfound", HttpStatus.NOT_FOUND));

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