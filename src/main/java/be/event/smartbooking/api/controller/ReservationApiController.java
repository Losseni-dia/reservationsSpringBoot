package be.event.smartbooking.api.controller;

import be.event.smartbooking.dto.ReservationItemRequest;
import be.event.smartbooking.model.Reservation;
import be.event.smartbooking.model.User;
import be.event.smartbooking.service.ReservationService;
import be.event.smartbooking.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reservations")
public class ReservationApiController {

    @Autowired
    private ReservationService reservationService;

    @Autowired
    private UserService userService;

    @PostMapping
    public ResponseEntity<?> createReservation(
            @RequestBody List<ReservationItemRequest> items, 
            Principal principal) { 
        
        // Sécurité supplémentaire : si principal est null, c'est un 401
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Utilisateur non connecté"));
        }

        try {
            User currentUser = userService.findByLogin(principal.getName());
            // On appelle la méthode de paiement qui elle-même appelle createReservation
            String stripeUrl = reservationService.processStripePayment(items, currentUser);
            
            return ResponseEntity.ok(Map.of("url", stripeUrl));
        } catch (Exception e) {
            // Log l'erreur réelle dans la console pour débugger
            e.printStackTrace(); 
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body(Map.of("message", e.getMessage()));
        }
    }

    // Historique des réservations de l'utilisateur
    @GetMapping("/my-bookings")
    public List<Reservation> getMyReservations(Principal principal) {
        User user = userService.findByLogin(principal.getName());
        return reservationService.getUserReservations(user);
    }
}