package be.event.smartbooking.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;

import be.event.smartbooking.errorHandler.BusinessException;
import be.event.smartbooking.model.RepresentationReservation;
import be.event.smartbooking.model.Reservation;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class StripeService {

    @Value("${stripe.api.key}")
    private String secretKey;

    @Value("${app.frontend.url}")
    private String frontendUrl; // Utilisation de ta variable de config

    @PostConstruct
    public void init() {
        Stripe.apiKey = secretKey;
    }

    public String createCheckoutSession(Reservation reservation, List<RepresentationReservation> items) {
        try {
            // 1. Préparation des articles pour Stripe
            List<SessionCreateParams.LineItem> lineItems = items.stream().map(item -> SessionCreateParams.LineItem
                    .builder()
                    .setQuantity((long) item.getQuantity())
                    .setPriceData(
                            SessionCreateParams.LineItem.PriceData.builder()
                                    .setCurrency("eur")
                                    // Stripe travaille en centimes (ex: 10.00€ -> 1000)
                                    .setUnitAmount(Math.round(item.getPrice().getAmount() * 100))
                                    .setProductData(
                                            SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                    .setName(item.getRepresentation().getShow().getTitle())
                                                    .setDescription("Séance du : " + item.getRepresentation().getWhen())
                                                    .build())
                                    .build())
                    .build()).collect(Collectors.toList());

            // 2. Configuration de la session avec tes variables d'URL
            SessionCreateParams params = SessionCreateParams.builder()
                    .setMode(SessionCreateParams.Mode.PAYMENT)
                    // On utilise frontendUrl pour la redirection
                    .setSuccessUrl(frontendUrl + "/payment-success?session_id={CHECKOUT_SESSION_ID}")
                    .setCancelUrl(frontendUrl + "/cart")
                    .addAllLineItem(lineItems)
                    // Metadata pour faire le lien avec ta DB après le paiement
                    .putMetadata("reservation_id", reservation.getId().toString())
                    .build();

            Session session = Session.create(params);
            return session.getUrl();

        } catch (StripeException e) {
            log.error("Erreur Stripe lors de la création de la session: {}", e.getMessage(),e);
            throw new BusinessException("Erreur lors de la préparation du paiement en ligne.",
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}