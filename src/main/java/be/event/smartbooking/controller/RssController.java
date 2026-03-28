package be.event.smartbooking.controller;


import be.event.smartbooking.view.RssFeedView;
import be.event.smartbooking.service.ShowService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.servlet.View;

@Controller
public class RssController {

    @Autowired
    private ShowService showService;

    @Autowired
    private RssFeedView rssFeedView;

    // Endpoint configuré sur /api/rss 
    @GetMapping("/api/rss")
    public View getRssFeed(Model model) {
        // On utilise la méthode getAllBookableShows() du ShowController
        model.addAttribute("shows", showService.getAllBookableShows());
        
        return rssFeedView;
    }
}