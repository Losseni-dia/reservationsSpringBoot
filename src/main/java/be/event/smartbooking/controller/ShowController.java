package be.event.smartbooking.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import be.event.smartbooking.model.Show;
import be.event.smartbooking.service.ShowService;

@Controller
public class ShowController {
    @Autowired
    ShowService service;

    @GetMapping("/shows")
    public String index(Model model) {
        List<Show> shows = service.getAll();

        model.addAttribute("shows", shows);
        model.addAttribute("title", "Liste des spectacles");

        return "show/index";
    }

    @GetMapping("/shows/{id}")
    public String show(Model model, @PathVariable("id") String id) {
        Show show = service.get(id);

        model.addAttribute("show", show);
        model.addAttribute("title", "Fiche d'un spectacle");

        return "show/show";
    }
    
}
