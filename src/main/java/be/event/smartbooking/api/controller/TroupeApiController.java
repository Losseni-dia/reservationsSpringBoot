package be.event.smartbooking.api.controller;

import be.event.smartbooking.dto.TroupeDTO;
import be.event.smartbooking.service.TroupeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/troupes")
public class TroupeApiController {

    @Autowired
    private TroupeService troupeService;

    /**
     * GET /api/troupes : Liste toutes les troupes (public)
     */
    @GetMapping
    public ResponseEntity<List<TroupeDTO>> getAll() {
        List<TroupeDTO> dtos = troupeService.getAll().stream()
                .map(t -> TroupeDTO.builder()
                        .id(t.getId())
                        .name(t.getName())
                        .logoUrl(t.getLogoUrl())
                        .build())
                .toList();
        return ResponseEntity.ok(dtos);
    }

    /**
     * PUT /api/troupes/artists/{artistId} : Affecte ou désaffilier un artiste (ADMIN uniquement)
     * Body : { "troupeId": 1 }  — ou { "troupeId": null } pour désaffilier
     */
    @PutMapping("/artists/{artistId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'admin')")
    public ResponseEntity<Void> assignArtist(
            @PathVariable Long artistId,
            @RequestBody Map<String, Object> body) {

        Long troupeId = body.get("troupeId") != null
                ? Long.valueOf(body.get("troupeId").toString())
                : null;

        troupeService.assignArtistToTroupe(artistId, troupeId);
        return ResponseEntity.ok().build();
    }
}
