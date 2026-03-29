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
import com.stripe.model.EventDataObjectDeserializer;
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
    public ResponseEntity<String> handleStripeEvent(@RequestBody String payload,
            @RequestHeader("Stripe-Signature") String sigHeader) {

        try {
            // 1. Vérification de la signature (Ton secret whsec_...66a6)
            Event event = Webhook.constructEvent(payload, sigHeader, endpointSecret);
            System.out.println("🔔 Webhook reçu : " + event.getType());

            // 2. On ne traite que le succès du paiement
            if ("checkout.session.completed".equals(event.getType())) {

                // 🚀 MÉTHODE SÉCURISÉE POUR LIRE LA SESSION
                EventDataObjectDeserializer dataObjectDeserializer = event.getDataObjectDeserializer();
                Session session = null;

                if (dataObjectDeserializer.getObject().isPresent()) {
                    session = (Session) dataObjectDeserializer.getObject().get();
                } else {
                    // Si la lecture standard échoue, on tente la lecture forcée (utile selon les
                    // versions de Stripe)
                    session = (Session) dataObjectDeserializer.deserializeUnsafe();
                }

                if (session != null && session.getMetadata() != null) {
                    String resIdStr = session.getMetadata().get("reservation_id");

                    if (resIdStr != null) {
                        Long reservationId = Long.parseLong(resIdStr);
                        System.out.println("🚀 Confirmation de la réservation #" + reservationId);

                        // CRÉATION DES TICKETS EN BASE DE DONNÉES
                        reservationService.confirmReservation(reservationId);

                        System.out.println("✅ SUCCÈS : Les tickets sont créés !");
                    } else {
                        System.err.println("⚠️ Metadata 'reservation_id' manquante dans la session Stripe.");
                    }
                }
            } else {
                System.out.println("ℹ️ Événement ignoré.");
            }

            return ResponseEntity.ok(""); // 200 OK pour Stripe

        } catch (Exception e) {
            System.err.println("🔥 ERREUR DANS LE WEBHOOK : " + e.getMessage());
            return ResponseEntity.status(400).body("Webhook Error");
        }
    }
}