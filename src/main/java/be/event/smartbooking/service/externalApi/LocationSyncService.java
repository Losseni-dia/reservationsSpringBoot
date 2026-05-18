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

    // Déclenchement toutes les 60 secondes (1 minute)
    @Scheduled(fixedRate = 60000)
    public void scheduledSync() {
        log.info(">>> DÉMARRAGE DE LA SYNCHRONISATION MINUTÉE (Objectif : +2)");
        try {
            // fetchLimit à 100 : on regarde les 100 premiers résultats de l'API
            // maxToAdd à 2 : on s'arrête dès qu'on a inséré 2 nouveaux lieux
            int added = syncLocations(100, 2);

            if (added > 0) {
                log.info(">>> SUCCESS : {} nouveaux lieux ajoutés. Nouveau total en base : {}",
                        added, locationRepository.count());
            } else {
                log.info(">>> RAS : Aucun nouveau lieu trouvé dans les résultats analysés.");
            }
        } catch (Exception e) {
            log.error(">>> ERREUR lors de la synchronisation : {}", e.getMessage());
        }
    }

    /**
     * Synchronise les lieux avec une limite d'analyse et un quota d'insertion.
     */
    public int syncLocations(int fetchLimit, int maxToAdd) {
        LocationApiResponse response = locationClient.fetchAllVenues(fetchLimit);
        int addedCount = 0;

        if (response != null && response.getResults() != null) {
            for (ExternalLocationDTO dto : response.getResults()) {

                // 🛑 CONDITION CRUCIALE : On s'arrête si le quota de +2 est atteint
                if (addedCount >= maxToAdd) {
                    log.info(">>> Quota de {} ajouts atteint pour cette minute. Fin du batch.", maxToAdd);
                    break;
                }

                // 1. Vérification du nom pour éviter les doublons
                if (dto.getName() != null && !locationRepository.existsByDesignation(dto.getName())) {

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

                        // Sauvegarde
                        locationRepository.save(loc);
                        addedCount++; // On incrémente notre compteur d'ajouts réussis
                        log.info("[BATCH] Lieu ajouté : {}", dto.getName());

                    } catch (Exception e) {
                        log.error("Erreur technique lors de l'ajout de '{}' : {}", dto.getName(), e.getMessage());
                    }
                } else if (dto.getName() != null) {
                    // On ne fait rien si le lieu existe déjà, la boucle continue vers le suivant
                    // pour essayer de trouver un lieu qui n'est pas encore en base.
                }
            }
        }
        return addedCount;
    }
}