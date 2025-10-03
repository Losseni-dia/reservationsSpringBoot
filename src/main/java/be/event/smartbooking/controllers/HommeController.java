package be.event.smartbooking.controllers;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;

@RestController
public class HommeController {

    @RequestMapping("/")
    public String index() {
        return "Bonjour, bienvenue sur SmartBooking !";
    }
    
}
