package be.event.smartbooking.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;

import be.event.smartbooking.model.Artist;
import be.event.smartbooking.service.ArtistService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

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
    public String show(Model model, @PathVariable("id") Long id) {
        Artist artist = artistService.getArtistById(id);

        model.addAttribute("artist", artist);
        model.addAttribute("title", "Fiche d'un artiste");

        return "artist/show";

    }
    


}
