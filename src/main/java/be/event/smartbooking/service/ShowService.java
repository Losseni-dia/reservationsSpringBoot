package be.event.smartbooking.service;

import be.event.smartbooking.model.Location;
import be.event.smartbooking.model.Show;
import be.event.smartbooking.repository.ShowRepos;
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
     * Récupère tous les spectacles avec leur lieu chargé (JOIN FETCH)
     * Indispensable pour éviter l'erreur 500 dans le contrôleur API.
     */
    @Transactional(readOnly = true)
    public List<Show> getAll() {
        return repository.findAllWithLocation();
    }

    /**
     * Recherche un spectacle par son slug via le Repository (Plus rapide que la
     * boucle)
     */
    @Transactional(readOnly = true)
    public Show findBySlug(String slug) {
        return repository.findBySlug(slug);
    }

    /**
     * Récupère un spectacle par ID
     */
    @Transactional(readOnly = true)
    public Show get(Long id) {
        return repository.findById(id).orElse(null);
    }

    /**
     * Retourne uniquement les spectacles réservables
     */
    @Transactional(readOnly = true)
    public List<Show> getAllBookableShows() {
        // Version optimisée avec Stream
        return repository.findAllWithLocation().stream()
                .filter(Show::isBookable)
                .collect(Collectors.toList());
    }

    @Transactional
    public void add(Show show) {
        repository.save(show);
    }

    @Transactional
    public void update(Long id, Show show) {
        show.setId(id);
        repository.save(show);
    }

    @Transactional
    public void delete(Long id) {
        repository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public List<Show> getFromLocation(Location location) {
        return repository.findByLocation(location);
    }

    //methode de recherche optimisée utilisant la requête définie dans le repository
    @Transactional(readOnly = true)
    public List<Show> search(String title, String location, LocalDateTime start, LocalDateTime end) {
        return repository.searchShows(
                (title != null && !title.isEmpty()) ? title : null,
                (location != null && !location.isEmpty()) ? location : null,
                (start != null) ? start : null,
                (end != null) ? end : null
                
        );
    
                
    }
}