package be.event.smartbooking.controller;

import be.event.smartbooking.service.ReservationService;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.model.Event;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/stripe")
@Slf4j
@RequiredArgsConstructor
public class StripeWebhookController {

    @Value("${stripe.webhook.secret}")
    private String endpointSecret;

    // On a juste besoin du ReservationService maintenant !
    private final ReservationService reservationService;

    @PostMapping("/webhook")
    public ResponseEntity<String> handleStripeEvent(
            @RequestBody String payload,
            @RequestHeader("Stripe-Signature") String sigHeader) {

        Event event;

        try {
            event = Webhook.constructEvent(payload, sigHeader, endpointSecret);
        } catch (SignatureVerificationException e) {
            log.error("Signature Stripe invalide");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Signature invalide");
        } catch (Exception e) {
            log.error("Erreur de payload Webhook", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Erreur payload");
        }

        if ("checkout.session.completed".equals(event.getType())) {
            Session session = (Session) event.getDataObjectDeserializer().getObject().orElse(null);
            
            if (session != null && session.getMetadata() != null) {
                String reservationIdStr = session.getMetadata().get("reservation_id");

                if (reservationIdStr != null) {
                    try {
                        Long reservationId = Long.parseLong(reservationIdStr);
                        log.info("Paiement validé par Stripe ! Lancement de la confirmation pour la réservation #{}", reservationId);

                        // La magie opère ici : cette ligne crée les tickets et envoie l'e-mail !
                        reservationService.confirmReservation(reservationId);
                        
                    } catch (Exception e) {
                        log.error("Erreur lors de la confirmation de la réservation {}", reservationIdStr, e);
                    }
                }
            }
        }

        return ResponseEntity.ok("Success");
    }
}