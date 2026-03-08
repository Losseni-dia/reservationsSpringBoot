package be.event.smartbooking.service.externalApi;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import be.event.smartbooking.api.controller.externalApi.LocationClient;
import be.event.smartbooking.dto.externalApi.ExternalLocationDTO;
import be.event.smartbooking.dto.externalApi.LocationApiResponse;
import be.event.smartbooking.model.Locality;
import be.event.smartbooking.model.Location;
import be.event.smartbooking.repository.LocalityRepos;
import be.event.smartbooking.repository.LocationRepos;

@Service
public class LocationSyncService {

    @Autowired
    private LocationClient locationClient;
    @Autowired
    private LocationRepos locationRepository;
    @Autowired
    private LocalityRepos localityRepository;

    @Transactional
    public void syncLocations() {
        // 1. Appel de l'API (on demande 50 résultats pour tester)
        LocationApiResponse response = locationClient.fetchAllVenues(50);

        if (response != null && response.getResults() != null) {
            for (ExternalLocationDTO dto : response.getResults()) {

                // On vérifie si le nom du lieu existe déjà
                if (dto.getName() != null && !locationRepository.existsByDesignation(dto.getName())) {

                    // Gestion de la localité
                    Locality city = localityRepository.findByLocality(dto.getCity())
                            .orElseGet(() -> {
                                Locality newCity = new Locality();
                                newCity.setLocality(dto.getCity());
                                if (dto.getZipCode() != null) {
                                    try {
                                        newCity.setPostalCode(Long.parseLong(dto.getZipCode()));
                                    } catch (NumberFormatException e) {
                                        // Optionnel : logger l'erreur de format
                                    }
                                }
                                return localityRepository.save(newCity);
                            });

                    // Création de la location
                    Location loc = new Location();
                    loc.setDesignation(dto.getName());
                    loc.setAddress(dto.getStreet());
                    loc.setWebsite(dto.getUrl());
                    loc.setPhone(dto.getPhone());
                    loc.setLocality(city);

                    locationRepository.save(loc);
                }
            }
        }
    }
}