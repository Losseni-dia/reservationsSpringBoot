package be.event.smartbooking.service;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import be.event.smartbooking.errorHandler.BusinessException;
import be.event.smartbooking.model.Location;
import be.event.smartbooking.model.Representation;
import be.event.smartbooking.model.Show;
import be.event.smartbooking.repository.RepresentationRepos;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@Transactional(readOnly = true)
public class RepresentationService {

    @Autowired
    private RepresentationRepos repository;

    public List<Representation> getAll() {
        return StreamSupport.stream(repository.findAll().spliterator(), false)
                .collect(Collectors.toList());
    }

    /**
     * Récupère une séance par son ID.
     * 
     * @throws BusinessException 404 si non trouvée
     */
    public Representation get(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new BusinessException("Séance (représentation) introuvable avec l'ID : " + id,
                        HttpStatus.NOT_FOUND));
    }

    // Surcharge pour gérer les ID en String venant des contrôleurs
    public Representation get(String id) {
        try {
            return get(Long.parseLong(id));
        } catch (NumberFormatException e) {
            throw new BusinessException("Format d'identifiant invalide : " + id, HttpStatus.BAD_REQUEST);
        }
    }

    @Transactional
    public void add(Representation representation) {
        log.info("Ajout d'une nouvelle séance pour le spectacle : {}",
                representation.getShow() != null ? representation.getShow().getTitle() : "Inconnu");
        repository.save(representation);
    }

    @Transactional
    public void update(Long id, Representation updatedRepresentation) {
        Representation existing = get(id); // Vérifie l'existence

        // Mise à jour des champs
        existing.setWhen(updatedRepresentation.getWhen());
        existing.setLocation(updatedRepresentation.getLocation());
        existing.setShow(updatedRepresentation.getShow());

        repository.save(existing);
        log.info("Séance ID {} mise à jour.", id);
    }

    @Transactional
    public void delete(Long id) {
        Representation representation = get(id); // Vérifie l'existence
        repository.delete(representation);
        log.warn("Séance ID {} supprimée définitivement.", id);
    }

    public List<Representation> getFromLocation(Location location) {
        return repository.findByLocation(location);
    }

    public List<Representation> getFromShow(Show show) {
        return repository.findByShow(show);
    }
}