package be.event.smartbooking.controller;

import be.event.smartbooking.model.Review;
import be.event.smartbooking.model.Show;
import be.event.smartbooking.model.User;
import be.event.smartbooking.service.ReviewService;
import be.event.smartbooking.service.ShowService;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
@RequestMapping("/reviews")
public class ReviewController {

    private final ReviewService reviewService;
    private final ShowService showService;

    public ReviewController(ReviewService reviewService, ShowService showService) {
        this.reviewService = reviewService;
        this.showService = showService;
    }

    // Liste des avis en attente de validation (admin)
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/moderation")
    public String moderation(Model model) {
        model.addAttribute("reviews", reviewService.getPendingReviews());
        model.addAttribute("title", "Modération des avis");
        return "review/moderation";
    }

    // Publier un avis
    @PostMapping("/shows/{showId}")
    public String createReview(@PathVariable Long showId,
            @AuthenticationPrincipal User user,
            @Valid @ModelAttribute Review review,
            BindingResult bindingResult,
            Model model,
            RedirectAttributes redirectAttributes) {

        Show show = showService.get(showId);
        if (show == null) {
            redirectAttributes.addFlashAttribute("errorMessage", "Spectacle non trouvé.");
            return "redirect:/shows";
        }

        if (bindingResult.hasErrors()) {
            model.addAttribute("show", show);
            model.addAttribute("errorMessage", "Veuillez corriger les erreurs.");
            return "show/show"; // ou une page dédiée
        }

      

        return "redirect:/shows/" + showId;
    }

    // Valider un avis (admin)
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/{id}/validate")
    public String validate(@PathVariable Long id, RedirectAttributes redirectAttributes) {
        try {
            reviewService.validateReview(id);
            redirectAttributes.addFlashAttribute("successMessage", "Avis publié avec succès !");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("errorMessage", "Impossible de valider l'avis.");
        }
        return "redirect:/reviews/moderation";
    }

    // Supprimer un avis (admin)
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/{id}/delete")
    public String delete(@PathVariable Long id, RedirectAttributes redirectAttributes) {
        reviewService.deleteReview(id);
        redirectAttributes.addFlashAttribute("successMessage", "Avis supprimé.");
        return "redirect:/reviews/moderation";
    }
}