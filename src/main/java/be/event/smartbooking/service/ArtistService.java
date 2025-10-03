package be.event.smartbooking.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import be.event.smartbooking.model.Artist;
import be.event.smartbooking.repository.ArtistRepos;

@Service
public class ArtistService {
    
    @Autowired
    private ArtistRepos artistRepos;

    public List<Artist> getAllArtists() {
        return (List<Artist>) artistRepos.findAll();
    }

    public Artist getArtistById(long id) {
        return artistRepos.findById(id);
    }

    public void addArtist(Artist artist) {
        artistRepos.save(artist);
    }

    public void updateArtist(long id, Artist artist) {
        artistRepos.save(artist);
    }

    public void deleteArtist(long id) {
        artistRepos.deleteById(id);
    }
}
