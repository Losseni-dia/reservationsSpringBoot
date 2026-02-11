package be.event.smartbooking.api.controller;

import be.event.smartbooking.dto.ReservationItemRequest;
import be.event.smartbooking.model.RepresentationReservation;
import be.event.smartbooking.model.Reservation;
import be.event.smartbooking.model.User;
import be.event.smartbooking.repository.RepresentationReservationRepository;
import be.event.smartbooking.service.ReservationService;
import be.event.smartbooking.service.StripeService;
import be.event.smartbooking.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/reservations")
public class ReservationApiController {

    @Autowired
    private ReservationService reservationService;

    @Autowired
    private UserService userService;

    @Autowired
    private StripeService stripeService;
     
    @Autowired
    private RepresentationReservationRepository representationReservationRepository ;

    @PostMapping
    public ResponseEntity<?> create(@RequestBody List<ReservationItemRequest> items, Principal principal) {
        User user = userService.findByLogin(principal.getName());
        
        // 1. On crée la réservation en PENDING (ton code actuel)
        Reservation res = reservationService.createReservation(user, items);
        
        // 2. On récupère les items complets pour calculer le prix dans Stripe
        // (Tu devras peut-être ajouter une méthode dans ton service pour récupérer les items créés)
        
        try {
            // Simulation d'une méthode pour avoir les détails des items de la résa
            List<RepresentationReservation> detailedItems = representationReservationRepository.findByReservation(res);
            
            // 3. On génère l'URL Stripe
            String checkoutUrl = stripeService.createCheckoutSession(res, detailedItems);
            
            // On renvoie l'URL au frontend React
            return ResponseEntity.ok(java.util.Collections.singletonMap("url", checkoutUrl));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erreur Stripe : " + e.getMessage());
        }
    }

    // Historique des réservations de l'utilisateur
    @GetMapping("/my-bookings")
    public List<Reservation> getMyReservations(Principal principal) {
        User user = userService.findByEmail(principal.getName());
        return reservationService.getUserReservations(user);
    }
}