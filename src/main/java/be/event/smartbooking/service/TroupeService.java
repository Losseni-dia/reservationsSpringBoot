package be.event.smartbooking.service;

import be.event.smartbooking.errorHandler.BusinessException;
import be.event.smartbooking.model.Artist;
import be.event.smartbooking.model.Troupe;
import be.event.smartbooking.repository.ArtistRepos;
import be.event.smartbooking.repository.TroupeRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
public class TroupeService {

    @Autowired
    private TroupeRepository troupeRepository;

    @Autowired
    private ArtistRepos artistRepository;

    @Transactional(readOnly = true)
    public List<Troupe> getAll() {
        return troupeRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Troupe get(Long id) {
        return troupeRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Troupe introuvable avec l'ID : " + id, HttpStatus.NOT_FOUND));
    }

    /**
     * Affecte un artiste à une troupe.
     * Si troupeId est null, l'artiste est désaffilié (Non affilié).
     */
    @Transactional
    public Artist assignArtistToTroupe(Long artistId, Long troupeId) {
        Artist artist = artistRepository.findById(artistId)
                .orElseThrow(() -> new BusinessException("Artiste introuvable avec l'ID : " + artistId, HttpStatus.NOT_FOUND));

        if (troupeId == null) {
            artist.setTroupe(null);
            log.info("Artiste {} désaffilié de sa troupe", artistId);
        } else {
            Troupe troupe = get(troupeId);
            artist.setTroupe(troupe);
            log.info("Artiste {} affecté à la troupe '{}'", artistId, troupe.getName());
        }

        return artistRepository.save(artist);
    }
}
