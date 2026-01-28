package be.event.smartbooking.service;

import be.event.smartbooking.model.Location;
import be.event.smartbooking.model.Show;
import be.event.smartbooking.model.enumeration.ShowStatus; // Import de l'enum
import be.event.smartbooking.repository.ShowRepos;
import jakarta.persistence.EntityNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ShowService {

    @Autowired
    private ShowRepos repository;

    /**
     * Récupère uniquement les spectacles CONFIRMÉS pour le catalogue public.
     */
    @Transactional(readOnly = true)
    public List<Show> getAll() {
        // On utilise la nouvelle méthode filtrée du repository
        return repository.findAllWithLocationAndStatus(ShowStatus.CONFIRME);
    }

    /**
     * Méthode pour l'ADMIN : Récupère TOUS les spectacles, même ceux à confirmer.
     */
    @Transactional(readOnly = true)
    public List<Show> getAllForAdmin() {
        return repository.findAllWithLocationForAdmin();
    }

    /**
     * Action de l'ADMIN : Confirmer un spectacle.
     */
    @Transactional
    public Show confirmShow(Long id) { // Change ShowDTO en Show
        Show show = repository.findById(id)
            .orElseThrow(() -> new RuntimeException("Spectacle non trouvé"));
        show.setStatus(ShowStatus.CONFIRME);
        return repository.save(show); // On retourne l'entité directement
    }

    @Transactional(readOnly = true)
    public Show findBySlug(String slug) {
        return repository.findBySlug(slug);
    }

    @Transactional(readOnly = true)
    public Show get(Long id) {
        return repository.findById(id).orElse(null);
    }

    @Transactional(readOnly = true)
    public List<Show> getAllBookableShows() {
        // On filtre par bookable ET par statut confirmé
        return repository.findAllWithLocationAndStatus(ShowStatus.CONFIRME).stream()
                .filter(Show::isBookable)
                .collect(Collectors.toList());
    }

    @Transactional
    public void add(Show show) {
        repository.save(show);
    }

    @Transactional
    public void update(Long id, Show updatedShow) {
        Show existingShow = repository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Spectacle non trouvé"));

        existingShow.setTitle(updatedShow.getTitle());
        existingShow.setDescription(updatedShow.getDescription());
        existingShow.setPosterUrl(updatedShow.getPosterUrl());
        existingShow.setBookable(updatedShow.isBookable());
        existingShow.setLocation(updatedShow.getLocation());
        

        existingShow.getArtistTypes().clear();
        existingShow.getArtistTypes().addAll(updatedShow.getArtistTypes());
    }

    @Transactional
    public void delete(Long id) {
        repository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public List<Show> getFromLocation(Location location) {
        return repository.findByLocation(location);
    }

    @Transactional(readOnly = true)
    public List<Show> search(String title, String location, LocalDateTime start, LocalDateTime end) {
        // On force le statut CONFIRME pour la recherche publique
        return repository.searchShows(
                (title != null && !title.isEmpty()) ? title : null,
                (location != null && !location.isEmpty()) ? location : null,
                (start != null) ? start : null,
                (end != null) ? end : null,
                ShowStatus.CONFIRME
        );
    }
    @Transactional
    public Show revokeShow(Long id) {
        Show show = repository.findById(id)
            .orElseThrow(() -> new RuntimeException("Spectacle non trouvé"));
        show.setStatus(ShowStatus.A_CONFIRMER);
    return repository.save(show);
}
}  