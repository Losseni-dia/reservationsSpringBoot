package be.event.smartbooking.controller;

import be.event.smartbooking.model.Artist;
import be.event.smartbooking.model.ArtistType;
import be.event.smartbooking.model.Review;
import be.event.smartbooking.model.Show;
import be.event.smartbooking.service.ReviewService;
import be.event.smartbooking.service.ShowService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

@Controller
@RequestMapping("/shows")
public class ShowController {

    @Autowired
    private ShowService showService;

    @Autowired
    private ReviewService reviewService;

    // Liste de tous les spectacles réservables
    @GetMapping
    public String index(Model model) {
        model.addAttribute("shows", showService.getAllBookableShows());
        model.addAttribute("title", "Tous les spectacles");
        return "show/index";
    }

    // Détail d’un spectacle via son slug (URL propre)
    @GetMapping("/{slug}")
    public String show(@PathVariable String slug, Model model) {

        // Récupération du spectacle par slug
        Show show = showService.findBySlug(slug);

        // Si pas trouvé → page 404 propre
        if (show == null) {
            return "error/404"; // ou "redirect:/shows"
        }

        // === Regroupement des artistes par type (ta logique préférée, avec boucles
        // classiques) ===
        Map<String, ArrayList<Artist>> collaborateurs = new TreeMap<>();

        for (ArtistType at : show.getArtistTypes()) {
            String type = at.getType().getType(); // ou .getType() selon ton enum

            if (collaborateurs.get(type) == null) {
                collaborateurs.put(type, new ArrayList<>());
            }
            collaborateurs.get(type).add(at.getArtist());
        }

        // === Avis validés uniquement ===
        List<Review> reviews = reviewService.getValidatedReviewsByShow(show.getId());

        // === Données envoyées à la vue ===
        model.addAttribute("show", show);
        model.addAttribute("collaborateurs", collaborateurs);
        model.addAttribute("reviews", reviews);
        model.addAttribute("averageRating", show.getAverageRating());
        model.addAttribute("reviewCount", show.getReviewCount());
        model.addAttribute("newReview", new Review()); // Pour le formulaire d'avis
        model.addAttribute("title", show.getTitle());

        return "show/show";
    }
}