package be.event.smartbooking.api.controller;

import be.event.smartbooking.model.ArtistType;
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
    public List<ArtistType> getAll() {
        return artistTypeRepository.findAll();
    }
}