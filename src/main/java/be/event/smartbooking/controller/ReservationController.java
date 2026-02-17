package be.event.smartbooking.controller;

import java.util.List;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import be.event.smartbooking.model.Reservation;
import be.event.smartbooking.model.User;
import be.event.smartbooking.service.ReservationService;

@Controller
@RequestMapping("/reservations")
public class ReservationController {

    private final ReservationService reservationService;

    public ReservationController(ReservationService reservationService) {
        this.reservationService = reservationService;
    }

    // Liste de MES réservations
    @GetMapping
    public String myReservations(@AuthenticationPrincipal User currentUser, Model model) {
        List<Reservation> reservations = reservationService.getUserReservations(currentUser);
        model.addAttribute("reservations", reservations);
        model.addAttribute("title", "Mes réservations");
        return "reservation/index";
    }

    // Détail d'une réservation
    @GetMapping("/{id}")
    public String show(@PathVariable Long id,
            @AuthenticationPrincipal User currentUser,
            Model model,
            RedirectAttributes redirectAttributes) {

        Reservation reservation = reservationService.getByIdAndUser(id, currentUser.getId());

        if (reservation == null) {
            redirectAttributes.addFlashAttribute("errorMessage", "Réservation non trouvée ou accès refusé.");
            return "redirect:/reservations";
        }

        model.addAttribute("reservation", reservation);
        model.addAttribute("title", "Réservation #" + id);
        return "reservation/show";
    }

    // Annuler une réservation (seulement si PENDING ou CONFIRMED)
    @PostMapping("/{id}/cancel")
    public String cancel(@PathVariable Long id,
            @AuthenticationPrincipal User currentUser,
            RedirectAttributes redirectAttributes) {

        try {
            reservationService.cancelReservation(id, currentUser);
            redirectAttributes.addFlashAttribute("successMessage", "Réservation annulée avec succès.");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("errorMessage", e.getMessage());
        }
        return "redirect:/reservations";
    }
}