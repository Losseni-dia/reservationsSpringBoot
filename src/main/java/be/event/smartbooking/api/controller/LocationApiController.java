package be.event.smartbooking.api.controller;

import be.event.smartbooking.dto.LocationDTO;
import be.event.smartbooking.model.Location;
import be.event.smartbooking.service.LocationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/locations")
public class LocationApiController {

    @Autowired
    private LocationService locationService;

    @GetMapping
    public List<LocationDTO> getAll() {
        // 1. On récupère la liste des entités
        List<Location> locations = locationService.getAll();

        // 2. On utilise les Streams pour transformer chaque entité en DTO
        return locations.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Méthode utilitaire de conversion
    private LocationDTO convertToDTO(Location loc) {
        return LocationDTO.builder()
                .id(loc.getId())
                .designation(loc.getDesignation())
                .address(loc.getAddress())
                .website(loc.getWebsite())
                // On récupère le nom de la ville depuis l'objet Locality
                .localityName(loc.getLocality() != null ? loc.getLocality().getLocality() : "Ville inconnue")
                .build();
    }
}