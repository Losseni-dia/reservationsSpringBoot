package be.event.smartbooking.service.externalApi;

import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import be.event.smartbooking.api.controller.externalApi.LocationClient;
import be.event.smartbooking.dto.externalApi.ExternalLocationDTO;
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

    @Transactional // Sécurité : si un import plante, rien n'est cassé en base
    public void syncLocations() {
        log.info("Démarrage de la synchronisation des lieux...");

        try {
            List<ExternalLocationDTO> externalData = locationClient.fetchAllVenues();
            int count = 0;

            for (ExternalLocationDTO dto : externalData) {
                // 1. Vérification du doublon
                if (!locationRepository.existsByDesignation(dto.getName())) {

                    // 2. Récupération ou création de la Localité
                    Locality city = localityRepository.findByLocality(dto.getCity())
                            .orElseGet(() -> {
                                Locality newCity = new Locality();
                                newCity.setLocality(dto.getCity());
                                // Si ton DTO a le code postal, ajoute-le ici :
                                // newCity.setPostalCode(Long.parseLong(dto.getZipCode()));
                                return localityRepository.save(newCity);
                            });

                    // 3. Création du nouveau lieu
                    Location loc = new Location();
                    loc.setDesignation(dto.getName());
                    loc.setAddress(dto.getStreet());
                    loc.setWebsite(dto.getUrl());
                    loc.setPhone(dto.getPhone());
                    loc.setLocality(city);

                    locationRepository.save(loc);
                    count++;
                }
            }
            log.info("Synchronisation terminée : {} nouveaux lieux ajoutés.", count);
        } catch (Exception e) {
            log.error("Erreur lors de la synchronisation : {}", e.getMessage());
        }
    }
}