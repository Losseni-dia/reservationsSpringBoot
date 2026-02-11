package be.event.smartbooking.service;

import be.event.smartbooking.model.RepresentationReservation;
import be.event.smartbooking.model.Reservation;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class StripeService {

    @Value("${stripe.api.key}")
    private String secretKey;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    @PostConstruct
    public void init() {
        Stripe.apiKey = secretKey;
    }

    public String createCheckoutSession(Reservation reservation, List<RepresentationReservation> items) throws StripeException {
    // 1. Préparation des lignes de la facture
    List<SessionCreateParams.LineItem> lineItems = items.stream().map(item -> {
        return SessionCreateParams.LineItem.builder()
            .setQuantity((long) item.getQuantity())
            .setPriceData(
                SessionCreateParams.LineItem.PriceData.builder()
                    .setCurrency("eur")
                    .setUnitAmount((long) (item.getPrice().getAmount() * 100)) // Conversion en centimes
                    .setProductData(
                        SessionCreateParams.LineItem.PriceData.ProductData.builder()
                            .setName(item.getRepresentation().getShow().getTitle())
                            .setDescription("Séance du : " + item.getRepresentation().getWhen())
                            .build()
                    )
                    .build()
            )
            .build();
    }).collect(Collectors.toList());

    // 2. Configuration de la session de paiement
    SessionCreateParams params = SessionCreateParams.builder()
        .setMode(SessionCreateParams.Mode.PAYMENT)
        .setSuccessUrl("http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}")
        .setCancelUrl("http://localhost:3000/cart")
        .addAllLineItem(lineItems)
        // Crucial : On stocke l'ID de la réservation pour le retrouver après le paiement
        .putMetadata("reservation_id", reservation.getId().toString()) 
        .build();

    Session session = Session.create(params);
    return session.getUrl();
}
}
