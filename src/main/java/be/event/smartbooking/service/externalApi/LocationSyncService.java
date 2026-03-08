package be.event.smartbooking.service.externalApi;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled; // Import nécessaire
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

    /**
     * Tâche planifiée : s'exécute le 1er et le 16 de chaque mois à 03:00 AM.
     * Cron : "seconde minute heure jour mois jour_semaine"
     */
    @Scheduled(cron = "0 0 3 1,16 * *")
    public void scheduledSync() {
        log.info(">>> DÉMARRAGE DE LA SYNCHRONISATION AUTOMATIQUE (Bimensuelle)");
        try {
            // On tente d'importer les 50 premiers lieux
            int added = syncLocations(10);
            log.info(">>> SYNCHRONISATION TERMINÉE : {} nouveaux lieux ajoutés.", added);
        } catch (Exception e) {
            log.error(">>> ERREUR lors de la synchronisation automatique : {}", e.getMessage());
        }
    }

    @Transactional
    public int syncLocations(int limit) {
        LocationApiResponse response = locationClient.fetchAllVenues(limit);
        int addedCount = 0;

        if (response != null && response.getResults() != null) {
            for (ExternalLocationDTO dto : response.getResults()) {

                // On vérifie le nom (denomination dans le JSON)
                if (dto.getName() != null && !locationRepository.existsByDesignation(dto.getName())) {

                    // 1. Localité
                    String cityName = (dto.getCity() != null) ? dto.getCity() : "Inconnu";
                    Locality city = localityRepository.findByLocality(cityName)
                            .orElseGet(() -> {
                                Locality newCity = new Locality();
                                newCity.setLocality(cityName);
                                if (dto.getZipCode() != null) {
                                    try {
                                        newCity.setPostalCode(Long.parseLong(dto.getZipCode()));
                                    } catch (Exception e) {
                                        log.warn("Code postal invalide pour {} : {}", cityName, dto.getZipCode());
                                    }
                                }
                                return localityRepository.save(newCity);
                            });

                    // 2. Création de la Location
                    Location loc = new Location();
                    loc.setDesignation(dto.getName());
                    loc.setAddress((dto.getStreet() != null) ? dto.getStreet() : "Adresse non communiquée");
                    loc.setWebsite(dto.getUrl());
                    loc.setLocality(city);

                    locationRepository.save(loc);
                    addedCount++;
                    log.info("Lieu ajouté : {}", dto.getName());
                }
            }
        }
        return addedCount;
    }
}