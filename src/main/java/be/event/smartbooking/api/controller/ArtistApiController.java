package be.event.smartbooking.api.controller;

import be.event.smartbooking.dto.ArtistDTO;
import be.event.smartbooking.model.Artist;
import be.event.smartbooking.service.ArtistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/artists")
public class ArtistApiController {

    @Autowired
    private ArtistService artistService; // Utilisation du Service au lieu du Repo

    @GetMapping
    public List<ArtistDTO> getAll() {
        return artistService.getAllArtists().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ArtistDTO getOne(@PathVariable Long id) {
        Artist artist = artistService.getArtistById(id);
        return (artist != null) ? convertToDto(artist) : null;
    }

    @PostMapping("/admin")
    public ArtistDTO save(@RequestBody Artist artist) {
        artistService.addArtist(artist);
        return convertToDto(artist);
    }

    @DeleteMapping("/admin/{id}")
    public void delete(@PathVariable Long id) {
        artistService.deleteArtist(id);
    }

    // Méthode interne pour transformer l'entité en DTO proprement
    private ArtistDTO convertToDto(Artist artist) {
        return ArtistDTO.builder()
                .id(artist.getId())
                .firstname(artist.getFirstname())
                .lastname(artist.getLastname())
                .build();
    }
}