package be.event.smartbooking.service.externalApi;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import be.event.smartbooking.api.controller.externalApi.LocationClient;
import be.event.smartbooking.dto.externalApi.ExternalLocationDTO;
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

    public void syncLocations() {
        List<ExternalLocationDTO> externalData = locationClient.fetchAllVenues();

        for (ExternalLocationDTO dto : externalData) {
            // Éviter les doublons par désignation ou adresse
            if (!locationRepository.existsByDesignation(dto.getName())) {
                Location loc = new Location();
                loc.setDesignation(dto.getName());
                loc.setAddress(dto.getStreet());
                loc.setWebsite(dto.getUrl());

                // IMPORTANT: Gérer la localité (ManyToOne)
                Locality city = localityRepository.findByLocality(dto.getCity())
                        .orElseGet(() -> localityRepository.save(new Locality(dto.getCity())));
                loc.setLocality(city);

                locationRepository.save(loc);
            }
        }
    }
}