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
        return repository.findAllWithLocationAndConfirmed();
    }

    /**
     * Méthode pour l'ADMIN : Récupère TOUS les spectacles, même ceux à confirmer.
     */
    @Transactional(readOnly = true)
    public List<Show> getAllForAdmin() {
        return repository.findAll();
    }

    /**
     * Action de l'ADMIN : Confirmer un spectacle.
     */
    @Transactional
    public void confirmShow(Long id) {
        Show show = repository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Spectacle non trouvé"));
        show.setStatus(ShowStatus.CONFIRME);
        // Le save est automatique grâce au @Transactional (Dirty Checking)
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
        return repository.findAllWithLocationAndConfirmed().stream()
                .filter(Show::isBookable)
                .collect(Collectors.toList());
    }

    @Transactional
    public void add(Show show) {
        // Le statut sera "A_CONFIRMER" par défaut grâce au @Builder.Default dans l'entité
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
        
        // On peut décider si une modification repasse le spectacle en "A_CONFIRMER"
        // existingShow.setStatus(ShowStatus.A_CONFIRMER); 

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
        // La méthode searchShows du repository filtre déjà par statut "CONFIRME"
        return repository.searchShows(
                (title != null && !title.isEmpty()) ? title : null,
                (location != null && !location.isEmpty()) ? location : null,
                (start != null) ? start : null,
                (end != null) ? end : null
        );
    }
}