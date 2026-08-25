package be.event.smartbooking.api.controller;

import be.event.smartbooking.dto.VideoDTO;
import be.event.smartbooking.model.Video;
import be.event.smartbooking.service.VideoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/videos")
public class VideoApiController {

    @Autowired
    private VideoService videoService;

    /**
     * GET /api/videos/show/{showId} : Toutes les vidéos d'un spectacle
     */
    @GetMapping("/show/{showId}")
    public ResponseEntity<List<VideoDTO>> getByShow(@PathVariable Long showId) {
        List<VideoDTO> dtos = videoService.getByShow(showId).stream()
                .map(v -> VideoDTO.builder()
                        .id(v.getId())
                        .title(v.getTitle())
                        .videoUrl(v.getVideoUrl())
                        .showId(v.getShow().getId())
                        .showTitle(v.getShow().getTitle())
                        .build())
                .toList();
        return ResponseEntity.ok(dtos);
    }

    /**
     * POST /api/videos/show/{showId} : Ajoute une vidéo à un spectacle (ADMIN uniquement)
     * Body : { "title": "...", "videoUrl": "..." }
     */
    @PostMapping("/show/{showId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'admin')")
    public ResponseEntity<VideoDTO> addToShow(
            @PathVariable Long showId,
            @RequestBody Map<String, String> body) {

        String title = body.get("title");
        String videoUrl = body.get("videoUrl");

        if (title == null || title.isBlank() || videoUrl == null || videoUrl.isBlank()) {
            return ResponseEntity.badRequest().build();
        }

        Video saved = videoService.addVideoToShow(showId, title, videoUrl);
        VideoDTO dto = VideoDTO.builder()
                .id(saved.getId())
                .title(saved.getTitle())
                .videoUrl(saved.getVideoUrl())
                .showId(showId)
                .showTitle(saved.getShow().getTitle())
                .build();
        return ResponseEntity.status(HttpStatus.CREATED).body(dto);
    }

    /**
     * GET /api/videos/by-artist/{lastname} : Vidéos associées à un artiste
     * Retourne { "artist": lastname, "total": N, "videos": [...] }
     */
    @GetMapping("/by-artist/{lastname}")
    public ResponseEntity<Map<String, Object>> getByArtist(@PathVariable String lastname) {
        List<Video> videos = videoService.getVideosByArtistLastname(lastname);
        List<VideoDTO> dtos = videos.stream()
                .map(v -> VideoDTO.builder()
                        .id(v.getId())
                        .title(v.getTitle())
                        .videoUrl(v.getVideoUrl())
                        .showId(v.getShow().getId())
                        .showTitle(v.getShow().getTitle())
                        .build())
                .toList();

        Map<String, Object> result = new HashMap<>();
        result.put("artist", lastname);
        result.put("total", dtos.size());
        result.put("videos", dtos);
        return ResponseEntity.ok(result);
    }
}
