package be.event.smartbooking.api.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
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
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/stripe")
@Slf4j
@RequiredArgsConstructor
public class StripeWebhookController {

    @Value("${stripe.webhook.secret}")
    private String endpointSecret;

    private final ReservationService reservationService;

    @PostMapping("/webhook")
    public ResponseEntity<String> handleStripeEvent(@RequestBody String payload,
            @RequestHeader("Stripe-Signature") String sigHeader) {
        try {
            // 1. Validation de la signature (indispensable pour la sécurité)
            Event event = Webhook.constructEvent(payload, sigHeader, endpointSecret);
            log.info("🔔 [WEBHOOK] Événement validé : {}", event.getType());

            if ("checkout.session.completed".equals(event.getType())) {
                // 2. Récupération de la session
                Session session = (Session) event.getDataObjectDeserializer().getObject().orElse(null);

                String resId = null;

                if (session != null && session.getMetadata() != null) {
                    resId = session.getMetadata().get("reservation_id");
                }

                // 3. SOLUTION DE SECOURS : Si l'objet session est vide, on cherche dans le JSON
                // brut
                if (resId == null) {
                    log.warn("⚠️ Objet Session illisible, tentative de lecture brute du JSON...");
                    // On utilise le désérialiseur unsafe pour forcer la lecture
                    Session sessionUnsafe = (Session) event.getDataObjectDeserializer().deserializeUnsafe();
                    if (sessionUnsafe != null && sessionUnsafe.getMetadata() != null) {
                        resId = sessionUnsafe.getMetadata().get("reservation_id");
                    }
                }

                if (resId != null) {
                    log.info("🚀 [WEBHOOK] ID de réservation trouvé : {}. Confirmation en cours...", resId);
                    reservationService.confirmReservation(Long.parseLong(resId));
                    log.info("✅ [WEBHOOK] Traitement terminé pour #{}", resId);
                } else {
                    log.error("❌ [WEBHOOK] Impossible de trouver 'reservation_id' même en lecture forcée !");
                    log.error("Payload reçu : {}", payload); // Pour voir ce que Stripe envoie vraiment
                }
            }
            return ResponseEntity.ok("Success");
        } catch (Exception e) {
            log.error("❌ [WEBHOOK] Erreur : {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Erreur signature");
        }
    }
}