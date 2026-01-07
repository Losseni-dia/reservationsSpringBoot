package be.event.smartbooking.api.controller;

import be.event.smartbooking.dto.ReservationItemRequest;
import be.event.smartbooking.model.Reservation;
import be.event.smartbooking.model.User;
import be.event.smartbooking.service.ReservationService;
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

    // Créer une nouvelle réservation
    @PostMapping
    public ResponseEntity<?> create(@RequestBody List<ReservationItemRequest> items, Principal principal) {
        // Principal permet de récupérer l'utilisateur connecté via Spring Security
        User user = userService.findByEmail(principal.getName());
        Reservation res = reservationService.createReservation(user, items);
        return ResponseEntity.ok("Réservation enregistrée avec l'ID : " + res.getId());
    }

    // Historique des réservations de l'utilisateur
    @GetMapping("/my-bookings")
    public List<Reservation> getMyReservations(Principal principal) {
        User user = userService.findByEmail(principal.getName());
        return reservationService.getUserReservations(user);
    }
}