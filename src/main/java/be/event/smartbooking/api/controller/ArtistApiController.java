package be.event.smartbooking.api.controller;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

import java.util.List;

import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import be.event.smartbooking.api.hateoas.ArtistModelAssembler;
import be.event.smartbooking.model.Artist;
import be.event.smartbooking.repository.ArtistRepos;

@RestController
@RequestMapping("/api")
public class ArtistApiController {

    private final ArtistRepos repository;
    private final ArtistModelAssembler assembler;

    public ArtistApiController(ArtistRepos repository, ArtistModelAssembler assembler) {
        this.repository = repository;
        this.assembler = assembler;
    }

    // GET all artists
    @GetMapping("/artists")
    public CollectionModel<EntityModel<Artist>> all() {
        List<EntityModel<Artist>> artists = ((List<Artist>) repository.findAll()).stream()
                .map(assembler::toModel)
                .toList();

        return CollectionModel.of(artists,
                linkTo(methodOn(ArtistApiController.class).all()).withSelfRel());
    }

    // GET a single artist
    @GetMapping("/artists/{id}")
    public EntityModel<Artist> one(@PathVariable Long id) {
        Artist artist = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Artist not found"));

        return assembler.toModel(artist);
    }

    // POST a new artist
    @PostMapping("/admin/artists")
    public ResponseEntity<?> newArtist(@RequestBody Artist newArtist) {
        Artist savedArtist = repository.save(newArtist);

        return ResponseEntity
                .created(linkTo(methodOn(ArtistApiController.class).one(savedArtist.getId())).toUri())
                .body(assembler.toModel(savedArtist));
    }

    // PUT (update) an artist
    @PutMapping("/admin/artists/{id}")
    public ResponseEntity<?> replaceArtist(@RequestBody Artist newArtist, @PathVariable Long id) {
        Artist updatedArtist = repository.findById(id)
                .map(artist -> {
                    artist.setFirstname(newArtist.getFirstname());
                    artist.setLastname(newArtist.getLastname());
                    return repository.save(artist);
                })
                .orElseGet(() -> {
                    newArtist.setId(id);
                    return repository.save(newArtist);
                });

        return ResponseEntity
                .created(linkTo(methodOn(ArtistApiController.class).one(updatedArtist.getId())).toUri())
                .body(assembler.toModel(updatedArtist));
    }

    // DELETE an artist
    @DeleteMapping("/admin/artists/{id}")
    public ResponseEntity<?> deleteArtist(@PathVariable Long id) {
        repository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
