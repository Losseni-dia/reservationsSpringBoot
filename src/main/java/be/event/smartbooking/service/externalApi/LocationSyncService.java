package be.event.smartbooking.service.externalApi;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

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

    @Scheduled(cron = "0 0 3 1,16 * *")
    public void scheduledSync() {
        log.info(">>> DÉMARRAGE DE LA SYNCHRONISATION AUTOMATIQUE (Bimensuelle)");
        try {
            int added = syncLocations(10);
            log.info(">>> SYNCHRONISATION TERMINÉE : {} nouveaux lieux ajoutés.", added);
        } catch (Exception e) {
            log.error(">>> ERREUR lors de la synchronisation automatique : {}", e.getMessage());
        }
    }

    /**
     * Note: On enlève le @Transactional ici pour permettre de sauvegarder
     * les lieux un par un même si l'un d'eux échoue.
     */
    public int syncLocations(int limit) {
        LocationApiResponse response = locationClient.fetchAllVenues(limit);
        int addedCount = 0;

        if (response != null && response.getResults() != null) {
            for (ExternalLocationDTO dto : response.getResults()) {

                // 1. Vérification du nom pour éviter les doublons métier
                if (dto.getName() != null && !locationRepository.existsByDesignation(dto.getName())) {

                    // --- SÉCURITÉ : Try-catch par élément pour éviter de bloquer tout l'import ---
                    try {
                        // Gestion de la localité
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

                        // Création du lieu
                        Location loc = new Location();
                        loc.setDesignation(dto.getName());
                        loc.setAddress((dto.getStreet() != null) ? dto.getStreet() : "Adresse non communiquée");
                        loc.setWebsite(dto.getUrl());
                        loc.setLocality(city);

                        // Sauvegarde individuelle
                        locationRepository.save(loc);
                        addedCount++;
                        log.info("Lieu ajouté avec succès : {}", dto.getName());

                    } catch (Exception e) {
                        // Si une erreur d'ID (Duplicate Entry) survient, on log l'erreur et on passe au
                        // suivant
                        log.error("Erreur technique lors de l'ajout de '{}' : {}", dto.getName(), e.getMessage());
                    }
                } else if (dto.getName() != null) {
                    log.info("Le lieu '{}' existe déjà (doublon ignoré).", dto.getName());
                }
            }
        }
        return addedCount;
    }
}