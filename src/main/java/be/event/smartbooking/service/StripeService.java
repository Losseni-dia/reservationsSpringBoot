package be.event.smartbooking.service;

import be.event.smartbooking.model.RepresentationReservation;
import be.event.smartbooking.model.Reservation;
import com.stripe.Stripe;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.List;

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

    public String createCheckoutSession(Reservation reservation, List<RepresentationReservation> items) throws Exception {
        List<SessionCreateParams.LineItem> lineItems = new ArrayList<>();

        for (RepresentationReservation item : items) {
            lineItems.add(
                SessionCreateParams.LineItem.builder()
                    .setQuantity((long) item.getQuantity())
                    .setPriceData(
                        SessionCreateParams.LineItem.PriceData.builder()
                            .setCurrency("eur")
                            .setUnitAmount((long) (item.getPrice().getValue().doubleValue() * 100)) // Stripe calcule en centimes
                            .setProductData(
                                SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                    .setName(item.getRepresentation().getShow().getTitle())
                                    .setDescription("Représentation du " + item.getRepresentation().getWhen())
                                    .build()
                            )
                            .build()
                    )
                    .build()
            );
        }

        SessionCreateParams params = SessionCreateParams.builder()
            .addPaymentMethodType(SessionCreateParams.PaymentMethodType.CARD)
            .setMode(SessionCreateParams.Mode.PAYMENT)
            .setSuccessUrl(frontendUrl + "/payment-success?session_id={CHECKOUT_SESSION_ID}")
            .setCancelUrl(frontendUrl + "/payment-failed")
            .addAllLineItem(lineItems)
            // On stocke l'ID de la réservation pour le retrouver dans le Webhook
            .putMetadata("reservation_id", reservation.getId().toString())
            .build();

        Session session = Session.create(params);
        return session.getUrl();
    }
}
