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
    public int syncLocations(int limit) {
        // 1. Appel API avec la limite choisie
        LocationApiResponse response = locationClient.fetchAllVenues(limit);
        int addedCount = 0;

        if (response != null && response.getResults() != null) {
            for (ExternalLocationDTO dto : response.getResults()) {

                // Vérifier si le lieu existe déjà (bouclier anti-doublons)
                if (dto.getName() != null && !locationRepository.existsByDesignation(dto.getName())) {

                    // Gestion de la localité
                    Locality city = localityRepository.findByLocality(dto.getCity())
                            .orElseGet(() -> {
                                Locality newCity = new Locality();
                                newCity.setLocality(dto.getCity());
                                if (dto.getZipCode() != null) {
                                    try {
                                        newCity.setPostalCode(Long.parseLong(dto.getZipCode()));
                                    } catch (Exception e) {
                                        /* Log error */ }
                                }
                                return localityRepository.save(newCity);
                            });

                    // Création du lieu
                    Location loc = new Location();
                    loc.setDesignation(dto.getName());
                    loc.setAddress(dto.getStreet());
                    loc.setWebsite(dto.getUrl());
                    loc.setPhone(dto.getPhone());
                    loc.setLocality(city);

                    locationRepository.save(loc);
                    addedCount++;
                }
            }
        }
        return addedCount;
    }
}