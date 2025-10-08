package be.event.smartbooking.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import be.event.smartbooking.model.Location;
import be.event.smartbooking.model.Representation;
import be.event.smartbooking.model.Show;
import be.event.smartbooking.repository.RepresentationRepos;

@Service
public class RepresentationService {
    @Autowired
    private RepresentationRepos repository;

    public List<Representation> getAll() {
        List<Representation> representations = new ArrayList<>();

        repository.findAll().forEach(representations::add);

        return representations;
    }

    public Representation get(String id) {
        Long indice = (long) Integer.parseInt(id);
        Optional<Representation> representation = repository.findById(indice);

        return representation.isPresent() ? representation.get() : null;
    }

    public void add(Representation representation) {
        repository.save(representation);
    }

    public void update(String id, Representation representation) {
        repository.save(representation);
    }

    public void delete(String id) {
        Long indice = (long) Integer.parseInt(id);

        repository.deleteById(indice);
    }

    public List<Representation> getFromLocation(Location location) {
        return repository.findByLocation(location);
    }

    public List<Representation> getFromShow(Show show) {
        return repository.findByShow(show);
    }
}
