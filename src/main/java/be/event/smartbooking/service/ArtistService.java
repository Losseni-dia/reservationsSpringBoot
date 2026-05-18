package be.event.smartbooking.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import be.event.smartbooking.model.Artist;
import be.event.smartbooking.model.enumeration.LanguageLevel;
import be.event.smartbooking.repository.ArtistLanguageRepository;
import be.event.smartbooking.repository.ArtistRepos;

@Service
public class ArtistService {
    
    @Autowired
    private ArtistRepos artistRepos;

    @Autowired
    private ArtistLanguageRepository artistLanguageRepository;

    public List<Artist> getAllArtists() {
        return artistRepos.findAllWithTypes();
    }

    public Artist getArtistById(long id) {
        return artistRepos.findByIdWithTypes(id).orElse(null);
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

    /**
     * Recherche tous les artistes qui parlent une langue donnée au niveau "COURANT".
     * L'annotation readOnly=true optimise les performances de la session Hibernate.
     */
    @Transactional(readOnly = true)
    public List<Artist> findFluentArtistsByLanguage(String languageName) {
        if (languageName == null || languageName.isBlank()) {
            return List.of();
        }
        
        // On force l'utilisation de l'Enum LanguageLevel.COURANT comme imposé par le cahier des charges
        return artistLanguageRepository.findArtistsByLanguageAndLevel(
            languageName.trim(), 
            LanguageLevel.COURANT
        );
    }
}
