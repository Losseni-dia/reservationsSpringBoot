package be.event.smartbooking.service;

import be.event.smartbooking.model.Location;
import be.event.smartbooking.model.Show;
import be.event.smartbooking.repository.ShowRepos;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ShowService {

    @Autowired
    private ShowRepos repository;

    // Tes méthodes existantes (conservées à l’identique)
    public List<Show> getAll() {
        List<Show> shows = new ArrayList<>();
        repository.findAll().forEach(shows::add);
        return shows;
    }
    
    public Show get(Long id) {
        try {
            Long indice = Long.valueOf(id);
            Optional<Show> show = repository.findById(indice);
            return show.orElse(null);
        } catch (NumberFormatException e) {
            return null;
        }
    }

    public void add(Show show) {
        repository.save(show);
    }

    public void update(String id, Show show) {
        repository.save(show);
    }

    public void delete(String id) {
        try {
            Long indice = Long.valueOf(id);
            repository.deleteById(indice);
        } catch (NumberFormatException e) {
            // rien à faire
        }
    }

    public List<Show> getFromLocation(Location location) {
        return repository.findByLocation(location);
    }

    // LES 2 MÉTHODES QUE TU DEMANDES (ajoutées dans ton style)

    /**
     * Retourne uniquement les spectacles réservables (bookable = true)
     */
    public List<Show> getAllBookableShows() {
        List<Show> allShows = new ArrayList<>();
        List<Show> bookableShows = new ArrayList<>();

        repository.findAll().forEach(allShows::add);

        for (Show show : allShows) {
            if (show.isBookable()) { // ou show.getBookable() selon ton getter
                bookableShows.add(show);
            }
        }

        return bookableShows;
    }

    /**
     * Recherche un spectacle par son slug (ex: "le-misanthrope-2025")
     */
    public Show findBySlug(String slug) {
        List<Show> allShows = new ArrayList<>();
        repository.findAll().forEach(allShows::add);

        for (Show show : allShows) {
            if (show.getSlug() != null && show.getSlug().equals(slug)) {
                return show;
            }
        }
        return null; // pas trouvé
    }
}