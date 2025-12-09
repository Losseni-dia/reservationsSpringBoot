package be.event.smartbooking.api.hateoas;

import org.springframework.hateoas.server.RepresentationModelAssembler;
import org.springframework.stereotype.Component;

import be.event.smartbooking.api.controller.ArtistApiController;
import be.event.smartbooking.model.Artist;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.*;

import org.springframework.hateoas.EntityModel;

@Component
public class ArtistModelAssembler implements RepresentationModelAssembler<Artist, EntityModel<Artist>> {

    @Override
    public EntityModel<Artist> toModel(Artist artist) {
        return EntityModel.of(artist,
                linkTo(methodOn(ArtistApiController.class)
                        .one(artist.getId())).withSelfRel(),
                linkTo(methodOn(ArtistApiController.class).all())
                        .withRel("artists"));
    }
}
