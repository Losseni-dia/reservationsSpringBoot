package be.event.smartbooking.service;

import be.event.smartbooking.dto.ReservationAdminDto;
import be.event.smartbooking.dto.ReservationItemRequest;
import be.event.smartbooking.errorHandler.BusinessException;
import be.event.smartbooking.model.*;
import be.event.smartbooking.model.enumeration.StatutReservation;
import be.event.smartbooking.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

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
    private final StripeService stripeService;

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

        Reservation savedRes;
        System.out.println(">>>>>>>> ETAPE 1 : TENTATIVE DE SAUVEGARDE RESERVATION PARENTE");
        try {
            savedRes = reservationRepository.saveAndFlush(reservation);
            System.out.println(">>>>>>>> ETAPE 1 OK ! ID Parente : " + savedRes.getId());
        } catch (Exception e) {
            System.out.println("!!!!!!!! CRASH LORS DE LA SAUVEGARDE PARENTE !!!!!!!!");
            throw e;
        }

        for (ReservationItemRequest itemReq : items) {
            Representation repr = representationRepository.findById(itemReq.representationId())
                    .orElseThrow(() -> new BusinessException("Representation non trouvée", HttpStatus.NOT_FOUND));
            
            Price pr = priceRepository.findById(itemReq.priceId())
                    .orElseThrow(() -> new BusinessException("Prix non trouvé", HttpStatus.NOT_FOUND));

            RepresentationReservation item = new RepresentationReservation();
            item.setReservation(savedRes);
            item.setRepresentation(repr);
            item.setPrice(pr);
            item.setQuantity(itemReq.quantity());

            System.out.println(">>>>>>>> ETAPE 2 : TENTATIVE SAUVEGARDE ITEM (ReprID=" + repr.getId() + ")");
            try {
                itemRepository.saveAndFlush(item);
                System.out.println(">>>>>>>> ETAPE 2 OK !");
            } catch (Exception e) {
                System.out.println("!!!!!!!! CRASH LORS DE LA SAUVEGARDE DE L'ITEM !!!!!!!!");
                throw e;
            }
        }
        
        return savedRes;
    }

    @Transactional
    public String processStripePayment(List<ReservationItemRequest> items, User user) {
        Reservation reservation = this.createReservation(user, items);
        List<RepresentationReservation> savedItems = itemRepository.findByReservationWithDetails(reservation);

        return stripeService.createCheckoutSession(reservation, savedItems);
    }

    public Reservation getByIdAndUser(Long reservationId, Long userId) {
        // CORRECTION ICI : Utilisation de reservationRepository au lieu de reservation
        Reservation res = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new BusinessException("error.reservation.notfound", HttpStatus.NOT_FOUND));

        if (!res.getUser().getId().equals(userId)) {
            log.warn("Tentative d'accès illégal : User {} a tenté d'accéder à la Réservation #{}", userId, reservationId);
            throw new BusinessException("error.reservation.forbidden", HttpStatus.FORBIDDEN);
        }

        return res;
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

    @Transactional
    public void cancelReservation(Long reservationId) {
        Reservation res = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new BusinessException("error.reservation.notfound", HttpStatus.NOT_FOUND));

        if (res.getStatut() == StatutReservation.CANCELLED) {
            return;
        }

        res.setStatut(StatutReservation.CANCELLED);
        reservationRepository.save(res);
        log.info("Réservation #{} annulée par le SYSTÈME (Stripe/Admin).", reservationId);
    }

    public List<Reservation> getUserReservations(User user) {
        return reservationRepository.findByUserOrderByCreatedAtDesc(user);
    }

    public List<ReservationAdminDto> findAllForAdmin() {
        List<Reservation> reservations = reservationRepository.findAll(
                Sort.by(Sort.Direction.DESC, "createdAt"));
        return reservations.stream()
                .map(this::toAdminDto)
                .collect(Collectors.toList());
    }

    private ReservationAdminDto toAdminDto(Reservation r) {
        User u = r.getUser();
        List<RepresentationReservation> items = itemRepository.findByReservationWithDetails(r);

        BigDecimal total = BigDecimal.ZERO;
        for (RepresentationReservation line : items) {
            if (line.getPrice() != null && line.getPrice().getAmount() != null && line.getQuantity() != null) {
                total = total.add(
                        BigDecimal.valueOf(line.getPrice().getAmount())
                                .multiply(BigDecimal.valueOf(line.getQuantity())));
            }
        }

        String showTitle = null;
        String representationWhen = null;
        if (!items.isEmpty()) {
            Representation repr = items.get(0).getRepresentation();
            if (repr != null) {
                if (repr.getShow() != null && repr.getShow().getTitle() != null) {
                    showTitle = repr.getShow().getTitle();
                }
                if (repr.getWhen() != null) {
                    representationWhen = repr.getWhen().toString();
                }
            }
        }

        return ReservationAdminDto.builder()
                .id(r.getId())
                .reservationDate(r.getReservationDate() != null ? r.getReservationDate().toString() : null)
                .createdAt(r.getCreatedAt() != null ? r.getCreatedAt().toString() : null)
                .userLogin(u != null ? u.getLogin() : null)
                .userEmail(u != null ? u.getEmail() : null)
                .showTitle(showTitle)
                .representationWhen(representationWhen)
                .statut(r.getStatut() != null ? r.getStatut().name() : null)
                .totalAmount(total.doubleValue())
                .build();
    }
}