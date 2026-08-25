package be.event.smartbooking.api.controller;

import be.event.smartbooking.dto.TagDTO;
import be.event.smartbooking.model.Tag;
import be.event.smartbooking.service.TagService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tags")
public class TagApiController {

    @Autowired
    private TagService tagService;

    /**
     * GET /api/tags : Liste tous les tags existants
     */
    @GetMapping
    public ResponseEntity<List<TagDTO>> getAll() {
        List<TagDTO> dtos = tagService.getAll().stream()
                .map(t -> TagDTO.builder()
                .id(t.getId())
                .tag(t.getTag())
                .build())
                .toList();
        return ResponseEntity.ok(dtos);
    }

    /**
     * POST /api/tags/shows/{showId} : Ajoute un tag à un spectacle (ADMIN uniquement)
     */
    @PostMapping("/shows/{showId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'admin')")
    public ResponseEntity<TagDTO> addTagToShow(
            @PathVariable Long showId,
            @RequestBody Map<String, String> body) {

        String tagName = body.get("tag");
        if (tagName == null || tagName.isBlank()) {
            return ResponseEntity.badRequest().build();
        }

        Tag saved = tagService.addTagToShow(showId, tagName);
        TagDTO dto = TagDTO.builder()
                .id(saved.getId())
                .tag(saved.getTag())
                .build();
        return ResponseEntity.status(HttpStatus.CREATED).body(dto);
    }
}
