package be.event.smartbooking.api.controller;

import be.event.smartbooking.dto.ArtistDTO;
import be.event.smartbooking.model.Artist;
import be.event.smartbooking.service.ArtistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import be.event.smartbooking.model.Type;

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

    private ArtistDTO convertToDto(Artist artist) {
        List<String> typeLabels = Collections.emptyList();
        if (artist.getTypes() != null && !artist.getTypes().isEmpty()) {
            typeLabels = artist.getTypes().stream()
                    .map(Type::getType)
                    .filter(Objects::nonNull)
                    .collect(Collectors.toList());
        }
        return ArtistDTO.builder()
                .id(artist.getId())
                .firstname(artist.getFirstname())
                .lastname(artist.getLastname())
                .types(typeLabels)
                .build();
    }
}