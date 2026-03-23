package be.event.smartbooking.api.controller.externalApi;

import be.event.smartbooking.service.externalApi.LocationSyncService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class SyncApiController {

    @Autowired
    private LocationSyncService locationSyncService;

    /**
     * URL pour tester : http://localhost:8080/api/admin/sync-locations?limit=10
     */
    @GetMapping("/sync-locations")
    public ResponseEntity<?> triggerSync(@RequestParam(defaultValue = "20") int limit) {
        try {
            // On lance la synchronisation
            int count = locationSyncService.syncLocations(limit);

            return ResponseEntity.ok(Map.of(
                    "status", "success",
                    "message", "Synchronisation terminée avec succès",
                    "items_added", count));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                    "status", "error",
                    "message", "La synchronisation a échoué : " + e.getMessage()));
        }
    }
}
