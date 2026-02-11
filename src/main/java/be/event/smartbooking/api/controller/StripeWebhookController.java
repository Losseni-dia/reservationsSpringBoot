package be.event.smartbooking.api.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.stripe.model.Event;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;

import be.event.smartbooking.service.ReservationService;


@RestController
@RequestMapping("/api/webhooks")
public class StripeWebhookController {

    // Cette variable DOIT être ici, au niveau de la classe
    @Value("${stripe.webhook.secret}")
    private String endpointSecret;

    @Autowired
    private ReservationService reservationService;

    @PostMapping("/stripe")
public ResponseEntity<String> handleStripeEvent(@RequestBody String payload, @RequestHeader("Stripe-Signature") String sigHeader) {
    try {
        Event event = Webhook.constructEvent(payload, sigHeader, endpointSecret);
        Session session = (Session) event.getDataObjectDeserializer().getObject().get();
        String reservationIdStr = session.getMetadata().get("reservation_id");

        if (reservationIdStr == null) return ResponseEntity.ok(""); // Sécurité
        Long reservationId = Long.parseLong(reservationIdStr);

        switch (event.getType()) {
            case "checkout.session.completed":
                // Le paiement est réussi
                reservationService.confirmReservation(reservationId);
                break;

            case "checkout.session.expired":
                // L'utilisateur a abandonné la page ou le temps est écoulé
                // On annule la réservation pour libérer les places
                reservationService.cancelReservation(reservationId);
                break;

            case "payment_intent.payment_failed":
                // Le paiement a été tenté mais a échoué (ex: solde insuffisant)
                reservationService.cancelReservation(reservationId);
                break;

            default:
                // Type d'événement non géré
                break;
        }

        return ResponseEntity.ok("");
    } catch (Exception e) {
        return ResponseEntity.status(400).body("Webhook Error: " + e.getMessage());
    }
}
}