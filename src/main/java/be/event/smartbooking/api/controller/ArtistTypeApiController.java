package be.event.smartbooking.api.controller;

import be.event.smartbooking.dto.ArtistTypeDTO;
import be.event.smartbooking.repository.ArtistTypeRepos;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;


@RestController
@RequestMapping("/api/artist-types") // C'est cette ligne qui corrige le 404
public class ArtistTypeApiController {

    @Autowired
    private ArtistTypeRepos artistTypeRepository;

   

    @GetMapping
    public List<ArtistTypeDTO> getAll() {
        return artistTypeRepository.findAll().stream()
                .map(at -> ArtistTypeDTO.builder()
                        .id(at.getId())
                        .firstname(at.getArtist().getFirstname())
                        .lastname(at.getArtist().getLastname())
                        .type(at.getType().getType())
                        .build())
                .toList(); // Utilise .toList() (Java 16+) ou .collect(Collectors.toList())
    }
}