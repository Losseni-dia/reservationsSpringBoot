package be.event.smartbooking.service.externalApi;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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

    private static final Logger log = LoggerFactory.getLogger(LocationSyncService.class);

    @Autowired
    private LocationClient locationClient;

    @Autowired
    private LocationRepos locationRepository;

    @Autowired
    private LocalityRepos localityRepository;

    @Transactional
    public int syncLocations(int limit) {
        LocationApiResponse response = locationClient.fetchAllVenues(limit);
        int addedCount = 0;

        if (response != null && response.getResults() != null) {
            for (ExternalLocationDTO dto : response.getResults()) {

                // On ignore si le nom est vide ou si le lieu existe déjà
                if (dto.getName() != null && !locationRepository.existsByDesignation(dto.getName())) {

                    // 1. Gestion de la localité
                    String cityName = (dto.getCity() != null) ? dto.getCity() : "Inconnu";
                    Locality city = localityRepository.findByLocality(cityName)
                            .orElseGet(() -> {
                                Locality newCity = new Locality();
                                newCity.setLocality(cityName);
                                if (dto.getZipCode() != null) {
                                    try {
                                        newCity.setPostalCode(Long.parseLong(dto.getZipCode()));
                                    } catch (Exception e) {
                                        /* ignore format error */ }
                                }
                                return localityRepository.save(newCity);
                            });

                    // 2. Création de la Location avec ses vraies infos
                    Location loc = new Location();
                    loc.setDesignation(dto.getName());
                    loc.setAddress((dto.getStreet() != null) ? dto.getStreet() : "Adresse non communiquée");
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