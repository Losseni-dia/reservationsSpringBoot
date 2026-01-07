package be.event.smartbooking.api.controller;

import be.event.smartbooking.model.Location;
import be.event.smartbooking.service.LocationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/locations")
public class LocationApiController {

    @Autowired
    private LocationService locationService;

    @GetMapping
    public List<Location> getAll() {
        // Attention : si Location contient une liste de Shows,
        // assure-toi d'utiliser @JsonIgnore sur la liste dans l'entité Location
        // ou de faire un DTO ici aussi.
        return locationService.getAll();
    }
}