package be.event.smartbooking.api.controller;

import be.event.smartbooking.service.ReservationService;
import com.stripe.model.Event;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/stripe")
@Slf4j
@RequiredArgsConstructor
public class StripeWebhookController {

    @Value("${stripe.webhook.secret}")
    private String endpointSecret;

    private final ReservationService reservationService;

    @PostMapping("/webhook")
    public ResponseEntity<String> handleStripeEvent(HttpServletRequest request, 
                                                  @RequestHeader("Stripe-Signature") String sigHeader) {
        try {
            // 1. On lit le corps de la requête manuellement pour être sûr du format
            String payload = request.getReader().lines().collect(Collectors.joining(System.lineSeparator()));
            
            log.info("🔔 Webhook reçu ! Signature : {}", sigHeader != null ? "Présente" : "Manquante");

            // 2. Vérification de la signature
            Event event = Webhook.constructEvent(payload, sigHeader, endpointSecret);
            log.info("✅ Événement Stripe vérifié : {}", event.getType());

            // 3. Traitement du paiement réussi
            if ("checkout.session.completed".equals(event.getType())) {
                Session session = (Session) event.getDataObjectDeserializer().getObject().orElse(null);
                
                if (session != null && session.getMetadata() != null) {
                    String reservationIdStr = session.getMetadata().get("reservation_id");
                    
                    if (reservationIdStr != null) {
                        Long reservationId = Long.parseLong(reservationIdStr);
                        log.info("🚀 Lancement de la confirmation pour la réservation #{}", reservationId);
                        
                        // APPEL DE TA LOGIQUE MÉTIER
                        reservationService.confirmReservation(reservationId);
                        
                        log.info("🎯 Réservation #{} confirmée et tickets générés !", reservationId);
                    } else {
                        log.warn("⚠️ Webhook reçu mais aucun reservation_id trouvé dans les metadata");
                    }
                }
            }

            return ResponseEntity.ok("Success");

        } catch (Exception e) {
            log.error("❌ Erreur lors du traitement du Webhook : {}", e.getMessage());
            return ResponseEntity.badRequest().body("Erreur: " + e.getMessage());
        }
    }
}