package be.event.smartbooking.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;

import be.event.smartbooking.model.Artist;
import be.event.smartbooking.service.ArtistService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;



@Controller
public class ArtistController {

    @Autowired
    ArtistService artistService;

    @GetMapping("/artists")
    public String index(Model model) {
        List<Artist> artists = artistService.getAllArtists();

        model.addAttribute("artists", artists);

        return "artist/index";

    }

    @GetMapping("/artists/{id}")
    public String showArtist(Model model, @PathVariable("id") Long id) {
        Artist artist = artistService.getArtistById(id);

        model.addAttribute("artist", artist);
        model.addAttribute("title", "Fiche d'un artiste");

        return "artist/show";

    }

    @GetMapping("/artists/{id}/edit")
    public String editArtist(Model model, @PathVariable("id") Long id, HttpServletRequest request) {
        Artist artist = artistService.getArtistById(id);

        model.addAttribute("artist", artist);

        //Générer le lien de retour pour l'annulation
        String referrer = request.getHeader("Referer");

        if (referrer != null && !referrer.equals("")) {
            model.addAttribute("back", referrer);

        } else {
            model.addAttribute("back", "/artists/" + artist.getId());
        }

        return "artist/edit";

    }
    
    @PutMapping("artist/{id}/edit")
    public String updateArtist(@Valid @ModelAttribute Artist artist, BindingResult bindingResult, @PathVariable long id,
            Model model) {
        if (bindingResult.hasErrors()) {
            model.addAttribute("artist", artist);
            return "artist/edit";
        }

        Artist existingArtist = artistService.getArtistById(id);
        if (existingArtist == null) {
            // Gérer le cas où l'artiste n'existe pas
            return "redirect:/artists";
        }

        artistService.updateArtist(id, artist);
        return "redirect:/artists/" + artist.getId();
    }

    @GetMapping("artists/create")
    public String createArtist(Model model) {
        Artist artist = new Artist();

        model.addAttribute("artist", artist);

        return "artist/create";
    }
    
    @PostMapping("artists/create")
    public String storeArtist(@Valid @ModelAttribute Artist artist, BindingResult bindingResult, Model model) {

        if (bindingResult.hasErrors()) {
            return "artist/create";
        }

        artistService.addArtist(artist);
        return "redirect:/artists/" + artist.getId();
    }

    @DeleteMapping("artists/{id}")
    public String deleteArtist(@PathVariable Long id, Model model) {
        Artist existingArtist = artistService.getArtistById(id);
        
        if (existingArtist != null) {
            artistService.deleteArtist(id);
        }
        return "redirect:/artists";
    }
    
    


}
