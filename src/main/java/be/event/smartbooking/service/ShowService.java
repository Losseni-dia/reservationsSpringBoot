package be.event.smartbooking.service;

import be.event.smartbooking.errorHandler.BusinessException; // Import de ton exception
import be.event.smartbooking.model.Location;
import be.event.smartbooking.model.Show;
import be.event.smartbooking.model.enumeration.ShowStatus;
import be.event.smartbooking.repository.ShowRepos;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
public class ShowService {

    @Autowired
    private ShowRepos repository;

    @Transactional(readOnly = true)
    public List<Show> getAll() {
        return repository.findAllWithLocationAndStatus(ShowStatus.CONFIRME);
    }

    @Transactional(readOnly = true)
    public List<Show> getAllForAdmin() {
        return repository.findAllWithLocationForAdmin();
    }

    /**
     * Récupère un spectacle par son ID.
     * 
     * @throws BusinessException 404 si non trouvé
     */
    @Transactional(readOnly = true)
    public Show get(Long id) {
        return repository.findById(id)
                .orElseThrow(
                        () -> new BusinessException("Spectacle introuvable avec l'ID : " + id, HttpStatus.NOT_FOUND));
    }

    /**
     * Récupère un spectacle par son slug.
     * 
     * @throws BusinessException 404 si non trouvé
     */
    @Transactional(readOnly = true)
    public Optional<Show> findBySlug(String slug) {
        return repository.findBySlug(slug);
        // Hypothèse : Ton repository doit retourner Optional<Show> pour utiliser
        // orElseThrow
        return Optional.ofNullable(repository.findBySlug(slug))
                .orElseThrow(() -> new BusinessException("Spectacle introuvable (slug: " + slug + ")",
                        HttpStatus.NOT_FOUND));
    }

    @Transactional
    public Show confirmShow(Long id) {
        Show show = get(id); // Réutilise la méthode get() qui gère déjà l'exception 404
        show.setStatus(ShowStatus.CONFIRME);
        log.info("Spectacle confirmé : {}", show.getTitle());
        return repository.save(show);
    }

    @Transactional
    public Show revokeShow(Long id) {
        Show show = get(id);
        show.setStatus(ShowStatus.A_CONFIRMER);
        log.warn("Spectacle révoqué (retour à l'attente) : {}", show.getTitle());
        return repository.save(show);
    }

    @Transactional
    public void update(Long id, Show updatedShow) {
        Show existingShow = get(id);

        existingShow.setTitle(updatedShow.getTitle());
        existingShow.setDescription(updatedShow.getDescription());
        existingShow.setPosterUrl(updatedShow.getPosterUrl());
        existingShow.setBookable(updatedShow.isBookable());
        existingShow.setLocation(updatedShow.getLocation());

        existingShow.getArtistTypes().clear();
        existingShow.getArtistTypes().addAll(updatedShow.getArtistTypes());

        repository.save(existingShow);
    }

    @Transactional
    public void delete(Long id) {
        Show show = get(id); // On vérifie qu'il existe avant de supprimer

        // Sécurité supplémentaire : On peut empêcher la suppression s'il y a des
        // réservations
        if (!show.getRepresentations().isEmpty()) {
            throw new BusinessException("Impossible de supprimer un spectacle ayant des représentations associées.",
                    HttpStatus.CONFLICT);
        }

        repository.delete(show);
        log.warn("Spectacle supprimé définitivement : ID {}", id);
    }

    // --- AUTRES MÉTHODES ---

    @Transactional(readOnly = true)
    public List<Show> getAllBookableShows() {
        return getAll().stream()
                .filter(Show::isBookable)
                .collect(Collectors.toList());
    }

    @Transactional
    public void add(Show show) {
        repository.save(show);
    }

    @Transactional(readOnly = true)
    public List<Show> getFromLocation(Location location) {
        return repository.findByLocation(location);
    }

    @Transactional(readOnly = true)
    public List<Show> search(String title, String location, LocalDateTime start, LocalDateTime end) {
        return repository.searchShows(
                (title != null && !title.isEmpty()) ? title : null,
                (location != null && !location.isEmpty()) ? location : null,
                (start != null) ? start : null,
                (end != null) ? end : null,
                ShowStatus.CONFIRME);
    }
}